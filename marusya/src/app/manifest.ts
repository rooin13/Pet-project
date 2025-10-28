import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "MARUSYA - Watch Movies & TV Shows Online",
        short_name: "MARUSYA",
        description: "Discover millions of movies and TV shows online",
        start_url: "/",
        display: "standalone",
        background_color: "#0c1a2d",
        theme_color: "#8b5cf6",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
        ],
    };
}

