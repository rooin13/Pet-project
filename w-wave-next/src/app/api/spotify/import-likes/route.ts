import { NextResponse } from "next/server";
import { getSpotifyClient } from "@/shared/lib/spotify/tokens";
import { createClient } from "@/shared/lib/supabase/server";
import { spotifyTrackToTrackData } from "@/shared/lib/spotify/client";

/**
 * Импорт всех лайкнутых треков из Spotify
 * Загружает все треки из твоего реального Spotify аккаунта
 * POST /api/spotify/import-likes
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
                { error: "Spotify not connected. Connect Spotify first!" },
                { status: 403 }
            );
        }

        console.log("🚀 Fetching tracks from Spotify...");

        // Получаем первый батч чтобы узнать total
        const firstBatch = await spotifyClient.getSavedTracks(50, 0);
        const totalTracks = firstBatch.total;

        console.log(`📊 Total liked tracks in Spotify: ${totalTracks}`);

        const allTracks = [...firstBatch.items];
        let offset = 50;

        // Получаем остальные треки (максимум 500 для быстроты)
        const maxTracks = Math.min(totalTracks, 500);
        while (offset < maxTracks) {
            const batch = await spotifyClient.getSavedTracks(50, offset);
            if (batch.items && batch.items.length > 0) {
                allTracks.push(...batch.items);
            }
            offset += 50;
            console.log(`📥 Fetched ${allTracks.length}/${maxTracks}...`);
        }

        console.log(`✅ Fetched ${allTracks.length} tracks from Spotify`);

        // Сохраняем в Supabase параллельно (батчами по 10)
        let imported = 0;
        const batchSize = 10;

        for (let i = 0; i < allTracks.length; i += batchSize) {
            const batch = allTracks.slice(i, i + batchSize);

            const promises = batch.map(async (item) => {
                try {
                    const trackData = spotifyTrackToTrackData(item.track);

                    const { error } = await supabase
                        .from("liked_spotify_tracks")
                        .insert({
                            user_id: user.id,
                            spotify_track_id: item.track.id,
                            track_data: trackData,
                        })
                        .select()
                        .single();

                    // Если трек уже существует - обновляем данные
                    if (error && error.code === "23505") {
                        await supabase
                            .from("liked_spotify_tracks")
                            .update({ track_data: trackData })
                            .eq("user_id", user.id)
                            .eq("spotify_track_id", item.track.id);
                    } else if (error) {
                        throw error;
                    }

                    return true;
                } catch (error) {
                    console.error("Failed to import:", item.track.name, error);
                    return false;
                }
            });

            const results = await Promise.all(promises);
            imported += results.filter(Boolean).length;

            console.log(`💾 Saved ${imported}/${allTracks.length}...`);
        }

        return NextResponse.json({
            success: true,
            message: `Imported ${imported} liked tracks from Spotify`,
            imported,
            total: allTracks.length,
        });
    } catch (error) {
        console.error("Import likes error:", error);
        return NextResponse.json(
            { error: "Failed to import likes" },
            { status: 500 }
        );
    }
}

