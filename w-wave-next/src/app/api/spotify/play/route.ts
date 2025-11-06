import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/shared/lib/spotify/tokens";
import { createClient } from "@/shared/lib/supabase/server";

/**
 * Воспроизвести трек через Spotify API
 * POST /api/spotify/play
 * Body: { trackUri: string, deviceId: string }
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { trackUri, deviceId } = body;

        if (!trackUri || !deviceId) {
            return NextResponse.json(
                { error: "trackUri and deviceId are required" },
                { status: 400 }
            );
        }

        // Получаем access token пользователя
        const accessToken = await getSpotifyAccessToken(user.id);

        if (!accessToken) {
            return NextResponse.json(
                { error: "Spotify not connected" },
                { status: 403 }
            );
        }

        // Воспроизводим через Spotify API
        const response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uris: [trackUri],
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.error?.message || "Failed to play track" },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Play track error:", error);
        return NextResponse.json(
            { error: "Failed to play track" },
            { status: 500 }
        );
    }
}

