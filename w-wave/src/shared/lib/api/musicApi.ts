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
export type PlaylistLibraryData = {
    title?: string;
    description?: string;
    coverUrl?: string;
    owner?: string;
    tracksCount?: number;
    source?: "spotify" | "local";
};
export type PlaylistLikeIdentifier = {
    playlistId: string;
    playlistData?: PlaylistLibraryData | null;
};
export type AlbumLibraryData = {
    title?: string;
    artist?: string;
    artistId?: string;
    coverUrl?: string;
    releaseYear?: number;
    totalTracks?: number;
    source?: "spotify" | "local";
};
export type AlbumLikeIdentifier = {
    albumId: string;
    albumData?: AlbumLibraryData | null;
};
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
    tagTypes: [
        "Liked",
        "Playlists",
        "PlaylistTracks",
        "PlaylistLikes",
        "AlbumLikes",
    ],
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

        // PLAYLIST LIKES
        getLikedPlaylists: builder.query<
            {
                spotify_playlist_id: string;
                playlist_data: PlaylistLibraryData | null;
                created_at: string;
            }[],
            void
        >({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) {
                        return { data: [] };
                    }

                    const { data, error } = await supabase
                        .from("liked_spotify_playlists")
                        .select("spotify_playlist_id, playlist_data, created_at")
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
                        ...result.map((item) => ({
                            type: "PlaylistLikes" as const,
                            id: item.spotify_playlist_id,
                        })),
                        { type: "PlaylistLikes" as const, id: "LIST" },
                    ]
                    : [{ type: "PlaylistLikes" as const, id: "LIST" }],
        }),
        isPlaylistLiked: builder.query<boolean, PlaylistIdentifier>({
            async queryFn({ playlistId }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) return { data: false };

                    const { data, error } = await supabase
                        .from("liked_spotify_playlists")
                        .select("spotify_playlist_id")
                        .eq("user_id", user.id)
                        .eq("spotify_playlist_id", playlistId)
                        .maybeSingle();

                    if (error) throw error;
                    return { data: !!data };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (_res, _err, arg) => [
                { type: "PlaylistLikes", id: arg.playlistId },
            ],
        }),
        likePlaylist: builder.mutation<{ success: true }, PlaylistLikeIdentifier>({
            async queryFn({ playlistId, playlistData }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");

                    const { error } = await supabase
                        .from("liked_spotify_playlists")
                        .upsert({
                            user_id: user.id,
                            spotify_playlist_id: playlistId,
                            playlist_data: playlistData ?? null,
                        });

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            async onQueryStarted({ playlistId, playlistData }, { dispatch, queryFulfilled }) {
                const likePatch = dispatch(
                    musicApi.util.updateQueryData(
                        "isPlaylistLiked",
                        { playlistId },
                        () => true
                    )
                );

                const listPatch = dispatch(
                    musicApi.util.updateQueryData(
                        "getLikedPlaylists",
                        undefined,
                        (draft) => {
                            const exists = draft.some(
                                (item) => item.spotify_playlist_id === playlistId
                            );

                            if (!exists) {
                                draft.unshift({
                                    spotify_playlist_id: playlistId,
                                    playlist_data: playlistData ?? null,
                                    created_at: new Date().toISOString(),
                                });
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    likePatch.undo();
                    listPatch.undo();
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "PlaylistLikes", id: arg.playlistId },
                { type: "PlaylistLikes", id: "LIST" },
            ],
        }),
        unlikePlaylist: builder.mutation<{ success: true }, PlaylistIdentifier>({
            async queryFn({ playlistId }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");

                    const { error } = await supabase
                        .from("liked_spotify_playlists")
                        .delete()
                        .eq("user_id", user.id)
                        .eq("spotify_playlist_id", playlistId);

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            async onQueryStarted({ playlistId }, { dispatch, queryFulfilled }) {
                const likePatch = dispatch(
                    musicApi.util.updateQueryData(
                        "isPlaylistLiked",
                        { playlistId },
                        () => false
                    )
                );

                const listPatch = dispatch(
                    musicApi.util.updateQueryData(
                        "getLikedPlaylists",
                        undefined,
                        (draft) => {
                            const index = draft.findIndex(
                                (item) => item.spotify_playlist_id === playlistId
                            );
                            if (index !== -1) {
                                draft.splice(index, 1);
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    likePatch.undo();
                    listPatch.undo();
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "PlaylistLikes", id: arg.playlistId },
                { type: "PlaylistLikes", id: "LIST" },
            ],
        }),

        // ALBUM LIKES
        getLikedAlbums: builder.query<
            {
                spotify_album_id: string;
                album_data: AlbumLibraryData | null;
                created_at: string;
            }[],
            void
        >({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) return { data: [] };

                    const { data, error } = await supabase
                        .from("liked_spotify_albums")
                        .select("spotify_album_id, album_data, created_at")
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
                        ...result.map((item) => ({
                            type: "AlbumLikes" as const,
                            id: item.spotify_album_id,
                        })),
                        { type: "AlbumLikes" as const, id: "LIST" },
                    ]
                    : [{ type: "AlbumLikes" as const, id: "LIST" }],
        }),
        isAlbumLiked: builder.query<boolean, { albumId: string }>({
            async queryFn({ albumId }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) return { data: false };

                    const { data, error } = await supabase
                        .from("liked_spotify_albums")
                        .select("spotify_album_id")
                        .eq("user_id", user.id)
                        .eq("spotify_album_id", albumId)
                        .maybeSingle();

                    if (error) throw error;

                    return { data: !!data };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            providesTags: (_res, _err, arg) => [
                { type: "AlbumLikes", id: arg.albumId },
            ],
        }),
        likeAlbum: builder.mutation<{ success: true }, AlbumLikeIdentifier>({
            async queryFn({ albumId, albumData }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");

                    const { error } = await supabase
                        .from("liked_spotify_albums")
                        .upsert({
                            user_id: user.id,
                            spotify_album_id: albumId,
                            album_data: albumData ?? null,
                        });

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            async onQueryStarted({ albumId, albumData }, { dispatch, queryFulfilled }) {
                const likePatch = dispatch(
                    musicApi.util.updateQueryData(
                        "isAlbumLiked",
                        { albumId },
                        () => true
                    )
                );

                const listPatch = dispatch(
                    musicApi.util.updateQueryData(
                        "getLikedAlbums",
                        undefined,
                        (draft) => {
                            const exists = draft.some(
                                (item) => item.spotify_album_id === albumId
                            );
                            if (!exists) {
                                draft.unshift({
                                    spotify_album_id: albumId,
                                    album_data: albumData ?? null,
                                    created_at: new Date().toISOString(),
                                });
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    likePatch.undo();
                    listPatch.undo();
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "AlbumLikes", id: arg.albumId },
                { type: "AlbumLikes", id: "LIST" },
            ],
        }),
        unlikeAlbum: builder.mutation<{ success: true }, { albumId: string }>({
            async queryFn({ albumId }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();
                    if (!user) throw new Error("Not authenticated");

                    const { error } = await supabase
                        .from("liked_spotify_albums")
                        .delete()
                        .eq("user_id", user.id)
                        .eq("spotify_album_id", albumId);

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (e: unknown) {
                    return { error: e instanceof Error ? e.message : "Unknown error" };
                }
            },
            async onQueryStarted({ albumId }, { dispatch, queryFulfilled }) {
                const likePatch = dispatch(
                    musicApi.util.updateQueryData(
                        "isAlbumLiked",
                        { albumId },
                        () => false
                    )
                );

                const listPatch = dispatch(
                    musicApi.util.updateQueryData(
                        "getLikedAlbums",
                        undefined,
                        (draft) => {
                            const index = draft.findIndex(
                                (item) => item.spotify_album_id === albumId
                            );
                            if (index !== -1) {
                                draft.splice(index, 1);
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    likePatch.undo();
                    listPatch.undo();
                }
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "AlbumLikes", id: arg.albumId },
                { type: "AlbumLikes", id: "LIST" },
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
    useGetLikedPlaylistsQuery,
    useIsPlaylistLikedQuery,
    useLikePlaylistMutation,
    useUnlikePlaylistMutation,
    useGetLikedAlbumsQuery,
    useIsAlbumLikedQuery,
    useLikeAlbumMutation,
    useUnlikeAlbumMutation,
    useGetPlaylistQuery,
    useGetMyPlaylistsQuery,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetPlaylistTracksQuery,
    useAddTrackToPlaylistMutation,
    useRemoveTrackFromPlaylistMutation,
} = musicApi;

