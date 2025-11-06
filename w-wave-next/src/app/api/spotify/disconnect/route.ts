import { NextResponse } from "next/server";
import { disconnectSpotify } from "@/shared/lib/spotify/tokens";

/**
 * Отключить Spotify (удалить токены)
 * POST /api/spotify/disconnect
 */
export async function POST() {
    try {
        const success = await disconnectSpotify();

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Failed to disconnect" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Failed to disconnect Spotify:", error);
        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        );
    }
}

