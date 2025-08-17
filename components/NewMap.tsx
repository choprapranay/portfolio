"use client";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo, useRef, useState } from "react";
import CUSTOM_MAP from "@/lib/custommapstyle";
import MapOverlays from "./MapOverlays";

export default function NewMap() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [_, force] = useState(0);

    const center = useMemo(() => ({ lat: 20, lng: 0 }), []);
    const fence = useMemo(() => ({ north: 85, south: -85, west: -176, east: 176 }), []);
    const options = useMemo<google.maps.MapOptions>(() => ({
        styles: CUSTOM_MAP,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        minZoom: 2,
        maxZoom: 12,
        restriction: { latLngBounds: fence, strictBounds: true },
        backgroundColor: "#0b1012",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    }), [fence]);

    if (!isLoaded) return <div className="fixed inset-0 bg-slate-900" />;

    return (
        <div className="fixed inset-0">
            <GoogleMap
                mapContainerClassName="w-full h-full"
                center={center}
                zoom={2}
                options={options}
                onLoad={(m) => { mapRef.current = m; force((n) => n + 1); }}
                onUnmount={() => { mapRef.current = null; }}
            >
                <MapOverlays map={mapRef.current} />
            </GoogleMap>
        </div>
    );
}