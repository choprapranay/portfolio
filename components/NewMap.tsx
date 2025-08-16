"use client";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import CUSTOM_MAP from "@/lib/custommapstyle";

export default function NewMap() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const center = useMemo(() => ({ lat: 20, lng: 0 }), []);

    //Restrict Panning
    const restrictions = useMemo(
        () => ({
            north: 85,
            south: -85,
            west: -176,
            east: 174,
        }),
        []
    );

    const options = useMemo<google.maps.MapOptions>(
        () => ({
            styles: CUSTOM_MAP,
            disableDefaultUI: true,
            gestureHandling: "greedy",
            minZoom: 2,
            maxZoom: 10,
            restriction: {
                latLngBounds: restrictions,
                strictBounds: true,       // hard clamp
            },
            backgroundColor: "#0b1012",
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
        }),
        [restrictions]
    );

    if (!isLoaded) return <div className="fixed inset-0 bg-slate-900" />;

    return (
        <div className="fixed inset-0">
            <GoogleMap
                mapContainerClassName="w-full h-full"
                center={center}
                zoom={2}
                options={options}
            />
        </div>
    );
}