import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Spotify OAuth - редирект на страницу авторизации
 * GET /api/spotify/auth
 */
export async function GET() {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        console.error("❌ Spotify credentials not configured");
        return NextResponse.json(
            { error: "Spotify credentials not configured" },
            { status: 500 }
        );
    }

    const scopes = [
        "user-read-private",
        "user-read-email",
        "user-library-read",
        "user-library-modify",
        "user-top-read",
        "user-read-recently-played",
        "user-read-playback-position",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "playlist-modify-private",
        "streaming",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
    ].join(" ");

    const state = Math.random().toString(36).substring(7);

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scopes,
        state,
        show_dialog: "true",
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params}`;

    return NextResponse.redirect(spotifyAuthUrl);
}

