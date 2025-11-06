import { NextResponse } from "next/server";
import { getSpotifyClient } from "@/shared/lib/spotify/tokens";
import { createClient } from "@/shared/lib/supabase/server";
import { spotifyTrackToTrackData } from "@/shared/lib/spotify/client";

/**
 * Синхронизация лайкнутых треков из Spotify
 * Получает реальные данные треков и сохраняет в Supabase
 * POST /api/spotify/sync-likes
 */
export async function POST() {
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

        // Получаем Spotify client
        const spotifyClient = await getSpotifyClient(user.id);

        if (!spotifyClient) {
            return NextResponse.json(
                { error: "Spotify not connected" },
                { status: 403 }
            );
        }

        // Получаем все лайкнутые треки из Supabase
        const { data: likedTracks, error: fetchError } = await supabase
            .from("liked_spotify_tracks")
            .select("spotify_track_id, track_data")
            .eq("user_id", user.id);

        if (fetchError) {
            throw fetchError;
        }

        if (!likedTracks || likedTracks.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No liked tracks to sync",
                updated: 0,
            });
        }

        // Фильтруем треки без track_data
        const tracksToUpdate = likedTracks.filter((t) => !t.track_data);

        if (tracksToUpdate.length === 0) {
            return NextResponse.json({
                success: true,
                message: "All tracks already have data",
                updated: 0,
            });
        }

        // Получаем данные треков из Spotify (макс 50 за раз)
        let updated = 0;
        for (let i = 0; i < tracksToUpdate.length; i += 50) {
            const batch = tracksToUpdate.slice(i, i + 50);
            const trackIds = batch.map((t) => t.spotify_track_id);

            try {
                const { tracks } = await spotifyClient.getTracks(trackIds);

                // Обновляем track_data в Supabase
                for (const track of tracks) {
                    if (!track) continue;

                    const trackData = spotifyTrackToTrackData(track);

                    await supabase
                        .from("liked_spotify_tracks")
                        .update({ track_data: trackData })
                        .eq("user_id", user.id)
                        .eq("spotify_track_id", track.id);

                    updated++;
                }
            } catch (error) {
                console.error("Failed to sync batch:", error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${updated} tracks`,
            updated,
        });
    } catch (error) {
        console.error("Sync likes error:", error);
        return NextResponse.json(
            { error: "Failed to sync likes" },
            { status: 500 }
        );
    }
}

