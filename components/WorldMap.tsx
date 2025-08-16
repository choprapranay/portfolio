"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { PaperAirplaneIcon as PlaneOutline } from "@heroicons/react/24/outline";
import { WAYPOINTS } from "@/lib/waypoints";

// WORLD size (logical units) and CAMERA window
const WORLD_W = 200;
const WORLD_H = 100;
const CAM_W = 100;
const CAM_H = 100;

type Pt = { x: number; y: number };

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

function dist(a: Pt, b: Pt) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

function cumulativeLengths(points: Pt[]) {
    const cum: number[] = [0];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
        total += dist(points[i - 1], points[i]);
        cum.push(total);
    }
    return { cum, total };
}

function buildPolylineD(points: Pt[]) {
    if (!points.length) return "";
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y}` + rest.map(p => ` L ${p.x} ${p.y}`).join("");
}

export default function WorldMap() {
    const points = WAYPOINTS.map(({ x, y }) => ({ x, y }));
    const d = useMemo(() => buildPolylineD(points), [points]);
    const pathRef = useRef<SVGPathElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Precompute path lengths (for accurate waypoint progress)
    const { cum, total } = useMemo(() => cumulativeLengths(points), [points]);

    // Animation & camera state
    const [progress, setProgress] = useState(0);      // 0..1 along path
    const [isPlaying, setIsPlaying] = useState(true); // autoplay state
    const [camX, setCamX] = useState(0);              // camera top-left
    const [camY, setCamY] = useState(0);
    const [activeIdx, setActiveIdx] = useState(0);    // highlight active waypoint

    // Pixel-stable waypoint hit radius (≈28px), computed from current SVG size
    const [hitRUnits, setHitRUnits] = useState(2);

    useEffect(() => {
        if (!svgRef.current) return;
        const svgEl = svgRef.current;

        const updateHitRadius = () => {
            const rect = svgEl.getBoundingClientRect();
            const ppuX = rect.width / CAM_W;   // pixels per world unit horizontally
            const desiredPx = 28;
            const units = Math.max(2, desiredPx / ppuX);
            setHitRUnits(units);
        };

        updateHitRadius();
        const ro = new ResizeObserver(updateHitRadius);
        ro.observe(svgEl);
        return () => ro.disconnect();
    }, []);

    // Autoplay 0 → 1
    useEffect(() => {
        if (!isPlaying) return;
        const controls = animate(progress, 1, {
            duration: (1 - progress) * 20,
            ease: "linear",
            onUpdate: v => setProgress(v),
            onComplete: () => setIsPlaying(false),
        });
        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    // Sample plane (x,y,angle) on the path
    let x = 0, y = 0, angle = 0;
    if (pathRef.current) {
        const p = pathRef.current;
        const len = p.getTotalLength();
        const cur = p.getPointAtLength(len * progress);
        const ahead = p.getPointAtLength(len * Math.min(progress + 0.001, 1));
        x = cur.x; y = cur.y;
        angle = (Math.atan2(ahead.y - cur.y, ahead.x - cur.x) * 180) / Math.PI;
    }

    // Camera follows the plane (center-ish), clamped to world
    useEffect(() => {
        const targetX = clamp(x - CAM_W / 2, 0, WORLD_W - CAM_W);
        const targetY = clamp(y - CAM_H / 2, 0, WORLD_H - CAM_H);
        const cx = animate(camX, targetX, { duration: 0.6, ease: "easeOut", onUpdate: v => setCamX(v) });
        const cy = animate(camY, targetY, { duration: 0.6, ease: "easeOut", onUpdate: v => setCamY(v) });
        return () => { cx.stop(); cy.stop(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [x, y]);

    // Map waypoint index -> true progress by length
    function progressForWaypoint(idx: number) {
        if (total === 0) return 0;
        return cum[idx] / total;
    }

    // Click-to-fly: ONLY when paused
    const jumpTo = (idx: number) => {
        if (isPlaying) return;
        setActiveIdx(idx);
        const target = progressForWaypoint(idx);
        const distance = Math.abs(target - progress);
        const duration = Math.max(0.35, Math.min(1.2, distance * 3)); // scale with distance
        const controls = animate(progress, target, {
            duration,
            ease: "easeInOut",
            onUpdate: v => setProgress(v),
        });
        return () => controls.stop();
    };

    // plane visual params
    const planeSize = 6;        // world units; CAM_W=100 → this is ~6% of width
    const noseOffsetDeg = -45;  // aim paper plane's nose along +X

    return (
        <div className="relative w-full h-[70vh] rounded-2xl bg-gradient-to-b from-sky-100 to-white shadow p-4">
            <svg
                ref={svgRef}
                viewBox={`${camX} ${camY} ${CAM_W} ${CAM_H}`}
                className="w-full h-full"
            >
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 z" className="fill-slate-700" />
                    </marker>
                </defs>

                {/* Path */}
                <motion.path
                    ref={pathRef}
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.6}
                    markerEnd="url(#arrow)"
                    className="text-slate-700"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                {/* Waypoints */}
                {WAYPOINTS.map((w, idx) => (
                    <g
                        key={w.id}
                        transform={`translate(${w.x} ${w.y})`}
                        className={isPlaying ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                    >
                        {/* Visible marker */}
                        <circle
                            r={activeIdx === idx ? 2 : 1.6}
                            className={activeIdx === idx ? "fill-sky-200 stroke-sky-700" : "fill-white stroke-slate-800"}
                            style={{ pointerEvents: "none" }} // don't steal clicks
                        />
                        {/* Label */}
                        <text
                            x={3}
                            y={1.2}
                            className="text-[2px] fill-slate-800 select-none"
                            style={{ pointerEvents: "none" }}
                        >
                            {w.label}
                        </text>
                        {/* BIG invisible hit area (~28px on screen) */}
                        <circle
                            r={hitRUnits}
                            fill="transparent"
                            stroke="transparent"
                            onClick={() => jumpTo(idx)}
                            style={{ pointerEvents: isPlaying ? "none" : "auto" }}
                        />
                    </g>
                ))}

                {/* Plane (SVG-in-SVG, no clipping) */}
                {(() => (
                    <g
                        transform={`translate(${x} ${y}) rotate(${angle + noseOffsetDeg}) translate(${-planeSize / 2} ${-planeSize / 2})`}
                    >
                        <PlaneOutline
                            width={planeSize}
                            height={planeSize}
                            className="text-sky-700"
                        />
                    </g>
                ))()}
            </svg>

            {/* HUD */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="px-3 py-1 rounded-xl bg-white shadow border"
                >
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <div className="px-3 py-1 rounded-xl bg-white shadow border">
                    {Math.round(progress * 100)}%
                </div>
            </div>
        </div>
    );
}