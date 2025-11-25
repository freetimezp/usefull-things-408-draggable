"use client";
import React, { use, useEffect, useRef } from "react";

const GrainEffect = () => {
    const grainCanvasRef = useRef<HTMLCanvasElement>(null);
    const grainAnimationFrameRef = useRef<number>(0);

    useEffect(() => {
        const grainCanvas = grainCanvasRef.current;
        if (!grainCanvas) return;

        const ctx = grainCanvas.getContext("2d");
        if (!ctx) return;

        const grainDensity = 0.92;

        grainCanvas.width = window.innerWidth;
        grainCanvas.height = window.innerHeight;

        let lastTime = 0;
        const frameInterval = 1000 / 30;

        function renderGrain(timestamp: number) {
            if (!ctx || !grainCanvas) return;

            if (timestamp - lastTime < frameInterval) {
                grainAnimationFrameRef.current = requestAnimationFrame(renderGrain);
                return;
            }

            lastTime = timestamp;

            const imageData = ctx.createImageData(grainCanvas.width, grainCanvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i++) {
                if (Math.random() > grainDensity) {
                    const brightness = Math.random() * 255;
                    data[i] = brightness;
                    data[i + 1] = brightness;
                    data[i + 2] = brightness;
                    data[i + 3] = 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            grainAnimationFrameRef.current = requestAnimationFrame(renderGrain);
        }

        grainAnimationFrameRef.current = requestAnimationFrame(renderGrain);

        return () => {
            if (grainAnimationFrameRef.current) cancelAnimationFrame(grainAnimationFrameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={grainCanvasRef}
            className="pointer-events-none absolute top-0 left-0 z-0 w-full h-full opacity-15"
        ></canvas>
    );
};

export default GrainEffect;
