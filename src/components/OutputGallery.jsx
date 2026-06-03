// ── OutputGallery.jsx ──
import React from 'react';

export default function OutputGallery({ images, onDelete, onMoveLeft, onMoveRight, onDeleteAll, onDownloadPDF }) {
    if (images.length === 0) {
        return (
            <div className="output-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{ fontWeight: 500 }}>No images yet</p>
                <p style={{ fontSize: '0.8rem' }}>Fill in the paper above and click <strong>Generate Image</strong></p>
            </div>
        );
    }

    return (
        <div>
            {/* Actions bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                    {images.length} page{images.length > 1 ? 's' : ''} generated
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button id="download-as-pdf-button" className="btn btn-primary" onClick={onDownloadPDF} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download PDF
                    </button>
                    <button className="btn btn-danger" onClick={onDeleteAll} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        </svg>
                        Clear All
                    </button>
                </div>
            </div>

            {/* Image grid */}
            <div className="output-grid">
                {images.map((canvas, index) => (
                    <div key={index} className="output-card animate-in">
                        <button
                            className="output-card-remove"
                            onClick={() => onDelete(index)}
                            title="Remove"
                        >✕</button>
                        <img
                            src={canvas.toDataURL('image/jpeg')}
                            alt={`Output page ${index + 1}`}
                        />
                        <div className="output-card-actions">
                            <a
                                className="btn btn-ghost"
                                style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}
                                href={canvas.toDataURL('image/jpeg')}
                                download={`handwriting-page-${index + 1}.jpg`}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Save
                            </a>
                            {index > 0 && (
                                <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => onMoveLeft(index)}>
                                    ←
                                </button>
                            )}
                            {index < images.length - 1 && (
                                <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => onMoveRight(index)}>
                                    →
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
