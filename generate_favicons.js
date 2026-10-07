const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// CRC32 helper for PNG
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    raw[rowOffset] = 0; // filter none
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Distance from point to line segment with thickness
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Smooth anti-aliased alpha blending
function blend(bg, fg, alpha) {
  return [
    Math.round(bg[0] * (1 - alpha) + fg[0] * alpha),
    Math.round(bg[1] * (1 - alpha) + fg[1] * alpha),
    Math.round(bg[2] * (1 - alpha) + fg[2] * alpha),
    Math.round(bg[3] * (1 - alpha) + fg[3] * alpha)
  ];
}

// Renderer for high-contrast, beautiful DSA Logo
function renderLogoPixel(x, y, size) {
  const scale = size / 48;
  const nx = x / scale;
  const ny = y / scale;

  // Background #070a0f with rounded rectangle (rx=10 at 48px)
  let bgR = 7, bgG = 10, bgB = 15, bgA = 255;
  const cornerR = 10;
  let inBounds = true;
  if (nx < cornerR && ny < cornerR) {
    if (Math.hypot(nx - cornerR, ny - cornerR) > cornerR) inBounds = false;
  } else if (nx > 48 - cornerR && ny < cornerR) {
    if (Math.hypot(nx - (48 - cornerR), ny - cornerR) > cornerR) inBounds = false;
  } else if (nx < cornerR && ny > 48 - cornerR) {
    if (Math.hypot(nx - cornerR, ny - (48 - cornerR)) > cornerR) inBounds = false;
  } else if (nx > 48 - cornerR && ny > 48 - cornerR) {
    if (Math.hypot(nx - (48 - cornerR), ny - (48 - cornerR)) > cornerR) inBounds = false;
  }

  if (!inBounds) {
    return [0, 0, 0, 0]; // Transparent outside rounded corner
  }

  let color = [bgR, bgG, bgB, bgA];

  // Subtle dark gradient background
  const grad = Math.min(1, Math.max(0, ny / 48));
  color[0] = Math.round(9 - 4 * grad);
  color[1] = Math.round(15 - 5 * grad);
  color[2] = Math.round(24 - 8 * grad);

  // Nodes geometry:
  // Node 1 (Root, Teal #14b8a6): (24, 11), r=6
  // Node 2 (Left child, Sky #38bdf8): (12, 35), r=6
  // Node 3 (Right child, Indigo #818cf8): (36, 35), r=6
  // Node 4 (Center pivot, Amber #f59e0b): (24, 24), r=4.5
  const n1 = { x: 24, y: 11, r: 6.2, col: [20, 184, 166, 255] };
  const n2 = { x: 12, y: 35, r: 6.2, col: [56, 189, 248, 255] };
  const n3 = { x: 36, y: 35, r: 6.2, col: [129, 140, 248, 255] };
  const n4 = { x: 24, y: 24, r: 4.8, col: [245, 158, 11, 255] };

  // Edges:
  // Edge 1: n1 -> n2 (width 3)
  // Edge 2: n1 -> n3 (width 3)
  // Edge 3: n2 -> n3 (width 2.8)
  // Edge 4: n1 -> n4 (width 2.5)
  const edges = [
    { p1: n1, p2: n2, w: 3.2, col: [20, 184, 166, 230] },
    { p1: n1, p2: n3, w: 3.2, col: [20, 184, 166, 230] },
    { p1: n2, p2: n3, w: 2.8, col: [56, 189, 248, 220] },
    { p1: n1, p2: n4, w: 2.5, col: [245, 158, 11, 230] },
    { p1: n4, p2: n2, w: 2.2, col: [245, 158, 11, 190] }
  ];

  // Draw edges
  for (const edge of edges) {
    const d = distToSegment(nx, ny, edge.p1.x, edge.p1.y, edge.p2.x, edge.p2.y);
    const halfW = edge.w / 2;
    if (d < halfW + 0.9) {
      const alpha = Math.max(0, Math.min(1, (halfW + 0.9 - d) / 1.0)) * (edge.col[3] / 255);
      color = blend(color, edge.col, alpha);
    }
  }

  // Draw nodes (with glow + solid core + white highlight)
  const nodes = [n4, n2, n3, n1];
  for (const node of nodes) {
    const d = Math.hypot(nx - node.x, ny - node.y);
    // Outer glow
    if (d < node.r + 2.5) {
      const glowAlpha = Math.max(0, Math.min(0.4, (node.r + 2.5 - d) / 3.0));
      color = blend(color, node.col, glowAlpha);
    }
    // Solid node body
    if (d < node.r + 0.6) {
      const alpha = Math.max(0, Math.min(1, (node.r + 0.6 - d) / 0.8));
      color = blend(color, node.col, alpha);
      // Inner highlight
      const hd = Math.hypot(nx - (node.x - node.r * 0.28), ny - (node.y - node.r * 0.28));
      if (hd < node.r * 0.45) {
        const hAlpha = Math.max(0, Math.min(0.75, (node.r * 0.45 - hd) / (node.r * 0.35)));
        color = blend(color, [255, 255, 255, 255], hAlpha);
      }
    }
  }

  return color;
}

// Build multi-resolution .ico containing 16x16, 32x32, 48x48 PNGs
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerLen = 6;
  const dirEntryLen = 16;
  const totalHeaderLen = headerLen + count * dirEntryLen;

  let currentOffset = totalHeaderLen;
  const entries = [];

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry[0] = item.width >= 256 ? 0 : item.width;
    entry[1] = item.height >= 256 ? 0 : item.height;
    entry[2] = 0; // color palette
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    entries.push(entry);
    currentOffset += item.buffer.length;
  }

  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0); // reserved
  iconDir.writeUInt16LE(1, 2); // type 1 = ICO
  iconDir.writeUInt16LE(count, 4); // count

  return Buffer.concat([
    iconDir,
    ...entries,
    ...pngBuffers.map(x => x.buffer)
  ]);
}

console.log('Generating high-resolution favicon and brand assets...');

// Generate PNG sizes
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'favicon-192x192.png' },
  { size: 512, name: 'favicon-512x512.png' }
];

const pngMap = {};
for (const item of sizes) {
  const buf = createPng(item.size, item.size, (x, y) => renderLogoPixel(x, y, item.size));
  fs.writeFileSync(item.name, buf);
  pngMap[item.size] = buf;
  console.log(`✅ Generated ${item.name} (${item.size}x${item.size}, ${buf.length} bytes)`);
}

// Generate multi-size favicon.ico (16, 32, 48)
const icoBuf = buildIco([
  { width: 16, height: 16, buffer: pngMap[16] },
  { width: 32, height: 32, buffer: pngMap[32] },
  { width: 48, height: 48, buffer: pngMap[48] }
]);
fs.writeFileSync('favicon.ico', icoBuf);
console.log(`✅ Generated favicon.ico (Multi-size 16/32/48, ${icoBuf.length} bytes)`);

// Generate site.webmanifest
const manifest = {
  name: "DSA Algo Lab",
  short_name: "DSA Lab",
  description: "22 Interactive Algorithm Visualizers and Simulators",
  start_url: "/",
  display: "standalone",
  background_color: "#070a0f",
  theme_color: "#070a0f",
  icons: [
    {
      src: "/favicon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/favicon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ]
};
fs.writeFileSync('site.webmanifest', JSON.stringify(manifest, null, 2));
console.log('✅ Generated site.webmanifest');

console.log('All favicon assets generated successfully!');
