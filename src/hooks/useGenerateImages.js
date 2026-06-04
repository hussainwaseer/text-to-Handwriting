// ── useGenerateImages.js ──
// Core image generation logic: html2canvas capture, multi-page pagination, PDF export.

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { createPDF, contrastImage, humanizeHandwriting } from '../utils/helpers';

export function useGenerateImages() {
    const [outputImages, setOutputImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    /**
     * Capture a single page of the paper element as a canvas.
     */
    const captureCanvas = useCallback(async (paperEl, resolution, effect) => {
        const options = {
            scrollX: 0,
            scrollY: -window.scrollY,
            scale: parseFloat(resolution) || 2,
            useCORS: true,
            allowTaint: true,
        };
        const canvas = await html2canvas(paperEl, options);
        if (effect === 'scanner') {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            contrastImage(imageData, 0.55);
            ctx.putImageData(imageData, 0, 0);
        }
        // Apply human-like randomness: wave warp + ink noise + baseline jitter
        humanizeHandwriting(canvas);
        return canvas;
    }, []);

    /**
     * Apply temporary styles to paperEl before capture.
     */
    const applyStyles = (paperEl, overlayEl, effect) => {
        const stored = paperEl.style.border;
        paperEl.style.border = 'none';
        paperEl.style.overflowY = 'hidden';
        if (overlayEl) {
            const deg = effect === 'scanner'
                ? Math.floor(Math.random() * 70) + 50
                : Math.floor(Math.random() * 360);
            overlayEl.style.background = `linear-gradient(${deg}deg, rgba(0,0,0,0.35), transparent)`;
            overlayEl.classList.add('active');
        }
        return stored;
    };

    const removeStyles = (paperEl, overlayEl) => {
        paperEl.style.border = '';
        paperEl.style.overflowY = '';
        if (overlayEl) {
            overlayEl.style.background = '';
            overlayEl.classList.remove('active');
        }
    };

    /**
     * Main generate function — handles multi-page pagination.
     */
    const generateImages = useCallback(async ({ paperEl, overlayEl, resolution, effect }) => {
        if (!paperEl || isGenerating) return;
        setIsGenerating(true);

        const paperContentEl = paperEl.querySelector('.paper-content');
        if (!paperContentEl) { setIsGenerating(false); return; }

        applyStyles(paperEl, overlayEl, effect);
        paperEl.scrollTo(0, 0);

        // Measure the visible page height from the actual rendered element
        const pageHeight = paperEl.clientHeight;

        const newCanvases = [];
        const initialContent = paperContentEl.innerHTML;

        try {
            // Tokenise the existing innerHTML into individual tokens (words + spaces)
            const tokens = initialContent.split(/(\s+)/).filter(t => t.length > 0);
            const totalScrollHeight = paperContentEl.scrollHeight;
            const isMultiPage = totalScrollHeight > pageHeight + 2; // +2 px tolerance

            if (!isMultiPage) {
                // Single page — capture as-is
                paperEl.scrollTo(0, 0);
                const canvas = await captureCanvas(paperEl, resolution, effect);
                newCanvases.push(canvas);
            } else {
                // Multi-page: fill one page worth of content, capture, repeat
                let tokenIndex = 0;

                while (tokenIndex < tokens.length) {
                    paperContentEl.innerHTML = '';
                    let pageTokens = [];
                    let lastGood = '';

                    // Accumulate tokens until the content overflows the page height
                    while (tokenIndex < tokens.length) {
                        pageTokens.push(tokens[tokenIndex]);
                        paperContentEl.innerHTML = pageTokens.join('');

                        if (paperContentEl.scrollHeight > pageHeight) {
                            // This token caused overflow — step back one token
                            pageTokens.pop();
                            tokenIndex--;
                            break;
                        }
                        lastGood = pageTokens.join('');
                        tokenIndex++;
                    }

                    // If no tokens fit at all (edge case: single huge token), force-include it
                    if (pageTokens.length === 0 && tokenIndex < tokens.length) {
                        lastGood = tokens[tokenIndex];
                        tokenIndex++;
                    }

                    paperContentEl.innerHTML = lastGood || pageTokens.join('');
                    paperEl.scrollTo(0, 0);
                    const canvas = await captureCanvas(paperEl, resolution, effect);
                    newCanvases.push(canvas);
                    tokenIndex++;
                }
            }

            // Commit captured canvases to state (inside try so it always runs if capture succeeded)
            if (newCanvases.length > 0) {
                setOutputImages(prev => [...prev, ...newCanvases]);
            }
        } finally {
            // Always restore original content and styles
            paperContentEl.innerHTML = initialContent;
            removeStyles(paperEl, overlayEl);
            setIsGenerating(false);
        }
    }, [captureCanvas, isGenerating]);

    const deleteImage = useCallback((index) => {
        setOutputImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    const deleteAll = useCallback(() => setOutputImages([]), []);

    const moveLeft = useCallback((index) => {
        if (index === 0) return;
        setOutputImages(prev => {
            const arr = [...prev];
            [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
            return arr;
        });
    }, []);

    const moveRight = useCallback((index) => {
        setOutputImages(prev => {
            if (index >= prev.length - 1) return prev;
            const arr = [...prev];
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            return arr;
        });
    }, []);

    const downloadPDF = useCallback(() => {
        if (outputImages.length > 0) createPDF(outputImages);
    }, [outputImages]);

    return {
        outputImages, isGenerating,
        generateImages, deleteImage, deleteAll,
        moveLeft, moveRight, downloadPDF,
    };
}
