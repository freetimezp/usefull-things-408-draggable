"use client";
import { useEffect, useRef } from "react";

const Grid = () => {
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const gridCanvas = gridCanvasRef.current;
        if (!gridCanvas) return;

        const ctx = gridCanvas.getContext("2d");
        if (!ctx) return;

        gridCanvas.width = window.innerWidth;
        gridCanvas.height = window.innerHeight;

        const gridSize = 37;
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= gridCanvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, gridCanvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= gridCanvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(gridCanvas.width, y + 0.5);
            ctx.stroke();
        }
    }, []);

    return <canvas ref={gridCanvasRef} className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full" />;
};

export default Grid;
