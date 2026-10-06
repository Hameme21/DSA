# 🧪 DSA Algo Lab: 22-Algorithm Interactive Simulation Suite

An interactive, zero-dependency, single-file algorithmic laboratory and visualizer built with vanilla JavaScript, dynamic SVG graphics, and Web Audio synthesis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Engines](https://img.shields.io/badge/algorithms-22%20Engines-teal.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)

---

## 🚀 Live Demo
🌐 **[https://dsa-sandy.vercel.app/](https://dsa-sandy.vercel.app/)**

---

## 📚 Included Algorithms (22 Engines)

### 1. Sorting Algorithms
- **Bubble Sort**: Adjacent comparisons, active element swaps, and in-place bubble up.
- **Selection Sort**: Unsorted suffix scanning, live minimum-index tracking, and prefix swaps.
- **Insertion Sort**: Key extraction, backward shifting, and target slot placement.
- **Merge Sort**: Divide-and-conquer subarray brackets, auxiliary buffer, and linear merge.
- **Quick Sort**: Lomuto partitioning with designated pivot bar, boundary tracking (`i`, `j`), and recursive windows.
- **Heap Sort**: Max-heap construction via sift-down operations, root extraction, and heap boundary contraction.

### 2. Graph Traversals
- **Breadth-First Search (BFS)**: Level-order traversal with live FIFO Queue display, $d[v]$ distance badges, and parent tree edges.
- **Depth-First Search (DFS)**: Recursive exploration with live Call Stack visualizer, discovery/finish timestamps ($d[u]/f[u]$), and edge classification (Tree vs Back edges).

### 3. Trees & Data Structures
- **Singly Linked List**: `[Data | Next •]` node cards, SVG pointer arrows, head/tail markers, search, delete, and step-by-step 3-pointer list reversal.
- **Binary Min-Heap**: Dual visualization showing complete binary tree geometry alongside 1D array slot layouts ($2i+1$ / $2i+2$), sift-up on insert, and sift-down on `extractMin`.
- **Binary Search Tree (BST)**: Dynamic tree coordinate layout, search path traversal, node insertion, and Hibbard deletion ($0$, $1$, or $2$ children with inorder successor replacement).
- **Disjoint Set Union (DSU / Union-Find)**: Dynamic forest visualizer with union by rank and path compression flattening trees on find queries.

### 4. Minimum Spanning Trees
- **Prim's Algorithm**: Greedy cut property visualizer tracking candidate light edges spanning the cut $(S, V \setminus S)$.
- **Kruskal's Algorithm**: Ascending edge weight examination with cycle prevention via DSU and red dashed rejected edge indicators.

### 5. Shortest Path Algorithms
- **Dijkstra's SSSP**: Single-source shortest path with non-negative weights, priority queue extraction, and edge relaxation.
- **Bellman-Ford SSSP**: $|V|-1$ relaxation passes with negative weight support, quadratic Bézier bidirectional edge routing, deconflicted label placement, and negative cycle detection.

### 6. Greedy Paradigms
- **Activity Selection Problem**: Interval scheduling sorted by finish time with conflict-free task selection.
- **Fractional Knapsack Problem**: Density-based value/weight sorting with proportional item fractioning.
- **Huffman Coding Tree**: Greedy bottom-up prefix-free binary tree construction with character frequency parsing.
- **Job Sequencing with Deadlines**: Profit maximization with deadline slot allocation and late job rejection.

### 7. Hashing & Strings
- **Hash Table & Collision Resolution**: Probing methods (Linear Probing, Quadratic Probing, Double Hashing) and Separate Chaining with tombstone (`[DEL]`) semantics.
- **Rabin-Karp String Matching**: Rolling hash matching with $O(1)$ window transitions via modular arithmetic and spurious hit detection.

---

## 🎮 Keyboard Controls

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Play / Pause auto-simulation |
| <kbd>&larr;</kbd> / <kbd>&rarr;</kbd> | Step backward / forward |
| <kbd>[</kbd> / <kbd>]</kbd> | Cycle previous / next algorithm among all 22 |
| <kbd>R</kbd> | Reset simulation to step 1 |
| <kbd>1</kbd> - <kbd>4</kbd> | Greedy Paradigms (Activity, Knapsack, Huffman, JobSeq) |
| <kbd>5</kbd> - <kbd>7</kbd> | Trees & MST (DSU, Prim, Kruskal) |
| <kbd>8</kbd> - <kbd>9</kbd> | Shortest Path (Dijkstra, Bellman-Ford) |
| <kbd>0</kbd> | Hash Table |
| <kbd>-</kbd> | Rabin-Karp |
| <kbd>B</kbd>, <kbd>M</kbd>, <kbd>Q</kbd> | Bubble Sort, Merge Sort, Quick Sort |
| <kbd>L</kbd>, <kbd>H</kbd>, <kbd>T</kbd> | Linked List, Min-Heap, Binary Search Tree |

---

## 🚢 Deployment (Vercel &amp; GitHub Pages)

- **Vercel**: Deploy with zero configuration by importing this repository. Live at [https://dsa-sandy.vercel.app/](https://dsa-sandy.vercel.app/).
- **GitHub Pages**: Go to **Settings** &rarr; **Pages**, select branch `main` and folder `/ (root)`.

---

## 🔍 Google Search Engine Optimization (SEO)

- **Schema.org Structured Data**: Integrated `WebApplication`, `ItemList` (all 22 algorithms), and `FAQPage` JSON-LD schemas for Google Rich Snippets and Knowledge Panels.
- **Search Engine Discovery**: Includes [`robots.txt`](robots.txt) and [`sitemap.xml`](sitemap.xml) for Googlebot discovery.
- **Meta & Open Graph**: Full support for canonical tags, Open Graph cards, Twitter summary cards, and SVG favicons.

---

&copy;copyright&copy; 2026 **Hameme21** &bull; `version 1.0.0`

