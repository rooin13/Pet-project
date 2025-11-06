import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

// централизованная обработка ошибок для RTK Query (15%)
const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: "/api",
        credentials: "include",
    });

    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        // логирование ошибки
        console.error("API Error:", {
            endpoint: typeof args === "string" ? args : args.url,
            status: result.error.status,
            data: result.error.data,
        });

        // можно добавить toast notifications здесь
        // или dispatch события для глобального error boundary
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Track", "Album", "Artist", "Playlist", "User", "Profile", "LikedTracks"],
    endpoints: () => ({}),
});

