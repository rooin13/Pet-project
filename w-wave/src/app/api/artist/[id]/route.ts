import { NextRequest, NextResponse } from "next/server";
import { getSpotifyClient } from "@/shared/lib/spotify/tokens";

/**
 * Получить информацию об артисте и его топ треки
 * GET /api/artist/[id]
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

        // Получаем информацию об артисте, топ треки и альбомы параллельно
        const [artistData, topTracksData, albumsData] = await Promise.all([
            spotifyClient.getArtist(id),
            spotifyClient.getArtistTopTracks(id),
            spotifyClient.getArtistAlbums(id),
        ]);

        const artist = {
            id: artistData.id,
            name: artistData.name,
            imageUrl: artistData.images[0]?.url || "",
            genres: artistData.genres,
            popularity: artistData.popularity,
            followers: artistData.followers.total,
        };

        const topTracks = topTracksData.tracks.map((t) => ({
            id: t.id,
            title: t.name,
            artist: t.artists.map((a) => a.name).join(", "),
            artistId: t.artists[0]?.id,
            album: t.album.name,
            albumId: t.album.id,
            coverUrl: t.album.images[0]?.url || "",
            previewUrl: t.preview_url,
            duration: t.duration_ms,
            popularity: t.popularity || 0,
        }));

        const albums = albumsData.items.map((a) => ({
            id: a.id,
            name: a.name,
            imageUrl: a.images[0]?.url || "",
            releaseDate: a.release_date,
            totalTracks: a.total_tracks,
        }));

        return NextResponse.json({
            artist,
            topTracks,
            albums,
        });
    } catch (error) {
        console.error("Artist API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch artist data" },
            { status: 500 }
        );
    }
}

