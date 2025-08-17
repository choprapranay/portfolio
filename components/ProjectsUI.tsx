"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import { PROJECTS} from "./projects-data";

export function ProjectsGrid({
                                 onOpen,
                             }: {
    onOpen: (id: string) => void;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS.map((proj) => (
                <button
                    key={proj.id}
                    onClick={() => onOpen(proj.id)}
                    className="group text-left rounded-2xl border border-black/5 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all overflow-hidden hover:-translate-y-0.5"
                >
                    {proj.imageUrl ? (
                        <div className="h-40 w-full bg-slate-100 overflow-hidden">
                            <img
                                src={proj.imageUrl}
                                alt={proj.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                        </div>
                    ) : (
                        <div className="h-2 w-full bg-gradient-to-r from-[#7A0E2A] via-[#9a2744] to-[#7A0E2A]" />
                    )}

                    <div className="p-4">
                        <h3 className="text-[1.05rem] font-semibold text-[#7A0E2A] tracking-tight">
                            {proj.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#556270]">{proj.shortDesc}</p>

                        {proj.tags?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {proj.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs rounded-full border border-black/10 bg-white/70 px-2 py-0.5 text-slate-700"
                                    >
                    {t}
                  </span>
                                ))}
                            </div>
                        ) : null}

                        <div className="mt-4">
              <span className="inline-flex items-center text-sm font-medium text-[#0F172A]">
                View details
                <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export function ProjectsModal({
                                  onClose,
                                  initialId,
                              }: {
    onClose: () => void;
    initialId?: string | null;
}) {
    const [openId, setOpenId] = useState<string | null>(initialId ?? null);
    const openProject = useMemo(
        () => PROJECTS.find((p) => p.id === openId) ?? null,
        [openId]
    );

    const detailsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (openProject && detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [openProject]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            tabIndex={-1}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Card container */}
            <div className="relative z-10 w-full sm:max-w-5xl rounded-t-2xl sm:rounded-2xl border border-black/5 bg-white/95 backdrop-blur-md shadow-2xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-slate-700 hover:bg-black/10"
                    aria-label="Close"
                >
                    <XIcon className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 pr-16">
                    <h2 className="text-2xl font-bold text-[#7A0E2A] tracking-tight leading-tight">
                        Projects
                    </h2>
                    <p className="text-sm text-[#556270] mt-1">
                        Interactive, animated, web-native
                    </p>
                </div>

                {/* Scrollable content area */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 max-h-[80vh] overflow-y-auto">
                    {/* Responsive 2-column on lg+, single column on mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Grid */}
                        <div>
                            <ProjectsGrid onOpen={(id) => setOpenId(id)} />
                        </div>

                        {/* Right: Details (sticky on lg+) */}
                        <div
                            ref={detailsRef}
                            className={`
                ${openProject ? "block" : "hidden lg:block"}
                lg:sticky lg:top-0 lg:self-start
              `}
                        >
                            {openProject ? (
                                <div className="rounded-2xl border border-black/5 bg-white/90 backdrop-blur-sm p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#7A0E2A] tracking-tight">
                                                {openProject.name}
                                            </h3>

                                        </div>
                                        <button
                                            className="text-xs underline text-slate-600 hover:text-slate-800"
                                            onClick={() => setOpenId(null)}
                                        >
                                            Close details
                                        </button>
                                    </div>

                                    {openProject.longDesc && (
                                        <p className="mt-2 text-[15px] text-slate-700 leading-relaxed">
                                            {openProject.longDesc}
                                        </p>
                                    )}

                                    <div className="mt-3 flex flex-wrap items-center gap-3">
                                        {openProject.githubUrl && (
                                            <a
                                                href={openProject.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center rounded-xl bg-[#7A0E2A] px-4 py-2 text-white hover:bg-[#5E0A20]"
                                            >
                                                <GitHubIcon className="mr-2 h-4 w-4" />
                                                GitHub
                                            </a>
                                        )}

                                    </div>

                                    {openProject.videoUrl && (
                                        <div className="mt-4">
                                            <div className="relative w-full overflow-hidden rounded-xl border border-black/10 bg-black pt-[56.25%]">
                                                <iframe
                                                    className="absolute inset-0 h-full w-full"
                                                    src={openProject.videoUrl}
                                                    title={`${openProject.name} demo video`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500">
                                                Use a YouTube <code className="font-mono">/embed/</code> URL.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden lg:flex items-center justify-center h-40 rounded-2xl border border-dashed border-black/10 text-slate-500">
                                    Select a project to see details →
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
        </svg>
    );
}
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.62 0 0 .85-.27 2.8 1.02A9.8 9.8 0 0112 6.8c.86 0 1.73.12 2.54.35 1.95-1.29 2.8-1.02 2.8-1.02.55 1.36.2 2.37.1 2.62.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86l-.01 2.75c0 .27.18.58.69.48A10 10 0 0012 2z" />
        </svg>
    );
}
