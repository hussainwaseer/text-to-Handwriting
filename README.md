# ✍️ Text to Handwriting (React Edition)
> The premium, zero-backend tool to transform any digital text into beautiful, handwritten A4 pages.
>
>
<p align="center">
  <strong>
    <a href="https://text-to-handwriting-vert.vercel.app">
      🚀 Try it live →
    </a>
  </strong>
</p>


## 📖 What is Text to Handwriting?
Text to Handwriting is a client-side-only React web application that converts typed or pasted text into downloadable images (or PDFs) that perfectly simulate handwriting on ruled paper. Rebuilt entirely from scratch using modern React best practices, this "Premium Edition" features a stunning glassmorphic UI, fluid dark/light modes, and a highly optimized pagination engine.

**Who is it for?** Students, creatives, and anyone who needs to quickly generate "handwritten" assignments, letters, or notes without picking up a pen.

---

## ✨ Core Features

### 📄 Smart A4 Pagination Engine
- **Content-Aware Splitting**: Automatically splits long text across multiple dynamically generated A4-ratio pages.
- **Auto-scroll Compensation**: Measures `scrollHeight` inside the ContentEditable container to detect overflows.
- **Lossless Rendering**: Uses `html2canvas` for precise, pixel-perfect captures of the DOM state.

### 🎨 Premium Glassmorphic UI
- **Dark/Light Mode**: Persistent themes that automatically respect the OS `prefers-color-scheme`.
- **Responsive Grid**: Fluid two-column layout that gracefully collapses on mobile devices.
- **Bespoke Animations**: Micro-interactions, hover effects, and premium button styling built with pure CSS (no bloated UI libraries).

### 🔠 Endless Customization
- **Font Selection**: Comes pre-loaded with beautiful Handwriting fonts (Homemade Apple, Caveat, Kalam, Pacifico, Urdu Nastaliq, etc.).
- **BYOF (Bring Your Own Font)**: Seamlessly upload custom `.ttf` or `.otf` files to simulate your exact handwriting using the HTML5 `FileReader` API.
- **Spacing Control**: Fine-tune letter spacing, word gaps, and top margins so the text aligns perfectly with the paper lines.
- **Ink Colors**: Choose from classic Ink Blue, Black, Red, or Green.
- **Visual Effects**: Apply a "Scanner Effect" that dynamically crushes the contrast using `CanvasRenderingContext2D.putImageData()` to make the output look like a real, slightly distorted photocopier scan.

### 🖍️ Built-in Drawing Canvas
- **Freehand Diagrams**: Included a touch-friendly popup canvas to draw diagrams or signatures directly in the browser.
- **Import Media**: Users can upload external images onto the canvas, trace them, or inject them straight into the paper's flow.

### 📥 Export & Output Management
- **Image Gallery**: Reorder, preview, or individually download generated pages as JPEGs.
- **One-Click PDF**: Compile the entire array of pages into a single, print-ready PDF via `jsPDF`.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Vite + React (Client-side Only) |
| **Styling** | Vanilla CSS (CSS Variables, Flex/Grid, Glassmorphism) |
| **DOM Capture** | `html2canvas` |
| **PDF Generation** | `jspdf` |
| **State Management**| React Hooks (`useState`, `useRef`, `useCallback`) |

---

## 🚀 Quick Start

The app requires absolutely zero backend, zero databases, and zero auth. 

### Prerequisites
- Node.js 18+

### Installation

```bash
# 1. Clone
git clone https://github.com/yourusername/text-to-handwriting-react.git
cd text-to-handwriting-react

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🏗 Architecture & Hooks

```text
src/
├── App.jsx                       # Root layout and global state wiring
├── components/
│   ├── Header.jsx                # Branding & Theme Toggle
│   ├── PaperPreview.jsx          # ContentEditable A4 rendering surface
│   ├── CustomizationPanel.jsx    # Font, Color, and Pagination controls
│   ├── DrawCanvas.jsx            # HTML5 Canvas popup for freehand drawing
│   ├── OutputGallery.jsx         # Generated image list + drag/drop + PDF export
│   └── InfoSections.jsx          # Static FAQ & usage guides
├── hooks/
│   ├── useTheme.js               # Manages CSS dark/light classes & localStorage
│   ├── useGenerateImages.js      # Core Engine: text-splitting & html2canvas loops
│   └── useDraw.js                # Normalizes mouse/touch events for the diagram tool
└── utils/
    └── helpers.js                # PDF compilation, font loading, contrast filters
```

### The Rendering Flow
1. User types in `PaperPreview.jsx` (`contentEditable` div).
2. User clicks Generate. `App.jsx` triggers `useGenerateImages()`.
3. The hook measures the `scrollHeight` of the paper.
4. If it overflows the standard A4 height, it splits the text node by node.
5. It renders the chunk, captures it via `html2canvas`, clears the surface, renders the next chunk, captures it, etc.
6. The resulting array of `Canvas` references is stored in state and passed to `OutputGallery.jsx` for download or `jsPDF` compilation.

---

## 🚢 Deployment

The repository is configured for instantaneous deployment to any static host (Vercel, Netlify, GitHub Pages) via the included `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

1. Connect the repository to Vercel.
2. Click **Deploy**.
3. Done.

---

## 📜 License
MIT © 2026. Built as a premium React port of the original Text-to-Handwriting open-source project.
