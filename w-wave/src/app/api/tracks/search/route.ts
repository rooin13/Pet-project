import { NextRequest, NextResponse } from "next/server";
import {
    getSpotifyAccessToken,
    searchSpotifyTracks,
} from "@/shared/lib/api/spotify";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        const limit = parseInt(searchParams.get("limit") || "20");

        if (!query) {
            return NextResponse.json(
                { error: "Query parameter is required" },
                { status: 400 }
            );
        }

        // Check Spotify credentials
        const hasSpotifyCredentials =
            !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID &&
            !!process.env.SPOTIFY_CLIENT_SECRET;

        if (!hasSpotifyCredentials) {
            return NextResponse.json(
                { error: "Spotify API credentials not configured" },
                { status: 500 }
            );
        }

        // Use real Spotify API
        console.log("🎵 Using Spotify API");

        // Get Spotify access token
        const accessToken = await getSpotifyAccessToken();

        // Search tracks
        const spotifyTracks = await searchSpotifyTracks(query, accessToken, limit);

        // format response
        const tracks = spotifyTracks.map((track) => {
            try {
                return {
                    id: track.id || "unknown",
                    title: track.name || "Unknown Track",
                    artist: track.artists?.map((a) => a.name).join(", ") || "Unknown Artist",
                    album: track.album?.name || "Unknown Album",
                    coverUrl: track.album?.images?.[0]?.url || "",
                    previewUrl: track.preview_url || null,
                    duration: track.duration_ms || 0,
                };
            } catch (err) {
                console.error("Error formatting track:", track, err);
                return null;
            }
        }).filter(Boolean);

        return NextResponse.json({ tracks });
    } catch (error) {
        console.error("Track search error:", error);
        console.error("Error details:", error instanceof Error ? error.message : error);
        console.error("Stack:", error instanceof Error ? error.stack : "");
        return NextResponse.json(
            {
                error: "Failed to search tracks",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

