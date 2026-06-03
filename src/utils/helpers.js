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
    data[i]     = factor * (data[i]     - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData;
}
