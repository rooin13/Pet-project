import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/shared/lib/spotify/tokens";
import { createClient } from "@/shared/lib/supabase/server";

/**
 * Получить Spotify access token для текущего пользователя
 * GET /api/spotify/token
 */
export async function GET() {
    try {
        console.log("🎫 GET /api/spotify/token - Fetching token...");
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.log("❌ No authenticated user");
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        console.log("👤 User ID:", user.id);
        const accessToken = await getSpotifyAccessToken(user.id);

        if (!accessToken) {
            console.log("⚠️ No Spotify access token for user:", user.id);
            return NextResponse.json(
                { error: "Spotify not connected", connected: false },
                { status: 200 }
            );
        }

        console.log("✅ Token retrieved successfully, length:", accessToken.length);
        return NextResponse.json({ token: accessToken, connected: true });
    } catch (error) {
        console.error("❌ Get Spotify token error:", error);
        return NextResponse.json(
            { error: "Failed to get token", connected: false },
            { status: 500 }
        );
    }
}

