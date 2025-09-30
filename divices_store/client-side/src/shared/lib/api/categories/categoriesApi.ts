import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category } from "@prisma/client";
import { getBaseUrl } from "../common/getBaseUrl";

export const categoriesApi = createApi({
    reducerPath: "categoriesApi",
    baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => "/categories",
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;
