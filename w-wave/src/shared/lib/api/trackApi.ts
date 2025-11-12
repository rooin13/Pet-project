import { baseApi } from "./baseApi";
import { Track } from "@/entities/track";

// track API endpoints
export const trackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // search tracks
        searchTracks: builder.query<{ tracks: Track[] }, string>({
            query: (q) => `/tracks/search?q=${encodeURIComponent(q)}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.tracks.map(({ id }) => ({
                            type: "Track" as const,
                            id,
                        })),
                        { type: "Track", id: "SEARCH" },
                    ]
                    : [{ type: "Track", id: "SEARCH" }],
        }),

        // get liked tracks
        getLikedTracks: builder.query<{ tracks: Track[] }, void>({
            query: () => "/spotify/liked-tracks",
            providesTags: [{ type: "LikedTracks", id: "LIST" }],
        }),

        // toggle like track
        toggleLikeTrack: builder.mutation<void, { trackId: string; isLiked: boolean }>({
            query: ({ trackId, isLiked }) => ({
                url: isLiked ? "/spotify/unlike-track" : "/spotify/like-track",
                method: "POST",
                body: { trackId },
            }),
            invalidatesTags: [{ type: "LikedTracks", id: "LIST" }],
        }),
    }),
});

export const {
    useSearchTracksQuery,
    useGetLikedTracksQuery,
    useToggleLikeTrackMutation,
} = trackApi;

