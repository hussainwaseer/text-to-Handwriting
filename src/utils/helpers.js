// ── helpers.js ──
// Font upload, PDF creation, paste formatter, paper background

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
 * Load a custom font from a .ttf/.otf file using the FontFace API
 * and apply it to the given element.
 */
export function addFontFromFile(fileObj, paperEl) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFont = new FontFace('user-font', e.target.result);
    newFont.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      if (paperEl) paperEl.style.fontFamily = 'user-font, cursive';
    });
  };
  reader.readAsArrayBuffer(fileObj);
}

/**
 * Create and save a PDF from an array of canvas elements.
 */
export function createPDF(canvases) {
  // jsPDF is loaded globally via CDN in index.html - but we import it here
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const width = doc.internal.pageSize.width;
    const height = doc.internal.pageSize.height;
    canvases.forEach((canvas, i) => {
      doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 25, 50, width - 50, height - 80, `img-${i}`);
      if (i < canvases.length - 1) doc.addPage();
    });
    doc.save('handwriting.pdf');
  });
}

/**
 * Strip HTML from paste events — only allow plain text + <br> for newlines.
 */
export function formatText(event) {
  event.preventDefault();
  const text = event.clipboardData
    .getData('text/plain')
    .replace(/\n/g, '<br/>');
  document.execCommand('insertHTML', false, text);
}

/**
 * Set paper background from an uploaded image file.
 */
export function addPaperFromFile(file, paperEl) {
  const tmppath = URL.createObjectURL(file);
  if (paperEl) paperEl.style.backgroundImage = `url(${tmppath})`;
}

/**
 * Boost contrast of ImageData for the "scanner" effect.
 */
export function contrastImage(imageData, contrast) {
  const data = imageData.data;
  contrast *= 255;
  const factor = (contrast + 255) / (255.01 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData;
}

/**
 * Make captured handwriting look more human by applying three subtle effects:
 *  1. Row-based sinusoidal horizontal wave warp  (hand tremor / shaky lines)
 *  2. Per-ink-pixel brightness noise             (pen pressure variation)
 *  3. Column-based vertical jitter               (baseline wobble)
 */
export function humanizeHandwriting(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const srcData = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(srcData.data);   // read-only copy
  const out = ctx.createImageData(w, h);
  const dst = out.data;

  // --- unique random parameters per call ---
  const waveAmp = 0.9 + Math.random() * 1.2;   // horizontal wave amplitude: 0.9–2.1 px
  const waveFreq = 0.004 + Math.random() * 0.006; // wave cycles per pixel
  const wavePhase = Math.random() * Math.PI * 2;

  const jitterAmp = 0.5 + Math.random() * 0.8;  // vertical jitter per column: 0.5–1.3 px
  const jitterFreq = 0.006 + Math.random() * 0.008;
  const jitterPhase = Math.random() * Math.PI * 2;

  const noiseStrength = 10 + Math.random() * 14;  // ink noise: ±10–24 brightness

  // --- pre-build per-row and per-column offsets ---
  const rowShift = new Int32Array(h);
  const colShift = new Int32Array(w);

  for (let y = 0; y < h; y++) {
    rowShift[y] = Math.round(waveAmp * Math.sin(waveFreq * y * Math.PI * 2 + wavePhase));
  }
  for (let x = 0; x < w; x++) {
    colShift[x] = Math.round(jitterAmp * Math.sin(jitterFreq * x * Math.PI * 2 + jitterPhase));
  }

  // --- warp pixels ---
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // source coords after applying both shifts
      const srcX = Math.max(0, Math.min(w - 1, x - rowShift[y]));
      const srcY = Math.max(0, Math.min(h - 1, y - colShift[x]));
      const srcIdx = (srcY * w + srcX) * 4;
      const dstIdx = (y * w + x) * 4;

      dst[dstIdx] = src[srcIdx];
      dst[dstIdx + 1] = src[srcIdx + 1];
      dst[dstIdx + 2] = src[srcIdx + 2];
      dst[dstIdx + 3] = src[srcIdx + 3];
    }
  }

  ctx.putImageData(out, 0, 0);

  // --- ink-pixel brightness noise (pen pressure variation) ---
  // Only applied to non-white pixels so the paper stays clean
  const noiseData = ctx.getImageData(0, 0, w, h);
  const nd = noiseData.data;
  for (let i = 0; i < nd.length; i += 4) {
    const avg = (nd[i] + nd[i + 1] + nd[i + 2]) / 3;
    if (avg < 210) {  // only darken-ish pixels (ink, lines, margin)
      const n = (Math.random() - 0.5) * noiseStrength;
      nd[i] = Math.max(0, Math.min(255, nd[i] + n));
      nd[i + 1] = Math.max(0, Math.min(255, nd[i + 1] + n));
      nd[i + 2] = Math.max(0, Math.min(255, nd[i + 2] + n));
    }
  }
  ctx.putImageData(noiseData, 0, 0);

  return canvas;
}
