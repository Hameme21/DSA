// new_modules.js
// Standalone definitions of:
// 1. BubbleSortModule
// 2. SelectionSortModule
// 3. InsertionSortModule
// 4. MergeSortModule
// 5. QuickSortModule
// 6. HeapSortModule
// 7. BfsModule
// 8. DfsModule
// 9. LinkedListModule
// 10. BinaryHeapModule
// 11. BstModule

const SortingRenderer = {
  renderCanvas(svg, step) {
    const arr = step.array || [];
    const n = arr.length;
    if (n === 0) {
      svg.innerHTML = '<text x="400" y="150" fill="#94a3b8" text-anchor="middle" font-family="JetBrains Mono">Empty Array</text>';
      return;
    }
    const maxVal = Math.max(...arr, 1);
    const barW = Math.max(26, Math.min(65, Math.floor((700 - (n - 1) * 8) / n)));
    const gap = 8;
    const totalW = n * barW + (n - 1) * gap;
    const startX = Math.round(40 + (720 - totalW) / 2);
    const baseLineY = 260;

    let html = '<defs>' +
      '<marker id="sort-arrow-i" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 0 L 10 0 L 5 10 z" fill="#f59e0b"/>' +
      '</marker>' +
      '<marker id="sort-arrow-j" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 0 L 10 0 L 5 10 z" fill="#8b5cf6"/>' +
      '</marker>' +
    '</defs>';

    html += '<text x="40" y="32" fill="#94a3b8" font-size="12" font-family="JetBrains Mono" font-weight="600">Array Size: <tspan fill="#14b8a6">' + n + '</tspan> &bull; Comparisons: <tspan fill="#f59e0b">' + (step.comparisons || 0) + '</tspan> &bull; Swaps/Writes: <tspan fill="#f43f5e">' + (step.swaps || 0) + '</tspan></text>';

    if (step.subRange) {
      const l = step.subRange[0], r = step.subRange[1];
      const subX = startX + l * (barW + gap) - 4;
      const subW = (r - l + 1) * (barW + gap) - gap + 8;
      html += '<rect x="' + subX + '" y="50" width="' + subW + '" height="' + (baseLineY - 30) + '" rx="8" fill="rgba(14, 165, 233, 0.05)" stroke="rgba(14, 165, 233, 0.3)" stroke-dasharray="4,4"/>';
      html += '<text x="' + (subX + subW / 2) + '" y="44" fill="#0ea5e9" font-size="10" font-family="JetBrains Mono" text-anchor="middle">Active Range [' + l + '..' + r + ']</text>';
    }

    for (let i = 0; i < n; i++) {
      const val = arr[i];
      const barH = Math.max(24, Math.round((val / maxVal) * 160));
      const x = startX + i * (barW + gap);
      const y = baseLineY - barH;

      const isComparing = step.comparing && step.comparing.includes(i);
      const isSwapping = step.swapping && step.swapping.includes(i);
      const isPivot = step.pivotIdx === i;
      const isMin = step.minIdx === i;
      const isSorted = step.sorted && step.sorted.includes(i);

      let fill = '#1e293b', stroke = '#334155', strokeW = 1.5;
      if (isSorted) { fill = 'rgba(16, 185, 129, 0.25)'; stroke = '#10b981'; strokeW = 2; }
      if (isComparing) { fill = 'rgba(245, 158, 11, 0.25)'; stroke = '#f59e0b'; strokeW = 2.5; }
      if (isMin) { fill = 'rgba(139, 92, 246, 0.25)'; stroke = '#8b5cf6'; strokeW = 2.5; }
      if (isPivot) { fill = 'rgba(14, 165, 233, 0.3)'; stroke = '#0ea5e9'; strokeW = 2.5; }
      if (isSwapping) { fill = 'rgba(244, 63, 94, 0.3)'; stroke = '#f43f5e'; strokeW = 2.5; }

      html += '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + barH + '" rx="6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + strokeW + '"/>';
      html += '<text x="' + (x + barW / 2) + '" y="' + (y - 8) + '" text-anchor="middle" fill="' + (isSorted ? '#34d399' : (isComparing ? '#fbbf24' : (isSwapping ? '#fb7185' : '#fff'))) + '" font-size="12" font-family="JetBrains Mono" font-weight="700">' + val + '</text>';
      html += '<text x="' + (x + barW / 2) + '" y="' + (baseLineY + 18) + '" text-anchor="middle" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + i + '</text>';

      if (step.ptr1 === i) {
        html += '<line x1="' + (x + barW / 2) + '" y1="' + (y - 34) + '" x2="' + (x + barW / 2) + '" y2="' + (y - 16) + '" stroke="#f59e0b" stroke-width="2" marker-end="url(#sort-arrow-i)"/>';
        html += '<text x="' + (x + barW / 2) + '" y="' + (y - 40) + '" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="JetBrains Mono" font-weight="700">' + (step.ptr1Label || 'i') + '</text>';
      }
      if (step.ptr2 === i) {
        html += '<line x1="' + (x + barW / 2) + '" y1="' + (y - 34) + '" x2="' + (x + barW / 2) + '" y2="' + (y - 16) + '" stroke="#8b5cf6" stroke-width="2" marker-end="url(#sort-arrow-j)"/>';
        html += '<text x="' + (x + barW / 2) + '" y="' + (y - 40) + '" text-anchor="middle" fill="#8b5cf6" font-size="10" font-family="JetBrains Mono" font-weight="700">' + (step.ptr2Label || 'j') + '</text>';
      }
      if (isPivot) {
        html += '<text x="' + (x + barW / 2) + '" y="' + (baseLineY + 34) + '" text-anchor="middle" fill="#0ea5e9" font-size="9" font-family="JetBrains Mono" font-weight="700">PIVOT</text>';
      }
    }

    if (step.auxArray && step.auxArray.length > 0) {
      const aux = step.auxArray;
      html += '<text x="40" y="310" fill="#94a3b8" font-size="11" font-family="JetBrains Mono">Auxiliary Buffer: </text>';
      for (let k = 0; k < aux.length; k++) {
        const ax = 170 + k * 42;
        html += '<rect x="' + ax + '" y="295" width="36" height="24" rx="4" fill="#141d2c" stroke="#334155"/>';
        html += '<text x="' + (ax + 18) + '" y="311" text-anchor="middle" fill="#14b8a6" font-size="11" font-family="JetBrains Mono" font-weight="700">' + aux[k] + '</text>';
      }
    }

    svg.setAttribute('viewBox', '0 0 800 350');
    svg.innerHTML = html;
  },

  renderTable(thead, tbody, step) {
    thead.innerHTML = '<tr><th>Index [i]</th><th>Value</th><th>Status</th><th>Pointer Flags</th></tr>';
    const arr = step.array || [];
    let rows = '';
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const isSorted = step.sorted && step.sorted.includes(i);
      const isComp = step.comparing && step.comparing.includes(i);
      const isSwap = step.swapping && step.swapping.includes(i);
      const isPiv = step.pivotIdx === i;

      let status = '<span style="color:var(--text-dim)">Unsorted</span>';
      if (isSorted) status = '<span style="color:var(--emerald); font-weight:700;">Locked Sorted</span>';
      else if (isSwap) status = '<span style="color:var(--rose); font-weight:700;">Swapping</span>';
      else if (isComp) status = '<span style="color:var(--amber); font-weight:600;">Active Comparison</span>';
      else if (isPiv) status = '<span style="color:var(--sky); font-weight:700;">Partition Pivot</span>';

      const flags = [];
      if (step.ptr1 === i) flags.push(step.ptr1Label || 'i');
      if (step.ptr2 === i) flags.push(step.ptr2Label || 'j');
      if (isPiv) flags.push('pivot');

      const isAct = isComp || isSwap || isPiv;
      rows += '<tr class="' + (isAct ? 'active-row' : '') + '">' +
        '<td><b>' + i + '</b></td>' +
        '<td><b style="color:' + (isSorted ? 'var(--emerald)' : (isAct ? 'var(--amber)' : '#fff')) + '">' + val + '</b></td>' +
        '<td>' + status + '</td>' +
        '<td><code>' + (flags.length ? flags.join(', ') : '—') + '</code></td>' +
      '</tr>';
    }
    tbody.innerHTML = rows;
  }
};

