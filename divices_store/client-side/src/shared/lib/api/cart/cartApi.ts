import { CartResponse } from "../../../../widgets/cart/model/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../common/getBaseUrl";

const getCsrfToken = () => {
    if (typeof document === 'undefined') return null;
    const raw = document.cookie.split('; ').find(c => c.startsWith('next-auth.csrf-token='));
    if (!raw) return null;
    const val = decodeURIComponent(raw.split('=')[1] || '');
    return val.split('|')[0] || null;
};

const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
    const base = fetchBaseQuery({ baseUrl: getBaseUrl(), credentials: "include" });
    return base(args, api, extraOptions);
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
            query: ({ variationId, quantity }) => {
                const csrf = getCsrfToken();
                return {
                    url: "/api/cart/add",
                    method: "POST",
                    body: { variationId, quantity },
                    headers: csrf ? { 'X-CSRF-Token': csrf } : undefined,
                };
            },
            invalidatesTags: ["Cart"],
        }),
        removeItem: builder.mutation<CartResponse, { cartItemId: number }>({
            query: ({ cartItemId }) => {
                const csrf = getCsrfToken();
                return {
                    url: "/api/cart/remove",
                    method: "POST",
                    body: { cartItemId },
                    headers: csrf ? { 'X-CSRF-Token': csrf } : undefined,
                };
            },
            invalidatesTags: ["Cart"],
        }),
        updateQuantity: builder.mutation<CartResponse, { cartItemId: number; quantity: number }>({
            query: ({ cartItemId, quantity }) => {
                const csrf = getCsrfToken();
                return {
                    url: "/api/cart/update",
                    method: "POST",
                    body: { cartItemId, quantity },
                    headers: csrf ? { 'X-CSRF-Token': csrf } : undefined,
                };
            },
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
