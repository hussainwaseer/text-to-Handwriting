// ── App.jsx — Root component, wires all state and components ──
import React, { useState, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import PaperPreview from './components/PaperPreview';
import CustomizationPanel from './components/CustomizationPanel';
import DrawCanvas from './components/DrawCanvas';
import OutputGallery from './components/OutputGallery';
import InfoSections from './components/InfoSections';
import { useTheme } from './hooks/useTheme';
import { useGenerateImages } from './hooks/useGenerateImages';

const DEFAULT_SETTINGS = {
  font: "'Homemade Apple', cursive",
  fontSize: 10,
  inkColor: '#000f55',
  pageEffect: 'shadows',
  resolution: '2',
  topPadding: 5,
  wordSpacing: 0,
  letterSpacing: 0,
  showMargin: true,
  showLines: true,
};

export default function App() {
  const { theme, toggle } = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showDraw, setShowDraw] = useState(false);
  const paperRef = useRef(null);
  const noteRef = useRef(null);

  const {
    outputImages, isGenerating,
    generateImages, deleteImage, deleteAll,
    moveLeft, moveRight, downloadPDF,
  } = useGenerateImages();

  const handleChange = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paperRef.current) return;
    generateImages({
      paperEl: paperRef.current.paperEl,
      overlayEl: paperRef.current.overlayEl,
      resolution: settings.resolution,
      effect: settings.pageEffect,
    });
  };

  const handleAddToPaper = (dataURL) => {
    // Prepend drawn image into the note contenteditable
    const note = document.getElementById('note');
    if (note) {
      note.innerHTML = `<img style="width:100%;display:block;margin-bottom:8px;" src="${dataURL}" />` + note.innerHTML;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 4vw, 60px)' }}>
      {/* Header */}
      <Header theme={theme} onToggleTheme={toggle} />

      {/* Hero tagline */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12, background: 'linear-gradient(135deg, var(--text) 30%, var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Turn Text Into Handwriting
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8, fontSize: '0.9rem' }}>
          Paste any text, pick a style, and generate beautiful A4 pages that look handwritten.
          Free forever, works offline, zero data storage.
        </p>
      </div>

      {/* Main form */}
      <form onSubmit={handleSubmit}>
        <div className="main-grid">
          {/* Left — Paper */}
          <PaperPreview
            ref={paperRef}
            font={settings.font}
            fontSize={settings.fontSize}
            inkColor={settings.inkColor}
            wordSpacing={settings.wordSpacing}
            letterSpacing={settings.letterSpacing}
            topPadding={settings.topPadding}
            showLines={settings.showLines}
            showMargin={settings.showMargin}
            effect={settings.pageEffect}
            onRequestDrawCanvas={() => setShowDraw(true)}
          />

          {/* Right — Controls */}
          <CustomizationPanel
            settings={settings}
            onChange={handleChange}
            paperRef={paperRef}
            isGenerating={isGenerating}
            onGenerate={handleSubmit}
          />
        </div>
      </form>

      {/* Output gallery */}
      <div
        id="output-section"
        style={{
          marginTop: 56,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
          <h2 id="output-header" style={{ margin: 0 }}>
            Output {outputImages.length > 0 && <span style={{ color: 'var(--accent-2)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 400 }}>({outputImages.length})</span>}
          </h2>
        </div>
        <OutputGallery
          images={outputImages}
          onDelete={deleteImage}
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
          onDeleteAll={deleteAll}
          onDownloadPDF={downloadPDF}
        />
      </div>

      {/* Info sections */}
      <InfoSections />

      {/* Draw popup */}
      {showDraw && (
        <DrawCanvas
          inkColor={settings.inkColor}
          onClose={() => setShowDraw(false)}
          onAddToPaper={handleAddToPaper}
        />
      )}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}