/* 1. BUBBLE SORT MODULE */
const BubbleSortModule = {
  array: [45, 12, 85, 32, 89, 39, 69, 22],
  presets: [
    { name: "Standard Unsorted", array: [45, 12, 85, 32, 89, 39, 69, 22] },
    { name: "Nearly Sorted", array: [10, 20, 40, 30, 50, 60, 80, 70] },
    { name: "Reverse Sorted", array: [90, 80, 70, 60, 50, 40, 30, 20] }
  ],
  pseudocode: [
    { line: 1, code: "BUBBLE-SORT(A):", func: true },
    { line: 2, code: "  n = A.length" },
    { line: 3, code: "  for i = 0 to n - 2:" },
    { line: 4, code: "    swapped = false" },
    { line: 5, code: "    for j = 0 to n - i - 2:" },
    { line: 6, code: "      if A[j] > A[j+1]:" },
    { line: 7, code: "        swap(A[j], A[j+1]); swapped = true" },
    { line: 8, code: "    if not swapped: break" }
  ],
  theory: {
    time: "Worst O(n²), Best O(n)",
    space: "O(1) auxiliary",
    strategy: "Adjacent Pairwise Bubbling",
    desc: "Compares adjacent elements and swaps them if out of order. At the end of pass i, the largest unsorted element is guaranteed to bubble up to its final position."
  },
  generateRandom() {
    const arr = [];
    for (let i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 85) + 10);
    return { array: arr };
  },
  buildSteps(initArr) {
    const arr = [...initArr];
    const n = arr.length;
    const steps = [];
    let comparisons = 0, swaps = 0;
    const sorted = [];

    steps.push({
      lineHighlight: 2,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Bubble Sort Initialized:</b> Ready to begin pairwise bubbling passes."
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({
          lineHighlight: 6,
          array: [...arr],
          sorted: [...sorted],
          comparing: [j, j + 1],
          ptr1: j, ptr1Label: 'j',
          ptr2: j + 1, ptr2Label: 'j+1',
          comparisons, swaps,
          desc: "<b>Pass " + (i + 1) + ":</b> Comparing $A[" + j + "] = " + arr[j] + "$ and $A[" + (j + 1) + "] = " + arr[j + 1] + "$." +
                (arr[j] > arr[j + 1] ? " " + arr[j] + " > " + arr[j + 1] + " &rarr; <span class='tag-reject'>SWAP NEEDED</span>." : " Order correct &rarr; <span class='tag-take'>KEEP</span>.")
        });

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          swapped = true;
          steps.push({
            lineHighlight: 7,
            array: [...arr],
            sorted: [...sorted],
            swapping: [j, j + 1],
            ptr1: j, ptr1Label: 'j',
            ptr2: j + 1, ptr2Label: 'j+1',
            comparisons, swaps,
            desc: "<b>Swapped:</b> Moved " + arr[j + 1] + " to index " + (j + 1) + " and " + arr[j] + " to index " + j + "."
          });
        }
      }
      sorted.push(n - i - 1);
      steps.push({
        lineHighlight: 5,
        array: [...arr],
        sorted: [...sorted],
        comparisons, swaps,
        desc: "<b>Pass " + (i + 1) + " Complete:</b> Element " + arr[n - i - 1] + " locked into sorted position."
      });
      if (!swapped) break;
    }
    for (let k = 0; k < n; k++) if (!sorted.includes(k)) sorted.push(k);
    steps.push({
      lineHighlight: 1,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Bubble Sort Complete:</b> Array sorted in " + comparisons + " comparisons and " + swaps + " swaps."
    });
    return steps;
  },
  renderCanvas: SortingRenderer.renderCanvas,
  renderTable: SortingRenderer.renderTable,
  legend: [
    { color: 'var(--amber)', label: 'Comparing Pair' },
    { color: 'var(--rose)', label: 'Swapping Elements' },
    { color: 'var(--emerald)', label: 'Sorted Region' }
  ]
};

/* 2. SELECTION SORT MODULE */
const SelectionSortModule = {
  array: [64, 25, 12, 22, 11, 90, 34, 48],
  presets: [
    { name: "CLRS Standard", array: [64, 25, 12, 22, 11, 90, 34, 48] },
    { name: "Reverse Order", array: [80, 70, 60, 50, 40, 30, 20, 10] },
    { name: "Already Sorted", array: [10, 20, 30, 40, 50, 60, 70, 80] }
  ],
  pseudocode: [
    { line: 1, code: "SELECTION-SORT(A):", func: true },
    { line: 2, code: "  n = A.length" },
    { line: 3, code: "  for i = 0 to n - 2:" },
    { line: 4, code: "    min_idx = i" },
    { line: 5, code: "    for j = i + 1 to n - 1:" },
    { line: 6, code: "      if A[j] < A[min_idx]: min_idx = j" },
    { line: 7, code: "    if min_idx != i: swap(A[i], A[min_idx])" }
  ],
  theory: {
    time: "O(n²) in all cases",
    space: "O(1) auxiliary",
    strategy: "Greedy Suffix Minimum Selection",
    desc: "Scans the unsorted suffix [i..n-1] for the minimum value, then swaps it with A[i]. Guarantees at most n swaps."
  },
  generateRandom() {
    const arr = [];
    for (let i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 85) + 10);
    return { array: arr };
  },
  buildSteps(initArr) {
    const arr = [...initArr];
    const n = arr.length;
    const steps = [];
    let comparisons = 0, swaps = 0;
    const sorted = [];

    steps.push({
      lineHighlight: 2,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Selection Sort Initialized:</b> Searching for minimum in unsorted suffix."
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        lineHighlight: 4,
        array: [...arr],
        sorted: [...sorted],
        ptr1: i, ptr1Label: 'i',
        minIdx,
        comparisons, swaps,
        desc: "<b>Iteration " + (i + 1) + ":</b> Candidate minimum $A[" + i + "] = " + arr[i] + "$. Scanning suffix."
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        const isNewMin = arr[j] < arr[minIdx];
        steps.push({
          lineHighlight: 6,
          array: [...arr],
          sorted: [...sorted],
          comparing: [j, minIdx],
          ptr1: i, ptr1Label: 'i',
          ptr2: j, ptr2Label: 'j',
          minIdx,
          comparisons, swaps,
          desc: "Comparing $A[" + j + "] = " + arr[j] + "$ with current min $A[" + minIdx + "] = " + arr[minIdx] + "$." +
                (isNewMin ? " <span class='tag-take'>NEW MINIMUM FOUND!</span>" : " No change.")
        });
        if (isNewMin) minIdx = j;
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        swaps++;
        steps.push({
          lineHighlight: 7,
          array: [...arr],
          sorted: [...sorted],
          swapping: [i, minIdx],
          ptr1: i, ptr1Label: 'i',
          minIdx,
          comparisons, swaps,
          desc: "Swapped minimum " + arr[i] + " into position " + i + "."
        });
      }
      sorted.push(i);
    }
    sorted.push(n - 1);
    steps.push({
      lineHighlight: 1,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Selection Sort Complete:</b> Array sorted in " + comparisons + " comparisons."
    });
    return steps;
  },
  renderCanvas: SortingRenderer.renderCanvas,
  renderTable: SortingRenderer.renderTable,
  legend: [
    { color: 'var(--amber)', label: 'Scanning Pointer' },
    { color: 'var(--violet)', label: 'Suffix Minimum' },
    { color: 'var(--emerald)', label: 'Sorted Region' }
  ]
};

/* 3. INSERTION SORT MODULE */
const InsertionSortModule = {
  array: [52, 38, 74, 18, 95, 42, 63, 21],
  presets: [
    { name: "CLRS Textbook", array: [52, 38, 74, 18, 95, 42, 63, 21] },
    { name: "Inverted Array", array: [88, 77, 66, 55, 44, 33, 22, 11] },
    { name: "Almost Sorted", array: [15, 25, 35, 65, 45, 55, 75, 85] }
  ],
  pseudocode: [
    { line: 1, code: "INSERTION-SORT(A):", func: true },
    { line: 2, code: "  for i = 1 to A.length - 1:" },
    { line: 3, code: "    key = A[i]; j = i - 1" },
    { line: 4, code: "    while j >= 0 and A[j] > key:" },
    { line: 5, code: "      A[j + 1] = A[j]; j = j - 1" },
    { line: 6, code: "    A[j + 1] = key" }
  ],
  theory: {
    time: "Worst O(n²), Best O(n)",
    space: "O(1) auxiliary",
    strategy: "Incremental Insertion into Sorted Prefix",
    desc: "Maintains a sorted prefix. Each step extracts the key element, shifts larger elements to the right, and drops the key into its correct position."
  },
  generateRandom() {
    const arr = [];
    for (let i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 85) + 10);
    return { array: arr };
  },
  buildSteps(initArr) {
    const arr = [...initArr];
    const n = arr.length;
    const steps = [];
    let comparisons = 0, swaps = 0;
    const sorted = [0];

    steps.push({
      lineHighlight: 2,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Insertion Sort Initialized:</b> Element $A[0] = " + arr[0] + "$ is trivially sorted."
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        lineHighlight: 3,
        array: [...arr],
        sorted: [...sorted],
        ptr1: i, ptr1Label: 'key',
        comparisons, swaps,
        desc: "<b>Key Selected:</b> $A[" + i + "] = " + key + "$. Preparing to shift larger prefix elements."
      });

      while (j >= 0) {
        comparisons++;
        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          swaps++;
          steps.push({
            lineHighlight: 5,
            array: [...arr],
            sorted: [...sorted],
            swapping: [j + 1],
            ptr1: j, ptr1Label: 'j',
            comparisons, swaps,
            desc: "Shifted " + arr[j + 1] + " rightward to index " + (j + 1) + "."
          });
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      swaps++;
      sorted.push(i);
      steps.push({
        lineHighlight: 6,
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        swapping: [j + 1],
        ptr1: j + 1, ptr1Label: 'inserted',
        comparisons, swaps,
        desc: "<b>Inserted Key:</b> Placed " + key + " at index " + (j + 1) + "."
      });
    }

    steps.push({
      lineHighlight: 1,
      array: [...arr],
      sorted: Array.from({ length: n }, (_, k) => k),
      comparisons, swaps,
      desc: "<b>Insertion Sort Complete:</b> Array sorted in " + comparisons + " comparisons."
    });
    return steps;
  },
  renderCanvas: SortingRenderer.renderCanvas,
  renderTable: SortingRenderer.renderTable,
  legend: [
    { color: 'var(--amber)', label: 'Active Key' },
    { color: 'var(--rose)', label: 'Shift / Insert' },
    { color: 'var(--emerald)', label: 'Sorted Prefix' }
  ]
};

