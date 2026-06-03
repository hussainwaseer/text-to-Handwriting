// ── useDraw.js ──
// Freehand drawing canvas — mouse + touch support, mobile detection.

import { useRef, useEffect, useCallback, useState } from 'react';
import { isMobile } from '../utils/helpers';

export function useDraw({ inkColor }) {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const pointSize = isMobile ? 0.5 : 1.5;

    const getPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    };

    const drawPoint = useCallback((x, y) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { x: lx, y: ly } = lastPos.current;

        if (isDrawing.current && (x !== lx || y !== ly)) {
            ctx.lineWidth = pointSize * 2;
            ctx.strokeStyle = inkColor;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = inkColor;
        ctx.arc(x, y, pointSize, 0, Math.PI * 2);
        ctx.fill();
        lastPos.current = { x, y };
    }, [inkColor, pointSize]);

    const clear = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getDataURL = useCallback(() => {
        return canvasRef.current?.toDataURL('image/png');
    }, []);

    const downloadDrawing = useCallback(() => {
        const url = getDataURL();
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.png';
        a.click();
    }, [getDataURL]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set mobile canvas size
        if (isMobile) { canvas.width = 300; canvas.height = 150; }

        const onStart = (e) => {
            isDrawing.current = true;
            const pos = getPos(e, canvas);
            lastPos.current = pos;
            drawPoint(pos.x, pos.y);
        };
        const onEnd = () => { isDrawing.current = false; };
        const onMove = (e) => {
            if (!isDrawing.current) return;
            if (e.cancelable) e.preventDefault();
            const pos = getPos(e, canvas);
            drawPoint(pos.x, pos.y);
        };

        if (isMobile) {
            canvas.addEventListener('touchstart', onStart, { passive: true });
            canvas.addEventListener('touchend', onEnd, { passive: true });
            canvas.addEventListener('touchmove', onMove, { passive: false });
        } else {
            canvas.addEventListener('mousedown', onStart);
            canvas.addEventListener('mouseup', onEnd);
            canvas.addEventListener('mousemove', onMove);
        }
        return () => {
            if (isMobile) {
                canvas.removeEventListener('touchstart', onStart);
                canvas.removeEventListener('touchend', onEnd);
                canvas.removeEventListener('touchmove', onMove);
            } else {
                canvas.removeEventListener('mousedown', onStart);
                canvas.removeEventListener('mouseup', onEnd);
                canvas.removeEventListener('mousemove', onMove);
            }
        };
    }, [drawPoint]);

    return { canvasRef, clear, getDataURL, downloadDrawing };
}
