import { baseApi } from "./baseApi";
import { Artist } from "@/entities/artist";
import { Track } from "@/entities/track";
import { Album } from "@/entities/album";

// artist API endpoints
export const artistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // get artist by id
        getArtist: builder.query<
            { artist: Artist; topTracks: Track[]; albums: Album[] },
            string
        >({
            query: (id) => `/artist/${id}`,
            providesTags: (result, error, id) => [{ type: "Artist", id }],
        }),
    }),
});

export const { useGetArtistQuery } = artistApi;

