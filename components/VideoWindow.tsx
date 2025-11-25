"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { WindowData } from "../app/page";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/all";

interface VideoWindowProps {
    windows: WindowData[];
    videoSrc: string;
}

gsap.registerPlugin(Draggable, useGSAP);

const VideoWindow = ({ windows, videoSrc }: VideoWindowProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
    const videoRef = useRef<HTMLVideoElement>(null);

    const maxZIndex = useRef(Math.max(...windows.map((w) => w.zIndex)));
    const animationFrameRef = useRef<number>(0);

    const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [windowZIndexes, setWindowZIndexes] = useState<Record<string, number>>({});

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        function render() {
            if (!video) return;

            canvasRefs.current.forEach((canvas, windowId) => {
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const windowEl = document.querySelector(`.window[data-id="${windowId}"]`) as HTMLElement;
                if (!windowEl) return;

                const rect = windowEl.getBoundingClientRect();

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                ctx.beginPath();
                ctx.rect(rect.left, rect.top, rect.width, rect.height);
                ctx.clip();

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();

                ctx.strokeStyle = `rgba(255,255,255,0.5)`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
            });

            animationFrameRef.current = requestAnimationFrame(render);
        }

        const handleVideoReady = () => {
            canvasRefs.current.forEach((canvas) => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });

            render();
        };

        video.addEventListener("loadeddata", handleVideoReady);

        if (video.readyState >= 2) {
            handleVideoReady();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [windows]);

    useGSAP(() => {
        const windowEls = gsap.utils.toArray<HTMLElement>(".window");

        gsap.to(windowEls, {
            scale: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
        });

        windowEls.forEach((windowEl) => {
            const width = windowEl.offsetWidth;
            const height = windowEl.offsetHeight;
            const rect = windowEl.getBoundingClientRect();
            const initialLeft = rect.left;
            const initialTop = rect.top;

            const windowId = windowEl.getAttribute("data-id");

            Draggable.create(windowEl, {
                type: "x,y",
                bounds: {
                    minX: -(initialLeft + width / 2),
                    maxX: window.innerWidth - (initialLeft + width / 2),
                    minY: -(initialTop + height / 2),
                    maxY: window.innerHeight - (initialTop + height / 2),
                },
                inertia: true,
                throwResistance: 100000,
                onPress: function () {
                    if (!windowId) return;

                    maxZIndex.current += 1;
                    const newZIndex = maxZIndex.current;

                    gsap.set(windowEl, { zIndex: newZIndex });

                    const canvas = canvasRefs.current.get(windowId);
                    if (canvas) {
                        gsap.set(canvas, { zIndex: newZIndex });
                    }

                    setWindowZIndexes((prev) => ({
                        ...prev,
                        [windowId]: newZIndex,
                    }));
                },
                onDrag: function () {
                    const currentRect = windowEl.getBoundingClientRect();

                    if (windowId) {
                        setWindowPositions((prev) => ({
                            ...prev,
                            [windowId]: {
                                x: Math.round(currentRect.left),
                                y: Math.round(currentRect.top),
                            },
                        }));
                    }
                },
            });
        });
    });

    return (
        <>
            <video autoPlay loop muted playsInline className="opacity-0" ref={videoRef}>
                <source src={videoSrc} type="video/mp4" />
            </video>

            {windows.map((w) => (
                <canvas
                    key={`canvas-${w.id}`}
                    className="pointer-events-none absolute top-0 left-0 h-full w-full"
                    style={{ zIndex: w.zIndex }}
                    ref={(el) => {
                        if (el) {
                            canvasRefs.current.set(w.id, el);
                        }
                    }}
                />
            ))}

            <div ref={containerRef} className="absolute inset-0">
                {windows.map((w) => (
                    <div
                        key={w.id}
                        className="window group pointer-events-auto absolute origin-top-left scale-0 cursor-grab 
                            will-change-transform"
                        data-id={w.id}
                        style={{
                            left: `${w.left}px`,
                            top: `${w.top}px`,
                            width: `${w.width}px`,
                            height: `${w.height}px`,
                            zIndex: windowZIndexes[w.id] ?? w.zIndex,
                        }}
                    >
                        <div
                            className="absolute -top-5 -left-px flex h-5 items-center gap-2 bg-white/50 px-2 text-xs 
                                uppercase backdrop-blur-[300px] transition-all duration-300 ease-in-out group-hover:bg-white/70"
                        >
                            <span>X: {(windowPositions[w.id]?.x ?? w.left).toString().padStart(4, "0")}PX</span>
                            <span>Y: {(windowPositions[w.id]?.y ?? w.top).toString().padStart(4, "0")}PX</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default VideoWindow;