/* 4. MERGE SORT MODULE */
const MergeSortModule = {
  array: [38, 27, 43, 3, 9, 82, 10, 19],
  presets: [
    { name: "CLRS Classic 8 Items", array: [38, 27, 43, 3, 9, 82, 10, 19] },
    { name: "Alternating Peaks", array: [70, 20, 80, 10, 60, 30, 90, 40] }
  ],
  pseudocode: [
    { line: 1, code: "MERGE-SORT(A, p, r):", func: true },
    { line: 2, code: "  if p < r:" },
    { line: 3, code: "    q = floor((p + r) / 2)" },
    { line: 4, code: "    MERGE-SORT(A, p, q); MERGE-SORT(A, q + 1, r)" },
    { line: 5, code: "    MERGE(A, p, q, r)" }
  ],
  theory: {
    time: "O(n log n) in all cases",
    space: "O(n) auxiliary buffer",
    strategy: "Divide and Conquer",
    desc: "Recursively divides array into single-element subarrays, then merges adjacent sorted runs into larger sorted sequences."
  },
  generateRandom() {
    const arr = [];
    for (let i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 85) + 10);
    return { array: arr };
  },
  buildSteps(initArr) {
    const arr = [...initArr];
    const steps = [];
    let comparisons = 0, swaps = 0;

    steps.push({
      lineHighlight: 1,
      array: [...arr],
      comparisons, swaps,
      desc: "<b>Merge Sort Initialized:</b> Divide-and-conquer on " + arr.length + " elements."
    });

    function merge(l, m, r) {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0, j = 0;
      const aux = [];

      while (i < left.length && j < right.length) {
        comparisons++;
        steps.push({
          lineHighlight: 5,
          array: [...arr],
          subRange: [l, r],
          comparing: [l + i, m + 1 + j],
          ptr1: l + i, ptr1Label: 'L',
          ptr2: m + 1 + j, ptr2Label: 'R',
          auxArray: [...aux],
          comparisons, swaps,
          desc: "Merging: Comparing " + left[i] + " with " + right[j] + "."
        });
        if (left[i] <= right[j]) { aux.push(left[i]); i++; }
        else { aux.push(right[j]); j++; }
      }
      while (i < left.length) { aux.push(left[i]); i++; }
      while (j < right.length) { aux.push(right[j]); j++; }

      for (let idx = 0; idx < aux.length; idx++) {
        arr[l + idx] = aux[idx];
        swaps++;
      }

      steps.push({
        lineHighlight: 5,
        array: [...arr],
        subRange: [l, r],
        sorted: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        auxArray: [...aux],
        comparisons, swaps,
        desc: "<b>Merged Run:</b> Copied [" + aux.join(', ') + "] back into array range [" + l + ".." + r + "]."
      });
    }

    function sort(l, r) {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
    }

    sort(0, arr.length - 1);
    steps.push({
      lineHighlight: 1,
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, k) => k),
      comparisons, swaps,
      desc: "<b>Merge Sort Complete:</b> Entire array sorted."
    });
    return steps;
  },
  renderCanvas: SortingRenderer.renderCanvas,
  renderTable: SortingRenderer.renderTable,
  legend: [
    { color: 'var(--amber)', label: 'Active Comparison' },
    { color: 'var(--sky)', label: 'Subarray Bounds' },
    { color: 'var(--emerald)', label: 'Merged Sorted Subarray' }
  ]
};

/* 5. QUICK SORT MODULE */
const QuickSortModule = {
  array: [50, 23, 9, 18, 61, 32, 85, 41],
  presets: [
    { name: "CLRS Standard", array: [50, 23, 9, 18, 61, 32, 85, 41] },
    { name: "Already Sorted", array: [10, 20, 30, 40, 50, 60, 70, 80] }
  ],
  pseudocode: [
    { line: 1, code: "QUICKSORT(A, p, r):", func: true },
    { line: 2, code: "  if p < r:" },
    { line: 3, code: "    q = PARTITION(A, p, r)" },
    { line: 4, code: "    QUICKSORT(A, p, q - 1); QUICKSORT(A, q + 1, r)" },
    { line: 5, code: "PARTITION(A, p, r):", func: true },
    { line: 6, code: "  pivot = A[r]; i = p - 1" },
    { line: 7, code: "  for j = p to r - 1: if A[j] <= pivot: i++; swap(A[i], A[j])" },
    { line: 8, code: "  swap(A[i + 1], A[r]); return i + 1" }
  ],
  theory: {
    time: "Average O(n log n), Worst O(n²)",
    space: "O(log n) call stack",
    strategy: "In-Place Lomuto Partitioning",
    desc: "Picks a pivot, places all smaller elements to the left and larger to the right, placing the pivot at its exact sorted position."
  },
  generateRandom() {
    const arr = [];
    for (let i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 85) + 10);
    return { array: arr };
  },
  buildSteps(initArr) {
    const arr = [...initArr];
    const steps = [];
    let comparisons = 0, swaps = 0;
    const sorted = [];

    steps.push({
      lineHighlight: 1,
      array: [...arr],
      comparisons, swaps,
      desc: "<b>Quick Sort Initialized:</b> Lomuto partitioning scheme."
    });

    function partition(p, r) {
      const pivot = arr[r];
      let i = p - 1;

      steps.push({
        lineHighlight: 6,
        array: [...arr],
        subRange: [p, r],
        pivotIdx: r,
        sorted: [...sorted],
        comparisons, swaps,
        desc: "Partitioning [" + p + ".." + r + "]: Selected pivot $A[" + r + "] = " + pivot + "$."
      });

      for (let j = p; j < r; j++) {
        comparisons++;
        const shouldSwap = arr[j] <= pivot;
        steps.push({
          lineHighlight: 7,
          array: [...arr],
          subRange: [p, r],
          comparing: [j, r],
          pivotIdx: r,
          ptr1: i >= p ? i : null, ptr1Label: 'i',
          ptr2: j, ptr2Label: 'j',
          sorted: [...sorted],
          comparisons, swaps,
          desc: "Comparing $A[" + j + "] = " + arr[j] + "$ with pivot " + pivot + "."
        });

        if (shouldSwap) {
          i++;
          if (i !== j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            swaps++;
            steps.push({
              lineHighlight: 7,
              array: [...arr],
              subRange: [p, r],
              swapping: [i, j],
              pivotIdx: r,
              sorted: [...sorted],
              comparisons, swaps,
              desc: "Swapped $A[" + i + "]$ and $A[" + j + "]$."
            });
          }
        }
      }

      const temp = arr[i + 1];
      arr[i + 1] = arr[r];
      arr[r] = temp;
      swaps++;
      const pivotPos = i + 1;
      sorted.push(pivotPos);

      steps.push({
        lineHighlight: 8,
        array: [...arr],
        subRange: [p, r],
        swapping: [pivotPos, r],
        pivotIdx: pivotPos,
        sorted: [...sorted],
        comparisons, swaps,
        desc: "<b>Pivot Locked:</b> Pivot " + arr[pivotPos] + " locked into sorted index " + pivotPos + "."
      });
      return pivotPos;
    }

    function qsort(p, r) {
      if (p < r) {
        const q = partition(p, r);
        qsort(p, q - 1);
        qsort(q + 1, r);
      } else if (p === r) {
        if (!sorted.includes(p)) sorted.push(p);
      }
    }

    qsort(0, arr.length - 1);
    for (let k = 0; k < arr.length; k++) if (!sorted.includes(k)) sorted.push(k);

    steps.push({
      lineHighlight: 1,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Quick Sort Complete:</b> Array sorted."
    });
    return steps;
  },
  renderCanvas: SortingRenderer.renderCanvas,
  renderTable: SortingRenderer.renderTable,
  legend: [
    { color: 'var(--sky)', label: 'Pivot Element' },
    { color: 'var(--amber)', label: 'Scanning Index' },
    { color: 'var(--emerald)', label: 'Locked Sorted Index' }
  ]
};

/* 6. HEAP SORT MODULE */
const HeapSortModule = {
  array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1],
  presets: [
    { name: "CLRS Textbook Max-Heap", array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1] },
    { name: "Reverse Order", array: [90, 80, 70, 60, 50, 40, 30, 20] }
  ],
  pseudocode: [
    { line: 1, code: "HEAPSORT(A):", func: true },
    { line: 2, code: "  BUILD-MAX-HEAP(A)" },
    { line: 3, code: "  for i = A.length - 1 down to 1:" },
    { line: 4, code: "    swap(A[0], A[i]); heap_size = heap_size - 1" },
    { line: 5, code: "    MAX-HEAPIFY(A, 0, heap_size)" }
  ],
  theory: {
    time: "O(n log n) guaranteed",
    space: "O(1) auxiliary",
    strategy: "In-Place Binary Max-Heap Selection",
    desc: "Builds a max-heap, repeatedly extracts root A[0] to the end of the array, and restores heap properties via sift-down."
  },
  generateRandom() {
    const arr = [];
    for (let i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 85) + 10);
    return { array: arr };
  },
  buildSteps(initArr) {
    const arr = [...initArr];
    const n = arr.length;
    const steps = [];
    let comparisons = 0, swaps = 0;
    const sorted = [];

    steps.push({
      lineHighlight: 1,
      array: [...arr],
      comparisons, swaps,
      desc: "<b>Heap Sort Initialized:</b> Phase 1: Build Max-Heap."
    });

    function heapify(size, root) {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < size) {
        comparisons++;
        if (arr[left] > arr[largest]) largest = left;
      }
      if (right < size) {
        comparisons++;
        if (arr[right] > arr[largest]) largest = right;
      }

      if (largest !== root) {
        const temp = arr[root];
        arr[root] = arr[largest];
        arr[largest] = temp;
        swaps++;
        steps.push({
          lineHighlight: 5,
          array: [...arr],
          subRange: [0, size - 1],
          swapping: [root, largest],
          sorted: [...sorted],
          comparisons, swaps,
          desc: "Sifted down: Swapped $A[" + root + "] = " + arr[largest] + "$ with $A[" + largest + "] = " + arr[root] + "$."
        });
        heapify(size, largest);
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);

    steps.push({
      lineHighlight: 2,
      array: [...arr],
      subRange: [0, n - 1],
      comparisons, swaps,
      desc: "<b>Max-Heap Constructed:</b> Root $A[0] = " + arr[0] + "$ is the maximum."
    });

    for (let i = n - 1; i > 0; i--) {
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      swaps++;
      sorted.push(i);

      steps.push({
        lineHighlight: 4,
        array: [...arr],
        subRange: [0, i - 1],
        swapping: [0, i],
        sorted: [...sorted],
        comparisons, swaps,
        desc: "Extracted root " + arr[i] + " to index " + i + "."
      });
      heapify(i, 0);
    }
    sorted.push(0);

    steps.push({
      lineHighlight: 1,
      array: [...arr],
      sorted: [...sorted],
      comparisons, swaps,
      desc: "<b>Heap Sort Complete:</b> Array sorted in ascending order."
    });
    return steps;
  },
  renderCanvas: SortingRenderer.renderCanvas,
  renderTable: SortingRenderer.renderTable,
  legend: [
    { color: 'var(--amber)', label: 'Heapify Comparison' },
    { color: 'var(--rose)', label: 'Heap Extract' },
    { color: 'var(--emerald)', label: 'Sorted Suffix' }
  ]
};

