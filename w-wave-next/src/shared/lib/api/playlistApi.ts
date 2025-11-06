import { baseApi } from "./baseApi";
import { Playlist } from "@/entities/playlist";
import { Track } from "@/entities/track";

// playlist API endpoints
export const playlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // get playlist by id
        getPlaylist: builder.query<
            { playlist: Playlist; tracks: Track[] },
            string
        >({
            query: (id) => `/playlist/${id}`,
            providesTags: (result, error, id) => [{ type: "Playlist", id }],
        }),

        // get featured playlists
        getFeaturedPlaylists: builder.query<{ playlists: Playlist[] }, void>({
            query: () => "/spotify/featured-playlists",
            providesTags: [{ type: "Playlist", id: "FEATURED" }],
        }),

        // create playlist
        createPlaylist: builder.mutation<
            { playlist: Playlist },
            { title: string; description?: string; isPublic: boolean }
        >({
            query: (body) => ({
                url: "/playlist/create",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Playlist", id: "LIST" }],
        }),

        // add track to playlist
        addTrackToPlaylist: builder.mutation<
            void,
            { playlistId: string; trackId: string }
        >({
            query: ({ playlistId, trackId }) => ({
                url: `/playlist/${playlistId}/add-track`,
                method: "POST",
                body: { trackId },
            }),
            invalidatesTags: (result, error, { playlistId }) => [
                { type: "Playlist", id: playlistId },
            ],
        }),
    }),
});

export const {
    useGetPlaylistQuery,
    useGetFeaturedPlaylistsQuery,
    useCreatePlaylistMutation,
    useAddTrackToPlaylistMutation,
} = playlistApi;

