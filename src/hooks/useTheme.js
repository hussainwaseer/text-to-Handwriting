// ── useTheme.js ──
// Dark/light mode toggle with localStorage persistence and system preference detection.

import { useState, useEffect } from 'react';

export function useTheme() {
    const getInitial = () => {
        const stored = localStorage.getItem('tth-theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const [theme, setTheme] = useState(getInitial);

    useEffect(() => {
        document.body.classList.toggle('light', theme === 'light');
        localStorage.setItem('tth-theme', theme);
    }, [theme]);

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return { theme, toggle };
}