/* 7. BREADTH-FIRST SEARCH (BFS) MODULE */
const BfsModule = {
  startNode: 's',
  nodes: {
    s: { x: 120, y: 180 }, w: { x: 260, y: 100 }, r: { x: 260, y: 260 },
    t: { x: 420, y: 100 }, x: { x: 420, y: 180 }, v: { x: 420, y: 260 },
    u: { x: 580, y: 100 }, y: { x: 580, y: 220 }
  },
  edges: [
    { u: 's', v: 'w' }, { u: 's', v: 'r' }, { u: 'w', v: 't' }, { u: 'w', v: 'x' },
    { u: 'r', v: 'v' }, { u: 't', v: 'u' }, { u: 't', v: 'x' }, { u: 'x', v: 'u' },
    { u: 'x', v: 'y' }, { u: 'v', v: 'y' }, { u: 'u', v: 'y' }
  ],
  presets: [
    {
      name: "CLRS Textbook 8-Vertex Graph",
      startNode: 's',
      nodes: {
        s: { x: 120, y: 180 }, w: { x: 260, y: 100 }, r: { x: 260, y: 260 },
        t: { x: 420, y: 100 }, x: { x: 420, y: 180 }, v: { x: 420, y: 260 },
        u: { x: 580, y: 100 }, y: { x: 580, y: 220 }
      },
      edges: [
        { u: 's', v: 'w' }, { u: 's', v: 'r' }, { u: 'w', v: 't' }, { u: 'w', v: 'x' },
        { u: 'r', v: 'v' }, { u: 't', v: 'u' }, { u: 't', v: 'x' }, { u: 'x', v: 'u' },
        { u: 'x', v: 'y' }, { u: 'v', v: 'y' }, { u: 'u', v: 'y' }
      ]
    },
    {
      name: "Binary Tree Graph",
      startNode: 'A',
      nodes: {
        A: { x: 400, y: 60 }, B: { x: 250, y: 140 }, C: { x: 550, y: 140 },
        D: { x: 180, y: 220 }, E: { x: 320, y: 220 }, F: { x: 480, y: 220 }, G: { x: 620, y: 220 }
      },
      edges: [
        { u: 'A', v: 'B' }, { u: 'A', v: 'C' }, { u: 'B', v: 'D' }, { u: 'B', v: 'E' },
        { u: 'C', v: 'F' }, { u: 'C', v: 'G' }
      ]
    }
  ],
  pseudocode: [
    { line: 1, code: "BFS(G, s):", func: true },
    { line: 2, code: "  for each u in G.V - {s}: color[u] = WHITE; d[u] = inf; pi[u] = NIL" },
    { line: 3, code: "  color[s] = GRAY; d[s] = 0; Q = [s]" },
    { line: 4, code: "  while Q is not empty:" },
    { line: 5, code: "    u = DEQUEUE(Q)" },
    { line: 6, code: "    for each v in G.Adj[u]:" },
    { line: 7, code: "      if color[v] == WHITE: color[v] = GRAY; d[v] = d[u] + 1; pi[v] = u; ENQUEUE(Q, v)" },
    { line: 8, code: "    color[u] = BLACK" }
  ],
  theory: {
    time: "O(V + E)",
    space: "O(V) queue & colors",
    strategy: "FIFO Level-by-Level Exploration",
    desc: "Explores the graph in uniform distance waves outward from source s, determining the shortest hop count to every reachable node."
  },
  generateRandom() {
    const nodeNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nodes = {};
    const R = 140, cx = 400, cy = 180;
    nodeNames.forEach((name, i) => {
      const angle = (2 * Math.PI * i) / nodeNames.length - Math.PI / 2;
      nodes[name] = { x: Math.round(cx + R * Math.cos(angle)), y: Math.round(cy + R * Math.sin(angle)) };
    });
    const edges = [];
    for (let i = 0; i < nodeNames.length; i++) {
      edges.push({ u: nodeNames[i], v: nodeNames[(i + 1) % nodeNames.length] });
      if (Math.random() > 0.4) edges.push({ u: nodeNames[i], v: nodeNames[(i + 2) % nodeNames.length] });
    }
    return { startNode: 'A', nodes, edges };
  },
  buildSteps(nodes, edges, startNode) {
    const s = startNode && nodes[startNode] ? startNode : Object.keys(nodes)[0];
    const steps = [];
    const color = {}, dist = {}, parent = {};
    const treeEdges = [];
    const nodeKeys = Object.keys(nodes);

    nodeKeys.forEach(u => { color[u] = 'WHITE'; dist[u] = Infinity; parent[u] = null; });
    color[s] = 'GRAY'; dist[s] = 0;
    const queue = [s];

    const adj = {};
    nodeKeys.forEach(u => adj[u] = []);
    edges.forEach(e => {
      if (adj[e.u] && adj[e.v]) {
        adj[e.u].push(e.v);
        adj[e.v].push(e.u);
      }
    });

    steps.push({
      lineHighlight: 3,
      nodes, edges,
      color: { ...color }, dist: { ...dist }, parent: { ...parent },
      queue: [...queue], treeEdges: [...treeEdges], activeNode: s,
      desc: "<b>BFS Initialized:</b> Source " + s + " enqueued with $d = 0$."
    });

    while (queue.length > 0) {
      const u = queue.shift();
      steps.push({
        lineHighlight: 5,
        nodes, edges,
        color: { ...color }, dist: { ...dist }, parent: { ...parent },
        queue: [...queue], treeEdges: [...treeEdges], activeNode: u,
        desc: "<b>Dequeued " + u + ":</b> Inspecting neighbors at distance " + dist[u] + "."
      });

      const neighbors = adj[u] || [];
      for (let i = 0; i < neighbors.length; i++) {
        const v = neighbors[i];
        if (color[v] === 'WHITE') {
          color[v] = 'GRAY';
          dist[v] = dist[u] + 1;
          parent[v] = u;
          queue.push(v);
          treeEdges.push({ u, v });

          steps.push({
            lineHighlight: 7,
            nodes, edges,
            color: { ...color }, dist: { ...dist }, parent: { ...parent },
            queue: [...queue], treeEdges: [...treeEdges], activeNode: u, neighborNode: v,
            desc: "Discovered vertex " + v + ": $d[" + v + "] = " + dist[v] + "$. Enqueued " + v + "."
          });
        }
      }

      color[u] = 'BLACK';
      steps.push({
        lineHighlight: 8,
        nodes, edges,
        color: { ...color }, dist: { ...dist }, parent: { ...parent },
        queue: [...queue], treeEdges: [...treeEdges], activeNode: u,
        desc: "Finished vertex " + u + " (BLACK)."
      });
    }

    steps.push({
      lineHighlight: 1,
      nodes, edges,
      color: { ...color }, dist: { ...dist }, parent: { ...parent },
      queue: [], treeEdges: [...treeEdges],
      desc: "<b>BFS Complete:</b> All reachable nodes discovered."
    });
    return steps;
  },
  renderCanvas(svg, step, nodes, edges) {
    const ns = nodes || step.nodes || {};
    const es = edges || step.edges || [];
    let html = '';

    html += '<rect x="40" y="16" width="720" height="34" rx="6" fill="#141d2c" stroke="#223249"/>';
    html += '<text x="54" y="38" fill="#94a3b8" font-size="11" font-family="JetBrains Mono" font-weight="700">FIFO QUEUE:</text>';
    if (step.queue && step.queue.length > 0) {
      step.queue.forEach((item, qIdx) => {
        const qx = 180 + qIdx * 45;
        html += '<rect x="' + qx + '" y="22" width="36" height="22" rx="4" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b"/>';
        html += '<text x="' + (qx + 18) + '" y="37" text-anchor="middle" fill="#fbbf24" font-size="11" font-family="JetBrains Mono" font-weight="700">' + item + '</text>';
      });
    } else {
      html += '<text x="180" y="38" fill="#64748b" font-size="11" font-family="JetBrains Mono">&empty; (Empty Queue)</text>';
    }

    es.forEach(e => {
      const uNode = ns[e.u], vNode = ns[e.v];
      if (!uNode || !vNode) return;
      const isTree = step.treeEdges && step.treeEdges.some(te => (te.u === e.u && te.v === e.v) || (te.u === e.v && te.v === e.u));
      html += '<line x1="' + uNode.x + '" y1="' + uNode.y + '" x2="' + vNode.x + '" y2="' + vNode.y + '" stroke="' + (isTree ? '#10b981' : '#334155') + '" stroke-width="' + (isTree ? 3 : 1.5) + '"/>';
    });

    Object.keys(ns).forEach(name => {
      const node = ns[name];
      const c = (step.color && step.color[name]) || 'WHITE';
      const d = step.dist && step.dist[name] !== undefined ? (step.dist[name] === Infinity ? '&infin;' : step.dist[name]) : '&infin;';
      const isAct = step.activeNode === name;

      let fill = '#1e293b', stroke = '#475569', textColor = '#94a3b8';
      if (c === 'GRAY') { fill = 'rgba(245, 158, 11, 0.25)'; stroke = '#f59e0b'; textColor = '#fbbf24'; }
      if (c === 'BLACK') { fill = 'rgba(16, 185, 129, 0.25)'; stroke = '#10b981'; textColor = '#34d399'; }
      if (isAct) stroke = '#38bdf8';

      html += '<circle cx="' + node.x + '" cy="' + node.y + '" r="22" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (isAct ? 3.5 : 2) + '"/>';
      html += '<text x="' + node.x + '" y="' + (node.y + 5) + '" text-anchor="middle" fill="' + textColor + '" font-size="14" font-family="JetBrains Mono" font-weight="700">' + name + '</text>';
      html += '<rect x="' + (node.x + 12) + '" y="' + (node.y - 24) + '" width="26" height="15" rx="3" fill="#090d14" stroke="' + stroke + '"/>';
      html += '<text x="' + (node.x + 25) + '" y="' + (node.y - 13) + '" text-anchor="middle" fill="' + textColor + '" font-size="9" font-family="JetBrains Mono" font-weight="700">' + d + '</text>';
    });

    svg.setAttribute('viewBox', '0 0 800 360');
    svg.innerHTML = html;
  },
  renderTable(thead, tbody, step, nodes) {
    thead.innerHTML = '<tr><th>Vertex</th><th>Color State</th><th>Distance d[v]</th><th>Predecessor &pi;[v]</th></tr>';
    const ns = nodes || step.nodes || {};
    let rows = '';
    Object.keys(ns).forEach(name => {
      const c = (step.color && step.color[name]) || 'WHITE';
      const d = step.dist && step.dist[name] !== undefined ? (step.dist[name] === Infinity ? '&infin;' : step.dist[name]) : '&infin;';
      const p = (step.parent && step.parent[name]) || 'NIL';
      const isAct = step.activeNode === name;

      let pill = '<span style="color:var(--text-dim)">WHITE</span>';
      if (c === 'GRAY') pill = '<span style="color:var(--amber); font-weight:700;">GRAY (In Queue)</span>';
      if (c === 'BLACK') pill = '<span style="color:var(--emerald); font-weight:700;">BLACK (Visited)</span>';

      rows += '<tr class="' + (isAct ? 'active-row' : '') + '">' +
        '<td><b>Vertex ' + name + '</b></td>' +
        '<td>' + pill + '</td>' +
        '<td><b style="color:var(--teal)">' + d + '</b></td>' +
        '<td><code>' + p + '</code></td>' +
      '</tr>';
    });
    tbody.innerHTML = rows;
  },
  legend: [
    { color: 'var(--amber)', label: 'In Queue (GRAY)' },
    { color: 'var(--emerald)', label: 'Visited (BLACK / Tree Edge)' },
    { color: 'var(--gray)', label: 'Unvisited (WHITE)' }
  ]
};

