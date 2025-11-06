import { NextResponse } from "next/server";
import { isSpotifyConnected } from "@/shared/lib/spotify/tokens";

/**
 * Проверить подключен ли Spotify у пользователя
 * GET /api/spotify/status
 */
export async function GET() {
    try {
        const connected = await isSpotifyConnected();
        return NextResponse.json({ connected });
    } catch (error) {
        console.error("Failed to check Spotify status:", error);
        return NextResponse.json({ connected: false }, { status: 500 });
    }
}

