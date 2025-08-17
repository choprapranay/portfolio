"use client";

import { MarkerF } from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { WAYPOINTS } from "@/lib/waypoints";
import { OverlayView } from "@react-google-maps/api";


type Pt = { lat: number; lng: number };
const toRad = (d: number) => (d * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
function haversineKm(a: Pt, b: Pt) {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s1 = Math.sin(dLat / 2) ** 2;
    const s2 = Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}
function cumulativeLengths(points: Pt[]) {
    const cum: number[] = [0];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
        total += haversineKm(points[i - 1], points[i]);
        cum.push(total);
    }
    return { cum, total };
}
function interpolate(a: Pt, b: Pt, t: number): Pt {
    return { lat: lerp(a.lat, b.lat, t), lng: lerp(a.lng, b.lng, t) };
}
function bearingDeg(a: Pt, b: Pt) {
    const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
    const x =
        Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
        Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
    const deg = (Math.atan2(y, x) * 180) / Math.PI;
    return (deg + 360) % 360;
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function planeSvgDataUrl({
                             size,
                             rotationDeg,
                             color = "#7A0E2A",
                         }: {
    size: number;
    rotationDeg: number;
    color?: string;
}) {
    const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'>
    <g transform='translate(12,12) rotate(${rotationDeg}) translate(-12,-12)'>
      <path d="M2 12l20-7-7 20-3-8-8-5z" fill="${color}"/>
    </g>
  </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function diamondGlyphSvgDataUrl({
                                    size,
                                    fill = "#7A0E2A",
                                    outline = "#FFFFFF",
                                }: { size: number; fill?: string; outline?: string }) {
    const d = "M12 2l8 10-8 10-8-10 8-10z";
    const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'>
    <path d='${d}' fill='${fill}' stroke='${outline}' stroke-width='1.4'/>
  </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function Popup({
                   position,
                   onClose,
                   children,
               }: {
    position: google.maps.LatLngLiteral;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(w, h) => ({
                x: -(w ?? 0) / 2,
                y: -((h ?? 0) + 18),
            })}
        >
            <div className="group relative">
                {/* Card */}
                <div className="rounded-2xl border border-black/5 bg-white/95 backdrop-blur-md shadow-xl p-4 min-w-[260px] max-w-[340px]">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-slate-700 hover:bg-black/10"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>

                    {children}
                </div>

                {/* Little anchor caret */}
                <div className="absolute left-1/2 top-[calc(100%_-_2px)] -translate-x-1/2">
                    <div className="h-3 w-3 rotate-45 bg-white/95 border-l border-t border-black/5" />
                </div>
            </div>
        </OverlayView>
    );
}


export default function MapOverlays({
                                        map,
                                        maxZoomOnClick = 12,
                                        pauseOnPopup = true,
                                    }: {
    map: google.maps.Map | null;
    maxZoomOnClick?: number;
    pauseOnPopup?: boolean;
}) {
    const points = useMemo(() => WAYPOINTS.map(({ lat, lng }) => ({ lat, lng })), []);
    const { cum, total } = useMemo(() => cumulativeLengths(points), [points]);

    const wpProgresses = useMemo(
        () => (total === 0 ? WAYPOINTS.map(() => 0) : cum.map((c) => c / total)),
        [cum, total]
    );

    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const prevProgressRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0);

    const pauseReasonRef = useRef<"popup" | "user" | null>(null);

    const directRef = useRef<{
        active: boolean;
        from: Pt;
        to: Pt;
        start: number;
        dur: number;
        bearing: number;
        targetIdx: number;
    }>({ active: false, from: { lat: 0, lng: 0 }, to: { lat: 0, lng: 0 }, start: 0, dur: 0, bearing: 0, targetIdx: 0 });

    const [plane, setPlane] = useState<Pt>(points[0] ?? { lat: 0, lng: 0 });
    const [bearing, setBearing] = useState<number>(0);

    const [openId, setOpenId] = useState<string | null>(null);

    const rafRouteRef = useRef<number | null>(null);
    const startTsRef = useRef<number | null>(null);
    const startProgRef = useRef(0);

    useEffect(() => {
        if (!isPlaying || directRef.current.active) return;
        const durationMs = 20000;
        startProgRef.current = progress;
        startTsRef.current = null;

        const step = (ts: number) => {
            if (!isPlaying || directRef.current.active) return;
            if (startTsRef.current == null) startTsRef.current = ts;

            const elapsed = ts - startTsRef.current;
            const t = clamp(elapsed / durationMs, 0, 1);
            const p = startProgRef.current + (1 - startProgRef.current) * t;

            const { pt, brg } = posAtRouteProgress(p);
            setPlane(pt);
            setBearing(brg);
            setProgress(p);
            followCamera(map, pt);

            const prev = prevProgressRef.current;
            for (let i = 0; i < wpProgresses.length; i++) {
                const wpP = wpProgresses[i];
                if (prev < wpP && wpP <= p + 1e-9) {
                    setActiveIdx(i);
                    setOpenId(WAYPOINTS[i].id);
                    if (pauseOnPopup) {
                        pauseReasonRef.current = "popup";
                        setIsPlaying(false);
                        prevProgressRef.current = p;
                        return;
                    }
                }
            }
            prevProgressRef.current = p;

            if (t < 1) {
                rafRouteRef.current = requestAnimationFrame(step);
            } else {
                setIsPlaying(false);
            }
        };

        rafRouteRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRouteRef.current != null) cancelAnimationFrame(rafRouteRef.current);
            rafRouteRef.current = null;
        };
    }, [isPlaying, total]);

    function posAtRouteProgress(p: number): { pt: Pt; brg: number } {
        if (points.length === 0) return { pt: { lat: 0, lng: 0 }, brg: 0 };
        if (p <= 0) return { pt: points[0], brg: bearingDeg(points[0], points[1] ?? points[0]) };
        const targetKm = p * total;
        let idx = cum.findIndex((c) => c >= targetKm);
        if (idx === -1) idx = cum.length - 1;
        const prevIdx = Math.max(0, idx - 1);
        const segStartKm = cum[prevIdx];
        const segLenKm = Math.max(1e-6, cum[idx] - segStartKm);
        const t = clamp((targetKm - segStartKm) / segLenKm, 0, 1);
        const a = points[prevIdx];
        const b = points[idx];
        return { pt: interpolate(a, b, t), brg: bearingDeg(a, b) };
    }

    function progressForWaypoint(idx: number) {
        if (total === 0) return 0;
        return cum[idx] / total;
    }

    const jumpTo = (idx: number) => {
        if (isPlaying) return;
        setActiveIdx(idx);
        setOpenId(null);

        const from = plane;
        const to = points[idx];
        const dKm = haversineKm(from, to);
        const dur = clamp(dKm * 12, 700, 2200);
        const brg = bearingDeg(from, to);

        directRef.current = {
            active: true,
            from,
            to,
            start: performance.now(),
            dur,
            bearing: brg,
            targetIdx: idx,
        };

        const run = (now: number) => {
            const leg = directRef.current;
            if (!leg.active) return;
            const t = clamp((now - leg.start) / leg.dur, 0, 1);
            const eased = easeInOutCubic(t);
            const pos = interpolate(leg.from, leg.to, eased);

            setPlane(pos);
            setBearing(leg.bearing);
            followCamera(map, pos);

            if (t < 1) {
                requestAnimationFrame(run);
            } else {
                leg.active = false;
                const wp = WAYPOINTS[leg.targetIdx];
                setOpenId(wp.id);
                const p = progressForWaypoint(leg.targetIdx);
                setProgress(p);
                prevProgressRef.current = p;
                if (map) map.panTo(leg.to);
            }
        };
        requestAnimationFrame(run);

        if (map) {
            map.panTo(to);
            const targetZ = Math.min(map.getZoom() ?? maxZoomOnClick, maxZoomOnClick);
            map.setZoom(targetZ);
        }
    };

    const lastPanTs = useRef(0);
    function followCamera(m: google.maps.Map | null, p: Pt) {
        if (!m) return;
        const now = performance.now();
        if (now - lastPanTs.current > 120) {
            m.panTo(p);
            lastPanTs.current = now;
        }
    }

    const planeSize = 40;
    const noseOffset = -45;
    const planeIcon = useMemo<google.maps.Icon>(
        () => ({
            url: planeSvgDataUrl({ size: planeSize, rotationDeg: bearing + noseOffset, color: "#7A0E2A" }),
            scaledSize: new google.maps.Size(planeSize, planeSize),
            anchor: new google.maps.Point(planeSize / 2, planeSize / 2),
        }),
        [bearing]
    );

    const diamondIcon = useMemo((): google.maps.Icon => {
        const size = 28;
        return {
            url: diamondGlyphSvgDataUrl({ size, fill: "#7A0E2A", outline: "#FFFFFF" }),
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(size / 2, size / 2),
        };
    }, []);

    const remainingKm = Math.max(0, total * (1 - progress));

    return (
        <>
            {/* Plane */}
            <MarkerF position={plane} icon={planeIcon} zIndex={1000} />

            {/* Diamond markers */}
            {WAYPOINTS.map((wp, idx) => (
                <MarkerF
                    key={wp.id}
                    position={{ lat: wp.lat, lng: wp.lng }}
                    icon={diamondIcon}
                    zIndex={900}
                    onClick={() => !isPlaying && jumpTo(idx)}
                    clickable={!isPlaying}
                    title={isPlaying ? "Pause to click" : `Fly to ${wp.label}`}
                />
            ))}

            {/* Popup */}
            {openId && (() => {
                const wp = WAYPOINTS.find((w) => w.id === openId)!;
                return (
                    <Popup
                        position={{ lat: wp.lat, lng: wp.lng }}
                        onClose={() => {
                            setOpenId(null);
                            if (!directRef.current.active && pauseOnPopup) {
                                if (pauseReasonRef.current === "popup") setIsPlaying(true);
                            }
                            pauseReasonRef.current = null;
                        }}
                    >
                        <div className="pr-9">
                            <h3 className="text-xl md:text-2xl font-bold text-[#7A0E2A] leading-tight mb-1">
                                {wp.title ?? wp.label}
                            </h3>

                            {wp.subtitle && (
                                <p className="text-sm md:text-base text-[#556270] mb-2">
                                    {wp.subtitle}
                                </p>
                            )}

                            {wp.blurb && (
                                <p className="text-sm md:text-[15px] text-slate-700">
                                    {wp.blurb}
                                </p>
                            )}

                            {wp.linkHref && (
                                wp.linkHref.startsWith("http") ? (
                                    <a
                                        href={wp.linkHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-block text-sm px-3.5 py-2 rounded-lg bg-[#7A0E2A] text-white hover:bg-[#5E0A20]"
                                    >
                                        {wp.linkText ?? "Open"}
                                    </a>
                                ) : (
                                    <Link
                                        href={wp.linkHref}
                                        scroll={false}
                                        className="mt-3 inline-block text-sm px-3.5 py-2 rounded-lg bg-[#7A0E2A] text-white hover:bg-[#5E0A20]"
                                    >
                                        {wp.linkText ?? "Open"}
                                    </Link>
                                )
                            )}
                        </div>
                    </Popup>
                );
            })()}

            {/* HUD */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                <div className="w-[min(92vw,680px)] rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg shadow-xl">

                    <div className="flex items-center gap-3 px-4 pt-3">
                        <button
                            onClick={() => {
                                if (directRef.current.active) directRef.current.active = false;
                                setIsPlaying((was) => {
                                    const next = !was;
                                    if (!next) {
                                        pauseReasonRef.current = "user";
                                    } else {
                                        pauseReasonRef.current = null;
                                        prevProgressRef.current = progress;
                                        startTsRef.current = null;
                                        startProgRef.current = progress;
                                    }
                                    return next;
                                });
                            }}
                            aria-label={isPlaying ? "Pause route autoplay" : "Play route autoplay"}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/30 hover:bg-white/40 text-[#0F172A]"
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#7A0E2A">
                                    <path strokeWidth="2" strokeLinecap="round" d="M7 5h3v14H7zM14 5h3v14h-3z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#7A0E2A">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 6l12 6-12 6V6z" />
                                </svg>
                            )}
                        </button>

                        <div className="relative flex-1 h-3 rounded-full bg-white/30 overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-[#7A0E2A] transition-[width] duration-200"
                                style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                                role="progressbar"
                                aria-valuenow={Math.round(progress * 100)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>

                        <div className="w-28 text-right text-xs font-medium text-[#0F172A] select-none">
                            {Math.round(remainingKm).toLocaleString()} km left
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-3 pb-2 pt-2">
                        <div className="flex items-center gap-2.5">
                            <a
                                href="https://www.linkedin.com/in/YOUR_HANDLE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/40 bg-white/25 hover:bg-white/35"
                                title="LinkedIn"
                                aria-label="Open LinkedIn in a new tab"
                            >
                                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#7A0E2A">
                                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.15V23h-4v-6.65c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V23h-4V8z"/>
                                </svg>
                            </a>
                            <a
                                href="https://github.com/YOUR_HANDLE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/40 bg-white/25 hover:bg-white/35"
                                title="GitHub"
                                aria-label="Open GitHub in a new tab"
                            >
                                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#7A0E2A">
                                    <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.62 0 0 .85-.27 2.8 1.02A9.8 9.8 0 0112 6.8c.86 0 1.73.12 2.54.35 1.95-1.29 2.8-1.02 2.8-1.02.55 1.36.2 2.37.1 2.62.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86l-.01 2.75c0 .27.18.58.69.48A10 10 0 0012 2z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:you@domain.com"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/40 bg-white/25 hover:bg-white/35"
                                title="Email me"
                                aria-label="Compose an email"
                            >
                                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="#7A0E2A">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                                </svg>
                            </a>
                        </div>

                        <Link
                            href="/projects"
                            scroll={false}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/25 hover:bg-white/35 px-3.5 py-2 text-[#7A0E2A]"
                            title="Open Projects"
                            aria-label="Open Projects overlay"
                        >
                            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="#7A0E2A">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                            </svg>
                            <span className="text-sm font-medium">Projects</span>
                        </Link>
                    </div>

                    <div className="px-4 pb-3 text-center">
                        <p className="text-xs text-slate-600 italic select-none">
                            made by Pranay — no turbulence detected
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