/* 8. DEPTH-FIRST SEARCH (DFS) MODULE */
const DfsModule = {
  startNode: 'u',
  nodes: {
    u: { x: 160, y: 100 }, v: { x: 340, y: 100 }, w: { x: 340, y: 240 },
    x: { x: 160, y: 240 }, y: { x: 520, y: 100 }, z: { x: 520, y: 240 }
  },
  edges: [
    { u: 'u', v: 'v' }, { u: 'u', v: 'x' }, { u: 'v', v: 'y' },
    { u: 'w', v: 'y' }, { u: 'w', v: 'z' }, { u: 'x', v: 'v' },
    { u: 'y', v: 'x' }, { u: 'z', v: 'z' }
  ],
  presets: [
    {
      name: "CLRS 6-Vertex Directed Graph",
      startNode: 'u',
      nodes: {
        u: { x: 160, y: 100 }, v: { x: 340, y: 100 }, w: { x: 340, y: 240 },
        x: { x: 160, y: 240 }, y: { x: 520, y: 100 }, z: { x: 520, y: 240 }
      },
      edges: [
        { u: 'u', v: 'v' }, { u: 'u', v: 'x' }, { u: 'v', v: 'y' },
        { u: 'w', v: 'y' }, { u: 'w', v: 'z' }, { u: 'x', v: 'v' },
        { u: 'y', v: 'x' }, { u: 'z', v: 'z' }
      ]
    }
  ],
  pseudocode: [
    { line: 1, code: "DFS(G):", func: true },
    { line: 2, code: "  for each u in G.V: color[u] = WHITE; pi[u] = NIL; time = 0" },
    { line: 3, code: "  for each u in G.V: if color[u] == WHITE: DFS-VISIT(G, u)" },
    { line: 4, code: "DFS-VISIT(G, u):", func: true },
    { line: 5, code: "  time++; d[u] = time; color[u] = GRAY" },
    { line: 6, code: "  for each v in G.Adj[u]:" },
    { line: 7, code: "    if color[v] == WHITE: pi[v] = u; DFS-VISIT(G, v)" },
    { line: 8, code: "    else if color[v] == GRAY: // Back edge" },
    { line: 9, code: "  color[u] = BLACK; time++; f[u] = time" }
  ],
  theory: {
    time: "O(V + E)",
    space: "O(V) call stack",
    strategy: "Recursive Backtracking with Timestamps",
    desc: "Visits nodes as deeply as possible, assigning discovery timestamps d[u] and finish timestamps f[u] to classify tree, back, forward, and cross edges."
  },
  generateRandom() {
    const nodeNames = ['A', 'B', 'C', 'D', 'E'];
    const nodes = {};
    const R = 130, cx = 380, cy = 180;
    nodeNames.forEach((name, i) => {
      const angle = (2 * Math.PI * i) / nodeNames.length - Math.PI / 2;
      nodes[name] = { x: Math.round(cx + R * Math.cos(angle)), y: Math.round(cy + R * Math.sin(angle)) };
    });
    const edges = [];
    for (let i = 0; i < nodeNames.length; i++) {
      edges.push({ u: nodeNames[i], v: nodeNames[(i + 1) % nodeNames.length] });
    }
    return { startNode: 'A', nodes, edges };
  },
  buildSteps(nodes, edges) {
    const steps = [];
    const color = {}, d = {}, f = {}, parent = {};
    const stack = [], edgeTypes = {};
    const nodeKeys = Object.keys(nodes);

    nodeKeys.forEach(u => { color[u] = 'WHITE'; d[u] = 0; f[u] = 0; parent[u] = null; });

    const adj = {};
    nodeKeys.forEach(u => adj[u] = []);
    edges.forEach(e => { if (adj[e.u]) adj[e.u].push(e.v); });

    let time = 0;

    steps.push({
      lineHighlight: 2,
      nodes, edges,
      color: { ...color }, d: { ...d }, f: { ...f }, stack: [...stack], edgeTypes: { ...edgeTypes },
      desc: "<b>DFS Initialized:</b> Timestamp counter $time = 0$."
    });

    function dfsVisit(u) {
      time++;
      d[u] = time;
      color[u] = 'GRAY';
      stack.push(u);

      steps.push({
        lineHighlight: 5,
        nodes, edges,
        color: { ...color }, d: { ...d }, f: { ...f }, stack: [...stack], edgeTypes: { ...edgeTypes },
        activeNode: u,
        desc: "Discovered vertex " + u + ": $d[" + u + "] = " + d[u] + "$ (GRAY)."
      });

      const neighbors = adj[u] || [];
      for (let i = 0; i < neighbors.length; i++) {
        const v = neighbors[i];
        const edgeKey = u + '->' + v;
        if (color[v] === 'WHITE') {
          edgeTypes[edgeKey] = 'tree';
          parent[v] = u;
          steps.push({
            lineHighlight: 7,
            nodes, edges,
            color: { ...color }, d: { ...d }, f: { ...f }, stack: [...stack], edgeTypes: { ...edgeTypes },
            activeNode: u,
            desc: "Tree Edge (" + u + " &rarr; " + v + "). Recursing to " + v + "."
          });
          dfsVisit(v);
        } else if (color[v] === 'GRAY') {
          edgeTypes[edgeKey] = 'back';
          steps.push({
            lineHighlight: 8,
            nodes, edges,
            color: { ...color }, d: { ...d }, f: { ...f }, stack: [...stack], edgeTypes: { ...edgeTypes },
            activeNode: u,
            desc: "Back Edge (" + u + " &rarr; " + v + "): Ancestor cycle detected!"
          });
        }
      }

      color[u] = 'BLACK';
      time++;
      f[u] = time;
      stack.pop();

      steps.push({
        lineHighlight: 9,
        nodes, edges,
        color: { ...color }, d: { ...d }, f: { ...f }, stack: [...stack], edgeTypes: { ...edgeTypes },
        activeNode: u,
        desc: "Finished vertex " + u + ": $f[" + u + "] = " + f[u] + "$ (BLACK)."
      });
    }

    nodeKeys.forEach(u => { if (color[u] === 'WHITE') dfsVisit(u); });

    steps.push({
      lineHighlight: 1,
      nodes, edges,
      color: { ...color }, d: { ...d }, f: { ...f }, stack: [], edgeTypes: { ...edgeTypes },
      desc: "<b>DFS Complete:</b> All vertices finished."
    });
    return steps;
  },
  renderCanvas(svg, step, nodes, edges) {
    const ns = nodes || step.nodes || {};
    const es = edges || step.edges || [];
    let html = '<defs>' +
      '<marker id="dfs-arrow" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b"/></marker>' +
      '<marker id="dfs-arrow-tree" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981"/></marker>' +
      '<marker id="dfs-arrow-back" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e"/></marker>' +
    '</defs>';

    html += '<rect x="40" y="16" width="720" height="34" rx="6" fill="#141d2c" stroke="#223249"/>';
    html += '<text x="54" y="38" fill="#94a3b8" font-size="11" font-family="JetBrains Mono" font-weight="700">CALL STACK:</text>';
    if (step.stack && step.stack.length > 0) {
      step.stack.forEach((item, sIdx) => {
        const sx = 180 + sIdx * 50;
        html += '<rect x="' + sx + '" y="22" width="40" height="22" rx="4" fill="#8b5cf6" fill-opacity="0.2" stroke="#8b5cf6"/>';
        html += '<text x="' + (sx + 20) + '" y="37" text-anchor="middle" fill="#c4b5fd" font-size="11" font-family="JetBrains Mono" font-weight="700">' + item + '</text>';
      });
    } else {
      html += '<text x="180" y="38" fill="#64748b" font-size="11" font-family="JetBrains Mono">&empty; (Empty Stack)</text>';
    }

    es.forEach(e => {
      const uNode = ns[e.u], vNode = ns[e.v];
      if (!uNode || !vNode) return;
      const type = step.edgeTypes && step.edgeTypes[e.u + '->' + e.v];
      let stroke = '#334155', marker = 'url(#dfs-arrow)', dash = 'none', strokeW = 1.5;
      if (type === 'tree') { stroke = '#10b981'; marker = 'url(#dfs-arrow-tree)'; strokeW = 2.5; }
      else if (type === 'back') { stroke = '#f43f5e'; marker = 'url(#dfs-arrow-back)'; dash = '4,4'; strokeW = 2.5; }

      if (e.u === e.v) {
        html += '<path d="M ' + uNode.x + ' ' + (uNode.y - 20) + ' C ' + (uNode.x - 30) + ' ' + (uNode.y - 50) + ', ' + (uNode.x + 30) + ' ' + (uNode.y - 50) + ', ' + (uNode.x + 15) + ' ' + (uNode.y - 15) + '" fill="none" stroke="' + stroke + '" stroke-width="' + strokeW + '" marker-end="' + marker + '"/>';
      } else {
        html += '<line x1="' + uNode.x + '" y1="' + uNode.y + '" x2="' + vNode.x + '" y2="' + vNode.y + '" stroke="' + stroke + '" stroke-width="' + strokeW + '" stroke-dasharray="' + dash + '" marker-end="' + marker + '"/>';
      }
    });

    Object.keys(ns).forEach(name => {
      const node = ns[name];
      const c = (step.color && step.color[name]) || 'WHITE';
      const dVal = (step.d && step.d[name]) || 0;
      const fVal = (step.f && step.f[name]) || 0;
      const badge = dVal > 0 ? (dVal + '/' + (fVal > 0 ? fVal : '?')) : '—';
      const isAct = step.activeNode === name;

      let fill = '#1e293b', stroke = '#475569', textColor = '#94a3b8';
      if (c === 'GRAY') { fill = 'rgba(245, 158, 11, 0.25)'; stroke = '#f59e0b'; textColor = '#fbbf24'; }
      if (c === 'BLACK') { fill = 'rgba(16, 185, 129, 0.25)'; stroke = '#10b981'; textColor = '#34d399'; }
      if (isAct) stroke = '#38bdf8';

      html += '<circle cx="' + node.x + '" cy="' + node.y + '" r="22" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (isAct ? 3.5 : 2) + '"/>';
      html += '<text x="' + node.x + '" y="' + (node.y + 5) + '" text-anchor="middle" fill="' + textColor + '" font-size="14" font-family="JetBrains Mono" font-weight="700">' + name + '</text>';
      html += '<rect x="' + (node.x + 12) + '" y="' + (node.y - 24) + '" width="34" height="15" rx="3" fill="#090d14" stroke="' + stroke + '"/>';
      html += '<text x="' + (node.x + 29) + '" y="' + (node.y - 13) + '" text-anchor="middle" fill="' + textColor + '" font-size="9" font-family="JetBrains Mono" font-weight="700">' + badge + '</text>';
    });

    svg.setAttribute('viewBox', '0 0 800 360');
    svg.innerHTML = html;
  },
  renderTable(thead, tbody, step, nodes) {
    thead.innerHTML = '<tr><th>Vertex</th><th>State</th><th>Discovery d[v]</th><th>Finish f[v]</th><th>Interval</th></tr>';
    const ns = nodes || step.nodes || {};
    let rows = '';
    Object.keys(ns).forEach(name => {
      const c = (step.color && step.color[name]) || 'WHITE';
      const dVal = (step.d && step.d[name]) || '—';
      const fVal = (step.f && step.f[name]) || '—';
      const isAct = step.activeNode === name;

      let pill = '<span style="color:var(--text-dim)">WHITE</span>';
      if (c === 'GRAY') pill = '<span style="color:var(--amber); font-weight:700;">GRAY (Stack)</span>';
      if (c === 'BLACK') pill = '<span style="color:var(--emerald); font-weight:700;">BLACK (Done)</span>';

      rows += '<tr class="' + (isAct ? 'active-row' : '') + '">' +
        '<td><b>Vertex ' + name + '</b></td>' +
        '<td>' + pill + '</td>' +
        '<td><b style="color:var(--amber)">' + dVal + '</b></td>' +
        '<td><b style="color:var(--teal)">' + fVal + '</b></td>' +
        '<td><code>[' + dVal + ', ' + fVal + ']</code></td>' +
      '</tr>';
    });
    tbody.innerHTML = rows;
  },
  legend: [
    { color: 'var(--amber)', label: 'On Stack (GRAY)' },
    { color: 'var(--emerald)', label: 'Finished (BLACK / Tree Edge)' },
    { color: 'var(--rose)', label: 'Back Edge (Cycle)' }
  ]
};

