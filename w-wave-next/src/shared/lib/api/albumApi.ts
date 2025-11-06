import { baseApi } from "./baseApi";
import { Album } from "@/entities/album";
import { Track } from "@/entities/track";

// album API endpoints
export const albumApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // get album by id
        getAlbum: builder.query<
            { album: Album; tracks: Track[] },
            string
        >({
            query: (id) => `/album/${id}`,
            providesTags: (result, error, id) => [{ type: "Album", id }],
        }),
    }),
});

export const { useGetAlbumQuery } = albumApi;

