import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_PLAYLISTS = [
    {
        id: "37i9dQZF1DX4JAvHpjipBk",
        title: "Mint",
        description: "Fresh dance and house hits",
        coverUrl: "https://i.scdn.co/image/ab67706f0000000234f8c45ad27b7e8ab0fd9b4c",
        owner: "Spotify",
        tracksCount: 50,
    },
    {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        title: "Today's Top Hits",
        description: "The biggest songs in the world. Updated frequently.",
        coverUrl: "https://i.scdn.co/image/ab67706f0000000232c44f1f56964e6807b87d86",
        owner: "Spotify",
        tracksCount: 50,
    },
    {
        id: "37i9dQZF1DX0XUsuxWHRQd",
        title: "Rock Classics",
        description: "Rock legends & epic songs that continue to inspire.",
        coverUrl: "https://i.scdn.co/image/ab67706f00000002beff729f2ef80e515a69c0f1",
        owner: "Spotify",
        tracksCount: 200,
    },
    {
        id: "37i9dQZF1DX2sUQwD7tbmL",
        title: "Chill Hits",
        description: "Kick back to the best new and recent chill hits.",
        coverUrl: "https://i.scdn.co/image/ab67706f000000024987e5cd24c4ab3aa0990417",
        owner: "Spotify",
        tracksCount: 180,
    },
];

const resolveSpotifyCredentials = () => {
    const clientId =
        process.env.SPOTIFY_CLIENT_ID ?? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Missing Spotify credentials");
    }

    return { clientId, clientSecret };
};

export async function GET() {
    try {
        const { clientId, clientSecret } = resolveSpotifyCredentials();
        console.info("[Spotify API] featured playlists request", {
            clientIdPrefix: clientId.slice(0, 8),
        });

        const tokenResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${clientId}:${clientSecret}`
                    ).toString("base64")}`,
                },
                body: new URLSearchParams({
                    grant_type: "client_credentials",
                }),
            }
        );

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("[Spotify API] token request failed", {
                status: tokenResponse.status,
                error: errorText,
            });
            throw new Error("Failed to get Spotify access token");
        }

        const { access_token } = await tokenResponse.json();

        const playlistsResponse = await fetch(
            "https://api.spotify.com/v1/browse/featured-playlists?limit=10",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        if (!playlistsResponse.ok) {
            const errorText = await playlistsResponse.text();
            console.error("[Spotify API] playlists request failed", {
                status: playlistsResponse.status,
                error: errorText,
            });
            throw new Error("Failed to fetch playlists");
        }

        const data = await playlistsResponse.json();

        const playlists = data.playlists.items.map((playlist: {
            id: string;
            name: string;
            description: string | null;
            images: { url: string }[];
            owner: { display_name: string };
            tracks: { total: number };
        }) => ({
            id: playlist.id,
            title: playlist.name,
            description: playlist.description || "",
            coverUrl:
                playlist.images[0]?.url || "/img/playlist-placeholder.png",
            owner: playlist.owner.display_name,
            tracksCount: playlist.tracks.total,
        }));

        console.info("[Spotify API] featured playlists success", {
            count: playlists.length,
        });
        return NextResponse.json({ playlists });
    } catch (error) {
        console.error("[Spotify API] error fetching featured playlists", error);

        const message =
            error instanceof Error ? error.message : "Failed to fetch Spotify playlists";

        return NextResponse.json(
            {
                playlists: FALLBACK_PLAYLISTS,
                error: message,
            },
            { status: 502 }
        );
    }
}