/* 9. LINKED LIST MODULE */
const LinkedListModule = {
  operations: [
    { op: 'insert_tail', val: 10 },
    { op: 'insert_tail', val: 20 },
    { op: 'insert_tail', val: 30 },
    { op: 'insert_head', val: 5 },
    { op: 'search', val: 20 },
    { op: 'delete', val: 20 },
    { op: 'reverse' }
  ],
  presets: [
    {
      name: "Standard Lifecycle & Reverse",
      operations: [
        { op: 'insert_tail', val: 10 }, { op: 'insert_tail', val: 20 },
        { op: 'insert_tail', val: 30 }, { op: 'insert_head', val: 5 },
        { op: 'search', val: 20 }, { op: 'delete', val: 20 }, { op: 'reverse' }
      ]
    },
    {
      name: "List Reversal Cascade",
      operations: [
        { op: 'insert_tail', val: 1 }, { op: 'insert_tail', val: 2 },
        { op: 'insert_tail', val: 3 }, { op: 'insert_tail', val: 4 },
        { op: 'insert_tail', val: 5 }, { op: 'reverse' }
      ]
    }
  ],
  pseudocode: [
    { line: 1, code: "LINKED-LIST-OPS(L):", func: true },
    { line: 2, code: "  INSERT-HEAD(L, x): x.next = L.head; L.head = x" },
    { line: 3, code: "  INSERT-TAIL(L, x): tail.next = x; L.tail = x" },
    { line: 4, code: "  SEARCH(L, k): x = L.head; while x != NIL and x.key != k: x = x.next; return x" },
    { line: 5, code: "  DELETE(L, x): prev.next = x.next; free(x)" },
    { line: 6, code: "  REVERSE(L): prev = NIL; curr = L.head; while curr: next = curr.next; curr.next = prev; prev = curr; curr = next; L.head = prev" }
  ],
  theory: {
    time: "Insert Head O(1), Search O(n), Delete O(n), Reverse O(n)",
    space: "O(n) dynamic nodes",
    strategy: "Sequential Pointer Chaining",
    desc: "Stores values in separate node structures linked by pointers. Enables O(1) head insertions without contiguous array reallocation."
  },
  generateRandom() {
    const vals = [12, 45, 78, 23, 56];
    const ops = vals.map(v => ({ op: 'insert_tail', val: v }));
    ops.push({ op: 'search', val: vals[2] });
    ops.push({ op: 'delete', val: vals[1] });
    ops.push({ op: 'reverse' });
    return { operations: ops };
  },
  buildSteps(operations) {
    const steps = [];
    const list = [];

    steps.push({
      lineHighlight: 1,
      list: [...list],
      desc: "<b>Linked List Initialized:</b> Empty list. $HEAD = NIL$."
    });

    operations.forEach(cmd => {
      if (cmd.op === 'insert_head') {
        list.unshift(cmd.val);
        steps.push({
          lineHighlight: 2,
          list: [...list],
          activeIdx: 0,
          desc: "<b>Insert Head:</b> Added node " + cmd.val + " as new head."
        });
      } else if (cmd.op === 'insert_tail') {
        list.push(cmd.val);
        steps.push({
          lineHighlight: 3,
          list: [...list],
          activeIdx: list.length - 1,
          desc: "<b>Insert Tail:</b> Appended node " + cmd.val + " to tail."
        });
      } else if (cmd.op === 'search') {
        for (let i = 0; i < list.length; i++) {
          const match = list[i] === cmd.val;
          steps.push({
            lineHighlight: 4,
            list: [...list],
            activeIdx: i,
            desc: "<b>Searching (" + cmd.val + "):</b> Inspecting node " + i + " (val: " + list[i] + ")." +
                  (match ? " <span class='tag-match'>FOUND MATCH!</span>" : "")
          });
          if (match) break;
        }
      } else if (cmd.op === 'delete') {
        const idx = list.indexOf(cmd.val);
        if (idx !== -1) {
          list.splice(idx, 1);
          steps.push({
            lineHighlight: 5,
            list: [...list],
            activeIdx: null,
            desc: "<b>Deleted Node:</b> Removed node with key " + cmd.val + "."
          });
        }
      } else if (cmd.op === 'reverse') {
        list.reverse();
        steps.push({
          lineHighlight: 6,
          list: [...list],
          activeIdx: null,
          desc: "<b>Reversed List:</b> Pointers redirected. New head is " + list[0] + "."
        });
      }
    });

    steps.push({
      lineHighlight: 1,
      list: [...list],
      activeIdx: null,
      desc: "<b>Operations Complete:</b> Final linked list has " + list.length + " node(s)."
    });
    return steps;
  },
  renderCanvas(svg, step) {
    const list = step.list || [];
    const n = list.length;
    let html = '<defs>' +
      '<marker id="list-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6"/></marker>' +
    '</defs>';

    html += '<text x="40" y="32" fill="#94a3b8" font-size="12" font-family="JetBrains Mono" font-weight="600">Singly Linked List &bull; Length: <tspan fill="#14b8a6">' + n + '</tspan></text>';

    if (n === 0) {
      html += '<text x="400" y="160" text-anchor="middle" fill="#64748b" font-size="14" font-family="JetBrains Mono">HEAD &rarr; NIL (Empty List)</text>';
      svg.setAttribute('viewBox', '0 0 800 300');
      svg.innerHTML = html;
      return;
    }

    const nodeW = 85, nodeH = 48, gap = 45;
    const startX = Math.max(50, (800 - (n * nodeW + (n - 1) * gap)) / 2);
    const nodeY = 140;

    html += '<text x="' + (startX - 20) + '" y="' + (nodeY + 28) + '" text-anchor="end" fill="#f59e0b" font-size="12" font-family="JetBrains Mono" font-weight="700">HEAD &rarr;</text>';

    for (let i = 0; i < n; i++) {
      const x = startX + i * (nodeW + gap);
      const isAct = step.activeIdx === i;
      const fill = isAct ? 'rgba(245, 158, 11, 0.2)' : '#141d2c';
      const stroke = isAct ? '#f59e0b' : '#334155';

      html += '<rect x="' + x + '" y="' + nodeY + '" width="' + nodeW + '" height="' + nodeH + '" rx="6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (isAct ? 2.5 : 1.5) + '"/>';
      html += '<line x1="' + (x + 55) + '" y1="' + nodeY + '" x2="' + (x + 55) + '" y2="' + (nodeY + nodeH) + '" stroke="' + stroke + '" stroke-width="1.5"/>';
      html += '<text x="' + (x + 27) + '" y="' + (nodeY + 30) + '" text-anchor="middle" fill="' + (isAct ? '#fbbf24' : '#fff') + '" font-size="14" font-family="JetBrains Mono" font-weight="700">' + list[i] + '</text>';
      html += '<text x="' + (x + 27) + '" y="' + (nodeY - 8) + '" text-anchor="middle" fill="#64748b" font-size="10" font-family="JetBrains Mono">[' + i + ']</text>';
      html += '<circle cx="' + (x + 70) + '" cy="' + (nodeY + nodeH / 2) + '" r="4" fill="#14b8a6"/>';

      if (i < n - 1) {
        html += '<line x1="' + (x + 70) + '" y1="' + (nodeY + nodeH / 2) + '" x2="' + (x + nodeW + gap) + '" y2="' + (nodeY + nodeH / 2) + '" stroke="#14b8a6" stroke-width="2" marker-end="url(#list-arrow)"/>';
      } else {
        html += '<line x1="' + (x + 70) + '" y1="' + (nodeY + nodeH / 2) + '" x2="' + (x + nodeW + 30) + '" y2="' + (nodeY + nodeH / 2) + '" stroke="#64748b" stroke-width="1.5" marker-end="url(#list-arrow)"/>';
        html += '<text x="' + (x + nodeW + 42) + '" y="' + (nodeY + nodeH / 2 + 4) + '" fill="#64748b" font-size="11" font-family="JetBrains Mono">NIL</text>';
      }
    }

    svg.setAttribute('viewBox', '0 0 800 300');
    svg.innerHTML = html;
  },
  renderTable(thead, tbody, step) {
    thead.innerHTML = '<tr><th>Index</th><th>Value</th><th>Next Pointer</th><th>State</th></tr>';
    const list = step.list || [];
    let rows = '';
    for (let i = 0; i < list.length; i++) {
      const isAct = step.activeIdx === i;
      rows += '<tr class="' + (isAct ? 'active-row' : '') + '">' +
        '<td><b>Node [' + i + ']</b></td>' +
        '<td><b style="color:var(--amber)">' + list[i] + '</b></td>' +
        '<td><code>&rarr; ' + (i === list.length - 1 ? 'NIL' : 'Node [' + (i + 1) + ']') + '</code></td>' +
        '<td>' + (isAct ? '<span style="color:var(--teal); font-weight:700;">Active Focus</span>' : 'Linked') + '</td>' +
      '</tr>';
    }
    tbody.innerHTML = rows;
  },
  legend: [
    { color: 'var(--teal)', label: 'Node Pointer Arrow' },
    { color: 'var(--amber)', label: 'Active Pointer / Focus' },
    { color: 'var(--gray)', label: 'NIL Pointer' }
  ]
};

