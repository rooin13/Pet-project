import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createClient } from "@/shared/lib/supabase/client";

export const playlistTracksApi = createApi({
    reducerPath: "playlistTracksApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["PlaylistTracks"],
    keepUnusedDataFor: 3600, // Кеш на 1 час
    refetchOnMountOrArgChange: 600, // Refetch только если кеш старше 10 минут
    refetchOnFocus: false,
    refetchOnReconnect: false,
    endpoints: (builder) => ({
        // check if track is in playlist
        isTrackInPlaylist: builder.query<
            boolean,
            { playlistId: string; trackId: string }
        >({
            async queryFn({ playlistId, trackId }) {
                try {
                    const supabase = createClient();
                    const { data, error } = await supabase
                        .from("playlist_spotify_tracks")
                        .select("spotify_track_id")
                        .eq("playlist_id", playlistId)
                        .eq("spotify_track_id", trackId)
                        .single();
                    if (error && error.code !== "PGRST116") throw error;
                    return { data: !!data };
                } catch (e: unknown) {
                    return {
                        error: e instanceof Error ? e.message : "Unknown error",
                    };
                }
            },
            providesTags: (_res, _err, arg) => [
                {
                    type: "PlaylistTracks",
                    id: `${arg.playlistId}:${arg.trackId}`,
                },
            ],
        }),
    }),
});

export const { useIsTrackInPlaylistQuery } = playlistTracksApi;

