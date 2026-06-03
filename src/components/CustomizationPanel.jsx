// ── CustomizationPanel.jsx ──
import React from 'react';
import { addFontFromFile, addPaperFromFile } from '../utils/helpers';

const FONTS = [
    { value: "'Homemade Apple', cursive", label: 'Homemade Apple' },
    { value: 'Hindi_Font, cursive', label: 'Kruti-dev (Hindi)' },
    { value: "'Noto Nastaliq Urdu', serif", label: 'Urdu (Nastaliq)' },
    { value: "'Caveat', cursive", label: 'Caveat' },
    { value: "'Liu Jian Mao Cao', cursive", label: 'Liu Jian Mao Cao' },
    { value: "'Kalam', cursive", label: 'Kalam' },
    { value: "'Shadows Into Light', cursive", label: 'Shadows Into Light' },
    { value: "'Pacifico', cursive", label: 'Pacifico' },
    { value: "'Dancing Script', cursive", label: 'Dancing Script' },
];

const INK_COLORS = [
    { value: '#000f55', label: 'Ink Blue' },
    { value: '#000000', label: 'Black' },
    { value: '#ba3807', label: 'Red' },
    { value: '#1a5c1a', label: 'Green' },
];

const EFFECTS = [
    { value: 'shadows', label: 'Shadows' },
    { value: 'scanner', label: 'Scanner' },
    { value: 'no-effect', label: 'No Effect' },
];

const RESOLUTIONS = [
    { value: '0.8', label: 'Very Low' },
    { value: '1', label: 'Low' },
    { value: '2', label: 'Normal' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Very High' },
];

export default function CustomizationPanel({
    settings, onChange, paperRef, isGenerating, onGenerate,
}) {
    const { font, fontSize, inkColor, pageEffect, resolution,
        topPadding, wordSpacing, letterSpacing,
        showMargin, showLines } = settings;

    const set = (key, val) => onChange(key, val);

    const handleFontFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (paperRef?.current?.paperEl) {
            addFontFromFile(file, paperRef.current.paperEl.querySelector('.paper-content'));
        }
    };

    const handlePaperFile = (e) => {
        const file = e.target.files[0];
        if (!file || !paperRef?.current?.paperEl) return;
        addPaperFromFile(file, paperRef.current.paperEl);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Handwriting ── */}
            <fieldset>
                <legend>✍️ Handwriting</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 12 }}>
                    <div>
                        <label>Font Style</label>
                        <select value={font} onChange={e => set('font', e.target.value)}>
                            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Upload Your Font <span style={{ color: 'var(--text-3)', textTransform: 'none', letterSpacing: 0 }}>.ttf / .otf</span></label>
                        <input type="file" accept=".ttf,.otf" onChange={handleFontFile} />
                    </div>
                </div>
            </fieldset>

            {/* ── Page & Text ── */}
            <fieldset>
                <legend>📄 Page & Text</legend>
                <div className="grid-2" style={{ marginTop: 12 }}>
                    <div>
                        <label>Ink Color</label>
                        <select value={inkColor} onChange={e => set('inkColor', e.target.value)}>
                            {INK_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div className="postfix-wrap" data-unit="pt">
                        <label>Font Size</label>
                        <input type="number" min="6" max="30" step="0.5" value={fontSize}
                            onChange={e => set('fontSize', e.target.value)} />
                    </div>
                    <div>
                        <label>Effect</label>
                        <select value={pageEffect} onChange={e => set('pageEffect', e.target.value)}>
                            {EFFECTS.map(fx => <option key={fx.value} value={fx.value}>{fx.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Resolution</label>
                        <select value={resolution} onChange={e => set('resolution', e.target.value)}>
                            {RESOLUTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: 12 }}>
                    <label>Upload Paper Background <span style={{ color: 'var(--text-3)', textTransform: 'none', letterSpacing: 0 }}>.jpg / .png</span></label>
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={handlePaperFile} />
                </div>
            </fieldset>

            {/* ── Spacing ── */}
            <fieldset>
                <legend>⬌ Spacing</legend>
                <div className="grid-3" style={{ marginTop: 12 }}>
                    <div className="postfix-wrap" data-unit="px">
                        <label>Top Offset</label>
                        <input type="number" min="0" max="100" value={topPadding}
                            onChange={e => set('topPadding', e.target.value)} />
                    </div>
                    <div className="postfix-wrap" data-unit="px">
                        <label>Word Gap</label>
                        <input type="number" min="0" max="100" value={wordSpacing}
                            onChange={e => set('wordSpacing', e.target.value)} />
                    </div>
                    <div className="postfix-wrap" data-unit="pt">
                        <label>Letter Gap</label>
                        <input type="number" min="-5" max="40" value={letterSpacing}
                            onChange={e => set('letterSpacing', e.target.value)} />
                    </div>
                </div>
            </fieldset>

            {/* ── Margin & Lines ── */}
            <fieldset>
                <legend>📏 Layout</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 12 }}>
                    <div className="toggle-wrap">
                        <label style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>
                            Paper Margin
                        </label>
                        <label className="toggle">
                            <input type="checkbox" checked={showMargin} onChange={e => set('showMargin', e.target.checked)} />
                            <div className="toggle-track" />
                            <div className="toggle-thumb" />
                        </label>
                    </div>
                    <div className="toggle-wrap">
                        <label style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>
                            Ruled Lines
                        </label>
                        <label className="toggle">
                            <input type="checkbox" checked={showLines} onChange={e => set('showLines', e.target.checked)} />
                            <div className="toggle-track" />
                            <div className="toggle-thumb" />
                        </label>
                    </div>
                </div>
            </fieldset>

            {/* ── Generate Button ── */}
            <button
                type="submit"
                className={`btn btn-gold btn-lg ${isGenerating ? 'btn-generating' : ''}`}
                data-testid="generate-image-button"
                disabled={isGenerating}
                style={{ marginTop: 4, width: '100%', justifyContent: 'center' }}
            >
                {isGenerating ? (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                        Generate Image
                    </>
                )}
            </button>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
