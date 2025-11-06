import { NextRequest, NextResponse } from "next/server";
import { getSpotifyClient } from "@/shared/lib/spotify/tokens";

/**
 * Получить информацию об альбоме и его треки
 * GET /api/album/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const spotifyClient = await getSpotifyClient();

        if (!spotifyClient) {
            return NextResponse.json(
                { error: "Spotify not connected" },
                { status: 403 }
            );
        }

        const albumData = await spotifyClient.getAlbum(id);

        const album = {
            id: albumData.id,
            name: albumData.name,
            imageUrl: albumData.images[0]?.url || "",
            releaseDate: albumData.release_date,
            totalTracks: albumData.total_tracks,
            artists: albumData.artists.map((a) => ({
                id: a.id,
                name: a.name,
            })),
        };

        const tracks = albumData.tracks.items.map((t, index) => ({
            id: t.id,
            title: t.name,
            trackNumber: index + 1,
            artist: t.artists.map((a) => a.name).join(", "),
            artistId: t.artists[0]?.id,
            album: albumData.name,
            albumId: albumData.id,
            coverUrl: albumData.images[0]?.url || "",
            previewUrl: t.preview_url,
            duration: t.duration_ms,
            popularity: t.popularity || 0,
        }));

        return NextResponse.json({
            album,
            tracks,
        });
    } catch (error) {
        console.error("Album API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch album data" },
            { status: 500 }
        );
    }
}

