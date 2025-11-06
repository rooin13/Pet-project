import { NextResponse } from "next/server";

// Используем Node.js runtime для поддержки Buffer
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Получить featured плейлисты из Spotify (без авторизации пользователя)
 * Использует Client Credentials Flow
 * GET /api/spotify/featured-playlists
 */
export async function GET() {
    try {
        console.log("🎵 Featured playlists request");
        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error("❌ Missing Spotify credentials");
            console.log("Available env vars:", Object.keys(process.env).filter(k => k.includes('SPOTIFY')));

            // Fallback: возвращаем моковые данные вместо ошибки
            return NextResponse.json({
                playlists: [
                    {
                        id: "1",
                        title: "Today's Top Hits",
                        description: "The hottest tracks right now",
                        coverUrl: "https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc",
                        owner: "Spotify",
                        tracksCount: 50
                    },
                    {
                        id: "2",
                        title: "RapCaviar",
                        description: "New music from Kendrick Lamar, Travis Scott, and more",
                        coverUrl: "https://i.scdn.co/image/ab67706f00000002c0d8e9e4f81bc7ad2aa84c0a",
                        owner: "Spotify",
                        tracksCount: 50
                    },
                    {
                        id: "4",
                        title: "Rock Classics",
                        description: "Rock legends & epic songs",
                        coverUrl: "https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548a424",
                        owner: "Spotify",
                        tracksCount: 200
                    },
                    {
                        id: "5",
                        title: "Chill Hits",
                        description: "Kick back to the best new and recent chill hits",
                        coverUrl: "https://i.scdn.co/image/ab67706f00000002c85cc61cd93dd47ce2f217ca",
                        owner: "Spotify",
                        tracksCount: 180
                    }
                ]
            });
        }

        // Получаем access token через Client Credentials
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
            console.error("❌ Token request failed:", tokenResponse.status, errorText);
            throw new Error("Failed to get Spotify access token");
        }

        const { access_token } = await tokenResponse.json();
        console.log("✅ Got Spotify token");

        // Получаем featured playlists
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
            console.error("❌ Playlists request failed:", playlistsResponse.status, errorText);
            throw new Error("Failed to fetch playlists");
        }

        const data = await playlistsResponse.json();
        console.log("✅ Featured playlists fetched:", data.playlists.items.length);

        // Форматируем под наш формат
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
            coverUrl: playlist.images[0]?.url || "/img/playlist-placeholder.png",
            owner: playlist.owner.display_name,
            tracksCount: playlist.tracks.total,
        }));

        return NextResponse.json({ playlists });
    } catch (error) {
        console.error("Error fetching Spotify playlists:", error);

        // Fallback: возвращаем моковые данные при ошибке
        return NextResponse.json({
            playlists: [
                {
                    id: "1",
                    title: "Today's Top Hits",
                    description: "The hottest tracks right now",
                    coverUrl: "https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc",
                    owner: "Spotify",
                    tracksCount: 50
                },
                {
                    id: "2",
                    title: "RapCaviar",
                    description: "New music from Kendrick Lamar, Travis Scott, and more",
                    coverUrl: "https://i.scdn.co/image/ab67706f00000002c0d8e9e4f81bc7ad2aa84c0a",
                    owner: "Spotify",
                    tracksCount: 50
                },
                {
                    id: "4",
                    title: "Rock Classics",
                    description: "Rock legends & epic songs",
                    coverUrl: "https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548a424",
                    owner: "Spotify",
                    tracksCount: 200
                },
                {
                    id: "5",
                    title: "Chill Hits",
                    description: "Kick back to the best new and recent chill hits",
                    coverUrl: "https://i.scdn.co/image/ab67706f00000002c85cc61cd93dd47ce2f217ca",
                    owner: "Spotify",
                    tracksCount: 180
                }
            ]
        });
    }
}

