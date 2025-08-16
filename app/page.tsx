import WorldMap from "@/components/WorldMap";

export default function Home() {
    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-sky-700 mb-2">✈️ Welcome to My World</h1>
            <p className="text-slate-600 mb-6">Follow the flight path or click a location to jump.</p>
            <WorldMap />
        </main>
    );
}