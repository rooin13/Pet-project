import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createClient } from "@/shared/lib/supabase/client";

export type TrackIdentifier = {
    trackId: string;
    trackData?: {
        title: string;
        artist: string;
        coverUrl: string;
        duration: number;
        album?: string;
        previewUrl?: string | null;
    };
};
export type PlaylistIdentifier = { playlistId: string };
export type CreatePlaylistInput = { name: string; isPublic: boolean };
export type UpdatePlaylistInput = {
    playlistId: string;
    name?: string;
    isPublic?: boolean;
};
export type AddTrackToPlaylistInput = {
    playlistId: string;
    trackId: string;
    trackData?: {
        title?: string;
        artist?: string;
        coverUrl?: string;
        duration?: number;
        album?: string;
        previewUrl?: string | null;
    } | null;
};
export type Playlist = {
    id: string;
    name: string;
    is_public: boolean;
    created_at: string;
};

export const musicApi = createApi({
    reducerPath: "musicApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Liked", "Playlists", "PlaylistTracks"],
    keepUnusedDataFor: 3600, // Кеш на 1 час
    refetchOnMountOrArgChange: 600, // Refetch только если кеш старше 10 минут
    refetchOnFocus: false,
    refetchOnReconnect: false,
    endpoints: (builder) => ({
        // LIKED TRACKS
        getLikedTracks: builder.query<{
            spotify_track_id: string;
            track_data: {
                title?: string;
                artist?: string;
                artistId?: string;
                album?: string;
                albumId?: string;
                coverUrl?: string;
                duration?: number;
                previewUrl?: string | null;
            } | null;
            created_at: string
        }[], void>({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) return { data: [] };
                    const { data, error } = await supabase
                        .from("liked_spotify_tracks")
                        .select("spotify_track_id, track_data, created_at")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });
                    if (error) throw error;
                    return { data: data ?? [] };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((r) => ({
                            type: "Liked" as const,
                            id: r.spotify_track_id,
                        })),
                        { type: "Liked" as const, id: "LIST" },
                    ]
                    : [{ type: "Liked" as const, id: "LIST" }],
        }),
        isTrackLiked: builder.query<boolean, TrackIdentifier>({
            async queryFn({ trackId }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) return { data: false };
                    const { data, error } = await supabase
                        .from("liked_spotify_tracks")
                        .select("spotify_track_id")
                        .eq("user_id", user.id)
                        .eq("spotify_track_id", trackId)
                        .maybeSingle();
                    if (error) throw error;
                    return { data: !!data };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (_res, _err, arg) => [
                { type: "Liked", id: arg.trackId },
            ],
        }),
        likeTrack: builder.mutation<{ success: true }, TrackIdentifier>({
            async queryFn({ trackId, trackData }) {
                try {
                    console.log("🔥 LIKING TRACK:", trackId, "with data:", trackData);
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");

                    const dataToSave = {
                        user_id: user.id,
                        spotify_track_id: trackId,
                        track_data: trackData || null
                    };

                    console.log("💾 SAVING TO SUPABASE:", dataToSave);

                    const { error } = await supabase
                        .from("liked_spotify_tracks")
                        .upsert(dataToSave);
                    if (error) {
                        console.error("❌ SUPABASE ERROR:", error);
                        throw error;
                    }
                    console.log("✅ SAVED SUCCESSFULLY");
                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            async onQueryStarted({ trackId, trackData }, { dispatch, queryFulfilled }) {
                // Оптимистичное обновление статуса лайка
                const isLikedPatch = dispatch(
                    musicApi.util.updateQueryData('isTrackLiked', { trackId }, () => true)
                );

                // Оптимистичное обновление списка лайков (добавляем трек в список)
                const likedListPatch = dispatch(
                    musicApi.util.updateQueryData('getLikedTracks', undefined, (draft) => {
                        // Проверяем, нет ли уже этого трека
                        const exists = draft.some(t => t.spotify_track_id === trackId);
                        if (!exists && trackData) {
                            draft.unshift({
                                spotify_track_id: trackId,
                                track_data: trackData,
                                created_at: new Date().toISOString(),
                            });
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    isLikedPatch.undo();
                    likedListPatch.undo();
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "Liked", id: arg.trackId },
                { type: "Liked", id: "LIST" },
            ],
        }),
        unlikeTrack: builder.mutation<{ success: true }, TrackIdentifier>({
            async queryFn({ trackId }) {
                try {
                    console.log("🔥 UNLIKING TRACK:", trackId);
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");
                    const { error } = await supabase
                        .from("liked_spotify_tracks")
                        .delete()
                        .eq("user_id", user.id)
                        .eq("spotify_track_id", trackId);
                    if (error) throw error;
                    console.log("✅ UNLIKED SUCCESSFULLY");
                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            async onQueryStarted({ trackId }, { dispatch, queryFulfilled }) {
                // Оптимистичное обновление статуса лайка
                const isLikedPatch = dispatch(
                    musicApi.util.updateQueryData('isTrackLiked', { trackId }, () => false)
                );

                // Оптимистичное обновление списка лайков (удаляем трек из списка)
                const likedListPatch = dispatch(
                    musicApi.util.updateQueryData('getLikedTracks', undefined, (draft) => {
                        const index = draft.findIndex(t => t.spotify_track_id === trackId);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    isLikedPatch.undo();
                    likedListPatch.undo();
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "Liked", id: arg.trackId },
                { type: "Liked", id: "LIST" },
            ],
        }),

        // PLAYLISTS
        getPlaylist: builder.query<{ id: string; name: string; is_public: boolean; created_at: string }, PlaylistIdentifier>({
            async queryFn({ playlistId }) {
                try {
                    const supabase = createClient();
                    const { data, error } = await supabase
                        .from("playlists")
                        .select("id, name, is_public, created_at")
                        .eq("id", playlistId)
                        .single();
                    if (error) throw error;
                    return { data: data! };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (_res, _err, arg) => [{ type: "Playlists", id: arg.playlistId }],
        }),
        getMyPlaylists: builder.query<{ id: string; name: string; is_public: boolean; created_at: string }[], void>({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) return { data: [] };
                    const { data, error } = await supabase
                        .from("playlists")
                        .select("id, name, is_public, created_at")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });
                    if (error) throw error;
                    return { data: data ?? [] };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((p) => ({
                            type: "Playlists" as const,
                            id: p.id,
                        })),
                        { type: "Playlists" as const, id: "LIST" },
                    ]
                    : [{ type: "Playlists" as const, id: "LIST" }],
        }),
        createPlaylist: builder.mutation<{ id: string }, CreatePlaylistInput>({
            async queryFn({ name, isPublic }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");
                    const { data, error } = await supabase
                        .from("playlists")
                        .insert({ name, is_public: isPublic, user_id: user.id })
                        .select("id")
                        .single();
                    if (error) throw error;
                    return { data: { id: data.id } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            invalidatesTags: [{ type: "Playlists", id: "LIST" }],
        }),
        updatePlaylist: builder.mutation<
            { success: true },
            UpdatePlaylistInput
        >({
            async queryFn({ playlistId, ...updates }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");
                    const { error } = await supabase
                        .from("playlists")
                        .update({
                            ...(updates.name !== undefined
                                ? { name: updates.name }
                                : {}),
                            ...(updates.isPublic !== undefined
                                ? { is_public: updates.isPublic }
                                : {}),
                        })
                        .eq("id", playlistId)
                        .eq("user_id", user.id);
                    if (error) throw error;
                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "Playlists", id: arg.playlistId },
                { type: "Playlists", id: "LIST" },
            ],
        }),
        deletePlaylist: builder.mutation<{ success: true }, PlaylistIdentifier>(
            {
                async queryFn({ playlistId }) {
                    try {
                        const supabase = createClient();
                        const {
                            data: { user },
                        } = await supabase.auth.getUser();
                        if (!user) throw new Error("Not authenticated");
                        const { error } = await supabase
                            .from("playlists")
                            .delete()
                            .eq("id", playlistId)
                            .eq("user_id", user.id);
                        if (error) throw error;
                        return { data: { success: true } };
                    } catch (e: unknown) {
                        return { error: e instanceof Error ? e.message : "Unknown error" };
                    }
                },
                invalidatesTags: [{ type: "Playlists", id: "LIST" }],
            }
        ),

        // PLAYLIST TRACKS
        getPlaylistTracks: builder.query<{
            spotify_track_id: string;
            track_data: {
                title?: string;
                artist?: string;
                artistId?: string;
                album?: string;
                albumId?: string;
                coverUrl?: string;
                duration?: number;
                previewUrl?: string | null;
            } | null;
            added_at: string
        }[], PlaylistIdentifier>({
            async queryFn({ playlistId }) {
                try {
                    const supabase = createClient();
                    const { data, error } = await supabase
                        .from("playlist_spotify_tracks")
                        .select("spotify_track_id, track_data, added_at")
                        .eq("playlist_id", playlistId)
                        .order("added_at", { ascending: false });
                    if (error) throw error;
                    return { data: data ?? [] };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (result, _err, arg) =>
                result
                    ? [
                        ...result.map((t) => ({
                            type: "PlaylistTracks" as const,
                            id: `${arg.playlistId}:${t.spotify_track_id}`,
                        })),
                        {
                            type: "PlaylistTracks" as const,
                            id: `${arg.playlistId}:LIST`,
                        },
                    ]
                    : [
                        {
                            type: "PlaylistTracks" as const,
                            id: `${arg.playlistId}:LIST`,
                        },
                    ],
        }),
        addTrackToPlaylist: builder.mutation<
            { success: true },
            AddTrackToPlaylistInput
        >({
            async queryFn({ playlistId, trackId, trackData }) {
                try {
                    console.log("🎵 Adding track via API:", { playlistId, trackId });

                    const response = await fetch(`/api/playlist/${playlistId}/add-track`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ trackId, trackData }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("❌ API error:", errorData);
                        throw new Error(errorData.error || "Failed to add track");
                    }

                    const data = await response.json();
                    console.log("✅ Track added successfully");
                    return { data };
                } catch (e: unknown) {
                    console.error("❌ Exception in addTrackToPlaylist:", e);
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "PlaylistTracks", id: `${arg.playlistId}:LIST` },
            ],
        }),
        removeTrackFromPlaylist: builder.mutation<
            { success: true },
            AddTrackToPlaylistInput
        >({
            async queryFn({ playlistId, trackId }) {
                try {
                    const supabase = createClient();
                    const { error } = await supabase
                        .from("playlist_spotify_tracks")
                        .delete()
                        .eq("playlist_id", playlistId)
                        .eq("spotify_track_id", trackId);
                    if (error) throw error;
                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "PlaylistTracks", id: `${arg.playlistId}:LIST` },
            ],
        }),
    }),
});

export const {
    useGetLikedTracksQuery,
    useIsTrackLikedQuery,
    useLikeTrackMutation,
    useUnlikeTrackMutation,
    useGetPlaylistQuery,
    useGetMyPlaylistsQuery,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetPlaylistTracksQuery,
    useAddTrackToPlaylistMutation,
    useRemoveTrackFromPlaylistMutation,
} = musicApi;

