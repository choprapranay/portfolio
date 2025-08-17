"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProjectsModal } from "@/components/ProjectsUI";

export default function ProjectsOverlay() {
    const router = useRouter();
    const params = useSearchParams();
    const initialId = params.get("id");

    return (
        <ProjectsModal
            initialId={initialId}
            onClose={() => router.back()}
        />
    );
}