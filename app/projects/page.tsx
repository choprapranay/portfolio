"use client";
import { useState } from "react";
import { ProjectsGrid } from "@/components/ProjectsUI";
import { PROJECTS } from "@/components/projects-data";

export default function ProjectsPage() {
    const [openId, setOpenId] = useState<string | null>(null);
    const active = PROJECTS.find((p) => p.id === openId) ?? null;

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
                <p className="mt-2 text-slate-600">A collection of things I’ve built recently.</p>

                <div className="mt-8">
                    <ProjectsGrid onOpen={setOpenId} />
                </div>

                {active && (
                    <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">{active.name}</h2>
                        {active.longDesc && (
                            <p className="mt-2 text-slate-700 leading-relaxed">{active.longDesc}</p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
