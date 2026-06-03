// ── InfoSections.jsx ── Static guide, FAQ sections
import React, { useState } from 'react';

const faqs = [
    {
        q: 'How do I add my own handwriting?',
        a: 'You need a .ttf or .otf font file of your handwriting. Use a service like Calligraphr.com to generate one from a template you fill in, then upload it via the "Upload Your Font" button in the Handwriting section.',
    },
    {
        q: 'Where can I get more handwriting fonts?',
        a: 'You can find free handwriting fonts at Google Fonts (fonts.google.com), DaFont (dafont.com), or FontSquirrel (fontsquirrel.com). Download the .ttf file and upload it.',
    },
    {
        q: 'Why are there gaps between letters in custom fonts?',
        a: 'This is a known rendering variation across fonts. Use the Letter Gap and Word Gap controls in the Spacing section to fine-tune the spacing until it looks natural.',
    },
    {
        q: 'Can I use this commercially or for assignments?',
        a: 'This tool is provided for personal, creative, and educational use. That said — if your teacher finds out, make sure they appreciate good open-source tools! 🙂',
    },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <div className="faq-q" onClick={() => setOpen(o => !o)}>
                <span>{q}</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-3)', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
            </div>
            {open && <div className="faq-a">{a}</div>}
        </div>
    );
}

export default function InfoSections() {
    return (
        <>
            {/* Guide */}
            <div className="section" id="how-to-add-handwriting">
                <p className="section-title">🎓 Guide</p>
                <h2 style={{ marginBottom: 16 }}>Add Your Own Handwriting</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {[
                        { step: '01', title: 'Get the Template', desc: 'Visit Calligraphr.com and download their handwriting template sheet (free tier available).' },
                        { step: '02', title: 'Write It Out', desc: 'Print the template and fill in every character with your own handwriting using a pen.' },
                        { step: '03', title: 'Scan & Upload', desc: 'Scan or photograph the sheet and upload it to Calligraphr to generate your .ttf font.' },
                        { step: '04', title: 'Use It Here', desc: 'Download the .ttf file and upload it via the "Upload Your Font" button in Handwriting settings.' },
                    ].map(({ step, title, desc }) => (
                        <div key={step} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: '20px',
                        }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-2)', marginBottom: 8 }}>{step}</div>
                            <h3 style={{ marginBottom: 8 }}>{title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="section" id="faq">
                <p className="section-title">❓ FAQ</p>
                <h2 style={{ marginBottom: 20 }}>Frequently Asked Questions</h2>
                {faqs.map((faq, i) => <FaqItem key={i} {...faq} />)}
            </div>

            {/* Footer */}
            <div className="section" style={{ textAlign: 'center', borderBottom: 'none', paddingBottom: 60 }}>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                    Built with ♥ · 100% client-side · No data ever leaves your browser
                </p>
            </div>
        </>
    );
}
