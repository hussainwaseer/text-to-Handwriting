// ── PaperPreview.jsx ──
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { formatText, addPaperFromFile } from '../utils/helpers';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Ut rhoncus dui eget tortor feugiat iaculis. Morbi et dolor
in felis viverra efficitur. Integer id laoreet arcu.
Mauris turpis nibh, scelerisque sed tristique non,
hendrerit in erat. Duis interdum nisl risus, ac ultrices
ipsum auctor at. Aliquam faucibus iaculis metus sit amet
tincidunt. Vestibulum cursus urna vel nunc imperdiet suscipit.`;

const PaperPreview = forwardRef(function PaperPreview({
    font, fontSize, inkColor, wordSpacing, letterSpacing, topPadding,
    showLines, showMargin, effect,
    onRequestDrawCanvas,
}, ref) {
    const paperRef = useRef(null);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    // Expose refs to parent for capture
    useImperativeHandle(ref, () => ({
        get paperEl() { return paperRef.current; },
        get overlayEl() { return overlayRef.current; },
    }));

    // Sync styles to paper element
    useEffect(() => {
        if (!paperRef.current) return;
        paperRef.current.style.setProperty('--ink', inkColor);
        paperRef.current.style.fontFamily = font;
        paperRef.current.style.fontSize = fontSize + 'pt';
    }, [font, fontSize, inkColor]);

    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.style.wordSpacing = wordSpacing + 'px';
        contentRef.current.style.letterSpacing = letterSpacing + 'pt';
        contentRef.current.style.paddingTop = topPadding + 'px';
    }, [wordSpacing, letterSpacing, topPadding]);

    const handlePaste = (e) => formatText(e);

    const paperClasses = [
        'paper',
        showLines ? 'show-lines' : '',
        showMargin ? 'show-margin' : '',
    ].filter(Boolean).join(' ');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                Live Preview — Type or Paste Text
            </label>

            {/* Paper */}
            <div ref={paperRef} className={paperClasses} style={{ color: inkColor }}>
                <div className="paper-top-margin" />
                <div className="paper-left-margin" />
                <div
                    ref={contentRef}
                    id="note"
                    className="paper-content"
                    contentEditable
                    suppressContentEditableWarning
                    onPaste={handlePaste}
                    style={{ fontFamily: font, fontSize: fontSize + 'pt', color: inkColor }}
                    dangerouslySetInnerHTML={undefined}
                >
                    {LOREM}
                </div>
                <div ref={overlayRef} className="paper-overlay" />
            </div>

            {/* Draw button */}
            <button
                type="button"
                className="btn btn-ghost"
                style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }}
                onClick={onRequestDrawCanvas}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Draw Diagram
                <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4 }}>Beta</span>
            </button>
        </div>
    );
});

export default PaperPreview;
