import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/shared/lib/spotify/tokens";
import { createClient } from "@/shared/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Получить Spotify access token для текущего пользователя
 * GET /api/spotify/token
 */
export async function GET() {
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

        const accessToken = await getSpotifyAccessToken(user.id);

        if (!accessToken) {
            return NextResponse.json(
                { error: "Spotify not connected", connected: false },
                { status: 200 }
            );
        }

        return NextResponse.json({ token: accessToken, connected: true });
    } catch (error) {
        console.error("❌ Get Spotify token error:", error);
        return NextResponse.json(
            { error: "Failed to get token", connected: false },
            { status: 500 }
        );
    }
}

