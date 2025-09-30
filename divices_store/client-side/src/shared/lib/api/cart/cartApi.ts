import { CartResponse } from "../../../../widgets/cart/model/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../common/getBaseUrl";

const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
    const result = await fetchBaseQuery({ baseUrl: getBaseUrl(), credentials: "include" })(args, api, extraOptions);
    return result;
};

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: baseQueryWithLogging,
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        getCart: builder.query<CartResponse, void>({
            query: () => "/api/cart",
            providesTags: ["Cart"],
        }),
        addItem: builder.mutation<CartResponse, { variationId: number; quantity: number }>({
            query: ({ variationId, quantity }) => ({
                url: "/api/cart/add",
                method: "POST",
                body: { variationId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),
        removeItem: builder.mutation<CartResponse, { cartItemId: number }>({
            query: ({ cartItemId }) => ({
                url: "/api/cart/remove",
                method: "POST",
                body: { cartItemId },
            }),
            invalidatesTags: ["Cart"],
        }),
        updateQuantity: builder.mutation<CartResponse, { cartItemId: number; quantity: number }>({
            query: ({ cartItemId, quantity }) => ({
                url: "/api/cart/update",
                method: "POST",
                body: { cartItemId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddItemMutation,
    useRemoveItemMutation,
    useUpdateQuantityMutation,
} = cartApi;
