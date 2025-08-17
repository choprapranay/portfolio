export type Project = {
    id: string;
    name: string;
    shortDesc: string;
    longDesc?: string;
    githubUrl?: string;
    videoUrl?: string;
    imageUrl?: string;
    tags?: string[];
};

export const PROJECTS: Project[] = [
    {
        id: "visionboard",
        name: "VisionBoard – Virtual Styling",
        shortDesc: "Mood-based outfits to match your future self.",
        longDesc:
            "VisionBoard helps users visualize and dress like their aspirational selves. It recommends outfits from moodboards and curates looks across seasons.",
        githubUrl: "https://github.com/yourname/visionboard",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tags: ["Next.js", "Tailwind", "AI"],
    },
    {
        id: "fitmaker",
        name: "FitMaker",
        shortDesc: "Upload your closet, get auto-generated outfit combos.",
        longDesc:
            "Users upload their own clothes; FitMaker builds capsule combos and suggests similar items online via affiliate links.",
        githubUrl: "https://github.com/yourname/fitmaker",
        tags: ["React", "Python", "Scraping"],
    },
    {
        id: "tickettracker",
        name: "TicketTracker",
        shortDesc: "Track SeatGeek event prices & alert on dips.",
        longDesc:
            "Set a price threshold for events. TicketTracker monitors and pings you when listings drop below your target.",
        githubUrl: "https://github.com/yourname/tickettracker",
        tags: ["FastAPI", "Cron", "Twilio"],
    },
    {
        id: "internspy",
        name: "InternSpy",
        shortDesc: "Discord bot that finds internships daily.",
        longDesc:
            "Scrapes new roles, lets students save/filter/apply in Discord, and syncs to Notion for tracking.",
        githubUrl: "https://github.com/yourname/internspy",
        tags: ["Discord.py", "JobSpy", "Notion API"],
    },
    {
        id: "hot-tonight",
        name: "Hot Tonight",
        shortDesc: "Realtime campus event feed: what’s lit now.",
        longDesc:
            "Anonymous submissions + IG/Eventbrite integrations. Voting via reactions surfaces the best events fast.",
        githubUrl: "https://github.com/yourname/hot-tonight",
        tags: ["Node", "Realtime"],
    },
    {
        id: "setlist-oracle",
        name: "Setlist Oracle",
        shortDesc: "Predict the next concert’s setlist.",
        longDesc:
            "Uses Setlist.fm + frequency analysis to forecast likely songs, confidence scores, and encore odds.",
        githubUrl: "https://github.com/yourname/setlist-oracle",
        videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
        tags: ["PyTorch", "Setlist.fm API"],
    },
];
