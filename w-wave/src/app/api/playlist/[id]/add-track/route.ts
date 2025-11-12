import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

/**
 * Добавить трек в плейлист
 * POST /api/playlist/[id]/add-track
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: playlistId } = await params;

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
        const { trackId, trackData } = body;

        if (!trackId) {
            return NextResponse.json(
                { error: "trackId is required" },
                { status: 400 }
            );
        }

        console.log("🎵 Adding track to playlist:", {
            playlistId,
            trackId,
            trackData
        });

        // Проверяем что плейлист существует и принадлежит пользователю
        const { data: playlist, error: playlistError } = await supabase
            .from("playlists")
            .select("id, user_id")
            .eq("id", playlistId)
            .eq("user_id", user.id)
            .single();

        if (playlistError || !playlist) {
            console.error("❌ Playlist not found:", playlistError);
            return NextResponse.json(
                { error: "Playlist not found or access denied" },
                { status: 403 }
            );
        }

        console.log("✅ Playlist found, user has access");

        // Добавляем трек (сначала пробуем с track_data, если не получится - без него)
        let { error } = await supabase
            .from("playlist_spotify_tracks")
            .upsert({
                playlist_id: playlistId,
                spotify_track_id: trackId,
                track_data: trackData || null
            });

        // Если ошибка связана с track_data, пробуем без него
        if (error && error.message.includes('track_data')) {
            console.log("⚠️ track_data column not found, trying without it...");
            const result = await supabase
                .from("playlist_spotify_tracks")
                .upsert({
                    playlist_id: playlistId,
                    spotify_track_id: trackId
                });
            error = result.error;
        }

        if (error) {
            console.error("❌ Failed to add track:", error);
            return NextResponse.json(
                { error: error.message || "Failed to add track" },
                { status: 400 }
            );
        }

        console.log("✅ Track added successfully");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Exception in add-track:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

