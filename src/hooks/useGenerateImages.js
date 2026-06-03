// ── useGenerateImages.js ──
// Core image generation logic: html2canvas capture, multi-page pagination, PDF export.

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { createPDF, contrastImage } from '../utils/helpers';

const CLIENT_HEIGHT = 514; // height of blank A4 paper content area in px

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

        const savedBorder = applyStyles(paperEl, overlayEl, effect);
        paperEl.scrollTo(0, 0);

        const scrollHeight = paperContentEl.scrollHeight;
        const totalPages = Math.ceil(scrollHeight / CLIENT_HEIGHT);
        const newCanvases = [];

        try {
            if (totalPages <= 1) {
                const canvas = await captureCanvas(paperEl, resolution, effect);
                newCanvases.push(canvas);
            } else {
                const initialContent = paperContentEl.innerHTML;
                const splitContent = initialContent.split(/(\s+)/);
                let wordCount = 0;

                for (let i = 0; i < totalPages; i++) {
                    paperContentEl.innerHTML = '';
                    const wordArray = [];
                    let wordString = '';
                    while (paperContentEl.scrollHeight <= CLIENT_HEIGHT && wordCount <= splitContent.length) {
                        wordString = wordArray.join(' ');
                        wordArray.push(splitContent[wordCount]);
                        paperContentEl.innerHTML = wordArray.join(' ');
                        wordCount++;
                    }
                    paperContentEl.innerHTML = wordString;
                    wordCount--;
                    paperEl.scrollTo(0, 0);
                    const canvas = await captureCanvas(paperEl, resolution, effect);
                    newCanvases.push(canvas);
                    paperContentEl.innerHTML = initialContent;
                }
            }
        } finally {
            removeStyles(paperEl, overlayEl);
            setIsGenerating(false);
        }

        setOutputImages(prev => [...prev, ...newCanvases]);
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
