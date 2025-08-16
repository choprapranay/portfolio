export type Waypoint = { id: string; label: string; x: number; y: number };

export const WAYPOINTS: Waypoint[] = [
    { id: "home",     label: "Home Base", x: 10,  y: 70 },
    { id: "projects", label: "Projects",  x: 38,  y: 54 },
    { id: "school",   label: "School",    x: 62,  y: 32 },
    { id: "hometown", label: "Hometown",  x: 84,  y: 74 },
    { id: "travel",   label: "Travel",    x: 150, y: 40 },
];