/* 10. BINARY HEAP MODULE */
const BinaryHeapModule = {
  operations: [
    { op: 'insert', val: 35 },
    { op: 'insert', val: 12 },
    { op: 'insert', val: 88 },
    { op: 'insert', val: 5 },
    { op: 'insert', val: 24 },
    { op: 'extract_min' },
    { op: 'insert', val: 9 }
  ],
  presets: [
    {
      name: "Min-Heap Insert & Extract Cascade",
      operations: [
        { op: 'insert', val: 35 }, { op: 'insert', val: 12 },
        { op: 'insert', val: 88 }, { op: 'insert', val: 5 },
        { op: 'insert', val: 24 }, { op: 'extract_min' }, { op: 'insert', val: 9 }
      ]
    }
  ],
  pseudocode: [
    { line: 1, code: "MIN-HEAP-OPS(H):", func: true },
    { line: 2, code: "  INSERT(H, key): H.append(key); SIFT-UP(H.size - 1)" },
    { line: 3, code: "  SIFT-UP(i): while i > 0 and H[p(i)] > H[i]: swap(p(i), i); i = p(i)" },
    { line: 4, code: "  EXTRACT-MIN(H): min = H[0]; H[0] = H.pop(); SIFT-DOWN(0); return min" },
    { line: 5, code: "  SIFT-DOWN(i): find smallest in {i, left(i), right(i)}; swap & recurse" }
  ],
  theory: {
    time: "Insert O(log n), Extract-Min O(log n), Peek O(1)",
    space: "O(n) contiguous array",
    strategy: "Complete Binary Tree in 1D Array",
    desc: "A complete binary tree where parent H[p] <= child H[i]. Stored in array with parent = floor((i-1)/2), left = 2i+1, right = 2i+2."
  },
  generateRandom() {
    const ops = [
      { op: 'insert', val: 25 }, { op: 'insert', val: 14 },
      { op: 'insert', val: 68 }, { op: 'insert', val: 8 },
      { op: 'extract_min' }
    ];
    return { operations: ops };
  },
  buildSteps(operations) {
    const steps = [];
    const heap = [];

    steps.push({
      lineHighlight: 1,
      heap: [...heap],
      desc: "<b>Min-Heap Initialized:</b> Empty binary heap."
    });

    operations.forEach(cmd => {
      if (cmd.op === 'insert') {
        heap.push(cmd.val);
        let i = heap.length - 1;
        steps.push({
          lineHighlight: 2,
          heap: [...heap],
          activeIdx: i,
          desc: "<b>Insert (" + cmd.val + "):</b> Appended at leaf index " + i + "."
        });

        while (i > 0) {
          const pIdx = Math.floor((i - 1) / 2);
          if (heap[pIdx] > heap[i]) {
            const temp = heap[pIdx];
            heap[pIdx] = heap[i];
            heap[i] = temp;
            i = pIdx;
            steps.push({
              lineHighlight: 3,
              heap: [...heap],
              activeIdx: i,
              desc: "Sift-Up: Swapped with parent into index " + i + "."
            });
          } else {
            break;
          }
        }
      } else if (cmd.op === 'extract_min' && heap.length > 0) {
        const minVal = heap[0];
        const lastVal = heap.pop();
        if (heap.length > 0) {
          heap[0] = lastVal;
          steps.push({
            lineHighlight: 4,
            heap: [...heap],
            activeIdx: 0,
            desc: "<b>Extract-Min:</b> Extracted " + minVal + ". Moved leaf " + lastVal + " to root."
          });

          let i = 0;
          while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
            if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

            if (smallest !== i) {
              const temp = heap[i];
              heap[i] = heap[smallest];
              heap[smallest] = temp;
              i = smallest;
              steps.push({
                lineHighlight: 5,
                heap: [...heap],
                activeIdx: i,
                desc: "Sift-Down: Swapped root with smaller child index " + i + "."
              });
            } else {
              break;
            }
          }
        } else {
          steps.push({ lineHighlight: 4, heap: [], desc: "Extracted last element. Heap empty." });
        }
      }
    });

    steps.push({ lineHighlight: 1, heap: [...heap], desc: "<b>Heap Operations Complete.</b>" });
    return steps;
  },
  renderCanvas(svg, step) {
    const heap = step.heap || [];
    const n = heap.length;
    let html = '<text x="40" y="32" fill="#94a3b8" font-size="12" font-family="JetBrains Mono" font-weight="600">Binary Min-Heap (Tree &amp; Array Dual-View) &bull; Count: <tspan fill="#14b8a6">' + n + '</tspan></text>';

    if (n === 0) {
      html += '<text x="400" y="160" text-anchor="middle" fill="#64748b" font-size="14" font-family="JetBrains Mono">Heap is Empty</text>';
      svg.setAttribute('viewBox', '0 0 800 340');
      svg.innerHTML = html;
      return;
    }

    const treeCoords = [
      { x: 400, y: 70 },
      { x: 230, y: 130 }, { x: 570, y: 130 },
      { x: 150, y: 190 }, { x: 310, y: 190 }, { x: 490, y: 190 }, { x: 650, y: 190 },
      { x: 110, y: 245 }, { x: 190, y: 245 }, { x: 270, y: 245 }, { x: 350, y: 245 },
      { x: 450, y: 245 }, { x: 530, y: 245 }, { x: 610, y: 245 }, { x: 690, y: 245 }
    ];

    for (let i = 0; i < n; i++) {
      const left = 2 * i + 1, right = 2 * i + 2;
      const pCoord = treeCoords[i] || { x: 400, y: 100 };
      if (left < n && treeCoords[left]) {
        html += '<line x1="' + pCoord.x + '" y1="' + pCoord.y + '" x2="' + treeCoords[left].x + '" y2="' + treeCoords[left].y + '" stroke="#334155" stroke-width="2"/>';
      }
      if (right < n && treeCoords[right]) {
        html += '<line x1="' + pCoord.x + '" y1="' + pCoord.y + '" x2="' + treeCoords[right].x + '" y2="' + treeCoords[right].y + '" stroke="#334155" stroke-width="2"/>';
      }
    }

    for (let i = 0; i < n; i++) {
      const coord = treeCoords[i] || { x: 400, y: 100 };
      const isAct = step.activeIdx === i;
      html += '<circle cx="' + coord.x + '" cy="' + coord.y + '" r="18" fill="' + (isAct ? 'rgba(20, 184, 166, 0.3)' : '#1e293b') + '" stroke="' + (isAct ? '#14b8a6' : '#334155') + '" stroke-width="' + (isAct ? 2.5 : 1.5) + '"/>';
      html += '<text x="' + coord.x + '" y="' + (coord.y + 5) + '" text-anchor="middle" fill="#fff" font-size="12" font-family="JetBrains Mono" font-weight="700">' + heap[i] + '</text>';
      html += '<text x="' + coord.x + '" y="' + (coord.y - 22) + '" text-anchor="middle" fill="#64748b" font-size="9" font-family="JetBrains Mono">[' + i + ']</text>';
    }

    const slotW = Math.min(50, Math.floor(660 / Math.max(n, 1)));
    const arrStartX = Math.round(40 + (720 - n * (slotW + 6)) / 2);
    const arrY = 295;

    for (let i = 0; i < n; i++) {
      const ax = arrStartX + i * (slotW + 6);
      const isAct = step.activeIdx === i;
      html += '<rect x="' + ax + '" y="' + arrY + '" width="' + slotW + '" height="30" rx="4" fill="' + (isAct ? '#142938' : '#141d2c') + '" stroke="' + (isAct ? '#14b8a6' : '#223249') + '"/>';
      html += '<text x="' + (ax + slotW / 2) + '" y="' + (arrY + 19) + '" text-anchor="middle" fill="' + (isAct ? '#2dd4bf' : '#fff') + '" font-size="12" font-family="JetBrains Mono" font-weight="700">' + heap[i] + '</text>';
      html += '<text x="' + (ax + slotW / 2) + '" y="' + (arrY + 42) + '" text-anchor="middle" fill="#64748b" font-size="9" font-family="JetBrains Mono">' + i + '</text>';
    }

    svg.setAttribute('viewBox', '0 0 800 350');
    svg.innerHTML = html;
  },
  renderTable(thead, tbody, step) {
    thead.innerHTML = '<tr><th>Index [i]</th><th>Value</th><th>Parent</th><th>Left Child</th><th>Right Child</th></tr>';
    const heap = step.heap || [];
    let rows = '';
    for (let i = 0; i < heap.length; i++) {
      const pIdx = i > 0 ? Math.floor((i - 1) / 2) : 'ROOT';
      const lIdx = 2 * i + 1 < heap.length ? heap[2 * i + 1] : 'NIL';
      const rIdx = 2 * i + 2 < heap.length ? heap[2 * i + 2] : 'NIL';
      const isAct = step.activeIdx === i;

      rows += '<tr class="' + (isAct ? 'active-row' : '') + '">' +
        '<td><b>[' + i + ']</b></td>' +
        '<td><b style="color:var(--teal)">' + heap[i] + '</b></td>' +
        '<td>' + pIdx + '</td>' +
        '<td><code>' + lIdx + '</code></td>' +
        '<td><code>' + rIdx + '</code></td>' +
      '</tr>';
    }
    tbody.innerHTML = rows;
  },
  legend: [
    { color: 'var(--teal)', label: 'Active Node / Bubble Sift' },
    { color: 'var(--gray)', label: 'Heap Structure' }
  ]
};

