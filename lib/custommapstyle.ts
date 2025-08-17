const CUSTOM_MAP: google.maps.MapTypeStyle[] = [
    { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },

    // LAND — cool slate/stone
    { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#CFCAC4" }] },
    { featureType: "landscape", elementType: "geometry.stroke", stylers: [{ color: "#C2BDB7" }] },
    { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#CFCAC4" }] },

    // POI
    { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#D1CCC6" }] },
    { featureType: "poi", elementType: "geometry.stroke", stylers: [{ color: "#C2BDB7" }] },

    // ROADS — slightly darker gray
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#BFB9B3" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#BFB9B3" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#B3ADA7" }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#C7C1BB" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#BAB4AE" }, { weight: 0.4 }] },
    { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#C3BDB7" }] },
    { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#CCC6C0" }] },

    { featureType: "transit", elementType: "geometry", stylers: [{ visibility: "off" }] },

    // WATER — darker, muted ocean
    { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#5E7891" }] },
    { featureType: "water", elementType: "geometry.stroke", stylers: [{ color: "#5E7891" }] },
    { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] },
];

//
export default CUSTOM_MAP;
