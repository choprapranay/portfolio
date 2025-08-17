
export type Waypoint = {
    id: string;
    label: string;
    lat: number;
    lng: number;
    title?: string;
    subtitle?: string;
    blurb?: string;
    linkText?: string;
    linkHref?: string;
};

export const WAYPOINTS: Waypoint[] = [
    {
        id: "kolkata",
        label: "Kolkata, India",
        lat: 22.5726,
        lng: 88.3639,
        title: "Born in Kolkata 🇮🇳",
        subtitle: "Proud immigrant — moved at 4",
        blurb: "Roots in Kolkata shape my perspective and drive.",
    },
    {
        id: "uoft",
        label: "Toronto — U of T",
        lat: 43.6629,
        lng: -79.3957,
        title: "University of Toronto",
        subtitle: "CS @ U of T",
        blurb: "DSA, systems, and a love for playful UI.",
    },
    {
        id: "fit4less",
        label: "Fit4Less — Milton",
        lat: 43.5240,
        lng: -79.8710,
        title: "Gym Rat",
        subtitle: "Fit4Less, Milton",
        blurb: "Consistency > intensity. I lift, I code, I repeat.",
    },
    {
        id: "projects",
        label: "San Francisco — Projects",
        lat: 37.7749,
        lng: -122.4194,
        title: "Projects",
        subtitle: "Interactive, animated, web-native",
        blurb: "I’m most proud of the things I’ve built. Dive in.",
        linkText: "Open Projects",
        linkHref: "/projects",
    },
    {
        id: "music",
        label: "Lisbon, Portugal — Music",
        lat: 38.7169,
        lng: -9.1390,
        title: "House Music in Lisbon 🎶",
        subtitle: "Beaches, beats, and late nights",
        blurb: "I love house music and going out — but I’m just as ready to be locked in when I need to focus.",
        linkText: "My Spotify",
        linkHref: "https://open.spotify.com/",
    },
    {
        id: "london",
        label: "London, UK",
        lat: 51.5074,
        lng: -0.1278,
        title: "London Calling 🇬🇧",
        subtitle: "Future home (hopefully!)",
        blurb: "Big tech, bigger culture. Manifesting this move.",
    },
    {
        id: "contact",
        label: "YYZ — Contact",
        lat: 43.6777,
        lng: -79.6248,
        title: "Final Approach",
        subtitle: "Let’s work together",
        blurb: "Open to internships and collabs. My inbox is always clear for takeoff.",
        linkText: "Contact me",
        linkHref: "/contact",
    },
];