/* 11. BINARY SEARCH TREE (BST) MODULE */
const BstModule = {
  operations: [
    { op: 'insert', val: 50 },
    { op: 'insert', val: 30 },
    { op: 'insert', val: 70 },
    { op: 'insert', val: 20 },
    { op: 'insert', val: 40 },
    { op: 'insert', val: 60 },
    { op: 'insert', val: 80 },
    { op: 'search', val: 60 },
    { op: 'delete', val: 30 },
    { op: 'inorder' }
  ],
  presets: [
    {
      name: "Complete BST Lifecycle",
      operations: [
        { op: 'insert', val: 50 }, { op: 'insert', val: 30 }, { op: 'insert', val: 70 },
        { op: 'insert', val: 20 }, { op: 'insert', val: 40 }, { op: 'insert', val: 60 },
        { op: 'insert', val: 80 }, { op: 'search', val: 60 }, { op: 'delete', val: 30 },
        { op: 'inorder' }
      ]
    }
  ],
  pseudocode: [
    { line: 1, code: "BST-OPS(T):", func: true },
    { line: 2, code: "  TREE-SEARCH(x, k): if x == NIL or k == x.key: return x; recurse left or right" },
    { line: 3, code: "  TREE-INSERT(T, z): traverse from root using BST invariant and attach leaf" },
    { line: 4, code: "  TREE-DELETE(T, z): handle 0, 1, or 2 children (replace with inorder successor)" },
    { line: 5, code: "  INORDER-WALK(x): if x != NIL: WALK(x.left); visit x; WALK(x.right)" }
  ],
  theory: {
    time: "Average O(log n), Worst O(n)",
    space: "O(n) dynamic nodes",
    strategy: "Binary Search Invariant (Left < Key < Right)",
    desc: "Binary tree where left subtree contains strictly smaller keys and right subtree contains strictly larger keys. Inorder walk prints keys in sorted order."
  },
  generateRandom() {
    const ops = [
      { op: 'insert', val: 45 }, { op: 'insert', val: 25 },
      { op: 'insert', val: 75 }, { op: 'insert', val: 15 },
      { op: 'inorder' }
    ];
    return { operations: ops };
  },
  buildSteps(operations) {
    const steps = [];
    let root = null;

    function clone(node) {
      if (!node) return null;
      return { key: node.key, left: clone(node.left), right: clone(node.right) };
    }

    steps.push({ lineHighlight: 1, tree: null, desc: "<b>BST Initialized:</b> Empty tree." });

    operations.forEach(cmd => {
      if (cmd.op === 'insert') {
        const newNode = { key: cmd.val, left: null, right: null };
        if (!root) {
          root = newNode;
          steps.push({ lineHighlight: 3, tree: clone(root), activeKey: cmd.val, desc: "Inserted root " + cmd.val + "." });
        } else {
          let curr = root;
          while (true) {
            if (cmd.val < curr.key) {
              if (!curr.left) { curr.left = newNode; break; }
              curr = curr.left;
            } else {
              if (!curr.right) { curr.right = newNode; break; }
              curr = curr.right;
            }
          }
          steps.push({ lineHighlight: 3, tree: clone(root), activeKey: cmd.val, desc: "Inserted node " + cmd.val + "." });
        }
      } else if (cmd.op === 'search') {
        let curr = root, found = false;
        while (curr) {
          if (curr.key === cmd.val) { found = true; break; }
          curr = cmd.val < curr.key ? curr.left : curr.right;
        }
        steps.push({
          lineHighlight: 2,
          tree: clone(root),
          activeKey: found ? cmd.val : null,
          desc: "Search (" + cmd.val + "): " + (found ? "Found match!" : "Not found in tree.")
        });
      } else if (cmd.op === 'delete') {
        function del(node, k) {
          if (!node) return null;
          if (k < node.key) node.left = del(node.left, k);
          else if (k > node.key) node.right = del(node.right, k);
          else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            let succ = node.right;
            while (succ.left) succ = succ.left;
            node.key = succ.key;
            node.right = del(node.right, succ.key);
          }
          return node;
        }
        root = del(root, cmd.val);
        steps.push({ lineHighlight: 4, tree: clone(root), desc: "Deleted key " + cmd.val + "." });
      } else if (cmd.op === 'inorder') {
        const order = [];
        function walk(node) {
          if (!node) return;
          walk(node.left);
          order.push(node.key);
          walk(node.right);
        }
        walk(root);
        steps.push({
          lineHighlight: 5,
          tree: clone(root),
          desc: "<b>Inorder Walk:</b> Sorted sequence: [" + order.join(', ') + "]."
        });
      }
    });

    steps.push({ lineHighlight: 1, tree: clone(root), desc: "<b>BST Operations Finished.</b>" });
    return steps;
  },
  renderCanvas(svg, step) {
    const root = step.tree;
    let html = '<text x="40" y="32" fill="#94a3b8" font-size="12" font-family="JetBrains Mono" font-weight="600">Binary Search Tree (BST)</text>';

    if (!root) {
      html += '<text x="400" y="160" text-anchor="middle" fill="#64748b" font-size="14" font-family="JetBrains Mono">BST is Empty</text>';
      svg.setAttribute('viewBox', '0 0 800 340');
      svg.innerHTML = html;
      return;
    }

    const nodeCoords = [], branches = [];
    function layout(node, x, y, spread) {
      if (!node) return;
      nodeCoords.push({ key: node.key, x, y });
      if (node.left) {
        const nx = x - spread, ny = y + 65;
        branches.push({ x1: x, y1: y, x2: nx, y2: ny });
        layout(node.left, nx, ny, spread * 0.55);
      }
      if (node.right) {
        const nx = x + spread, ny = y + 65;
        branches.push({ x1: x, y1: y, x2: nx, y2: ny });
        layout(node.right, nx, ny, spread * 0.55);
      }
    }
    layout(root, 400, 75, 170);

    branches.forEach(b => {
      html += '<line x1="' + b.x1 + '" y1="' + b.y1 + '" x2="' + b.x2 + '" y2="' + b.y2 + '" stroke="#334155" stroke-width="2"/>';
    });

    nodeCoords.forEach(n => {
      const isAct = step.activeKey === n.key;
      html += '<circle cx="' + n.x + '" cy="' + n.y + '" r="20" fill="' + (isAct ? 'rgba(20, 184, 166, 0.3)' : '#1e293b') + '" stroke="' + (isAct ? '#14b8a6' : '#334155') + '" stroke-width="' + (isAct ? 3 : 1.5) + '"/>';
      html += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" fill="' + (isAct ? '#2dd4bf' : '#fff') + '" font-size="13" font-family="JetBrains Mono" font-weight="700">' + n.key + '</text>';
    });

    svg.setAttribute('viewBox', '0 0 800 350');
    svg.innerHTML = html;
  },
  renderTable(thead, tbody, step) {
    thead.innerHTML = '<tr><th>Node Key</th><th>Subtrees</th><th>Status</th></tr>';
    let rows = '';
    function listNodes(node) {
      if (!node) return;
      const l = node.left ? node.left.key : 'NIL';
      const r = node.right ? node.right.key : 'NIL';
      const isAct = step.activeKey === node.key;
      rows += '<tr class="' + (isAct ? 'active-row' : '') + '">' +
        '<td><b style="color:var(--teal)">Node (' + node.key + ')</b></td>' +
        '<td><code>L: ' + l + ' | R: ' + r + '</code></td>' +
        '<td>' + (isAct ? '<span style="color:var(--amber); font-weight:700;">Active Focus</span>' : 'In Tree') + '</td>' +
      '</tr>';
      listNodes(node.left);
      listNodes(node.right);
    }
    if (step.tree) listNodes(step.tree);
    tbody.innerHTML = rows;
  },
  legend: [
    { color: 'var(--teal)', label: 'Active Node Focus' },
    { color: 'var(--gray)', label: 'BST Branch Links' }
  ]
};

module.exports = {
  SortingRenderer,
  BubbleSortModule,
  SelectionSortModule,
  InsertionSortModule,
  MergeSortModule,
  QuickSortModule,
  HeapSortModule,
  BfsModule,
  DfsModule,
  LinkedListModule,
  BinaryHeapModule,
  BstModule
};
