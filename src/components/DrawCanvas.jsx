// ── DrawCanvas.jsx ──
import React, { useRef } from 'react';
import { useDraw } from '../hooks/useDraw';
import { isMobile } from '../utils/helpers';

export default function DrawCanvas({ inkColor, onClose, onAddToPaper }) {
    const { canvasRef, clear, getDataURL, downloadDrawing } = useDraw({ inkColor });

    const handleAddToPaper = () => {
        const dataURL = getDataURL();
        if (dataURL) onAddToPaper(dataURL);
        onClose();
    };

    const handleAddImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png,image/jpeg';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    const ratio = img.width / img.height;
                    if (ratio > 1) {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.width / ratio);
                    } else {
                        const w = canvas.height * ratio;
                        ctx.drawImage(img, (canvas.width - w) / 2, 0, w, canvas.height);
                    }
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    return (
        <div className="draw-popup" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="draw-popup-inner">
                {/* Canvas */}
                <div>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1rem' }}>Draw a Diagram</h2>
                        <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '1rem' }} onClick={onClose}>✕</button>
                    </div>
                    <canvas
                        ref={canvasRef}
                        id="diagram-canvas"
                        width={isMobile ? 300 : 600}
                        height={isMobile ? 150 : 300}
                        style={{ background: '#fff', touchAction: 'none' }}
                    />
                </div>

                {/* Controls */}
                <div className="draw-popup-controls">
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 8 }}>
                        Draw freely on the canvas, then add it to your paper.
                    </p>
                    <button className="btn btn-primary" onClick={handleAddToPaper}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                        Add to Paper
                    </button>
                    <button className="btn btn-ghost" onClick={downloadDrawing}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Drawing
                    </button>
                    <button className="btn btn-ghost" onClick={handleAddImage}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                        Add BG Image
                    </button>
                    <button className="btn btn-danger" onClick={clear}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                        </svg>
                        Clear Canvas
                    </button>
                </div>
            </div>
        </div>
    );
}
