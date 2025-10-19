import { CartResponse } from "../../../../widgets/cart/model/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../common/getBaseUrl";

const getCsrfToken = () => {
    if (typeof document === 'undefined') return null;
    const own = document.cookie.split('; ').find(c => c.startsWith('csrf-token='));
    if (own) return decodeURIComponent(own.split('=')[1] || '');
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
        addItem: builder.mutation<CartResponse, {
            variationId: number;
            quantity: number;
            // Для оптимистичного UI - опциональные данные
            optimisticData?: {
                variation: any;
                product: any;
            };
        }>({
            query: ({ variationId, quantity }) => {
                const csrf = getCsrfToken();
                return {
                    url: "/api/cart/add",
                    method: "POST",
                    body: { variationId, quantity },
                    headers: csrf ? { 'X-CSRF-Token': csrf } : undefined,
                };
            },
            // Оптимистичное обновление кэша
            async onQueryStarted({ variationId, quantity, optimisticData }, { dispatch, queryFulfilled }) {
                if (!optimisticData) {
                    // Если нет данных для оптимистичного UI - просто ждем ответа
                    return;
                }

                // Оптимистично обновляем кэш корзины
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        // Ищем, есть ли уже такой item в корзине
                        const existingItem = draft.items.find(
                            item => item.variation.id === variationId
                        );

                        if (existingItem) {
                            // Увеличиваем quantity
                            existingItem.quantity += quantity;
                        } else {
                            // Добавляем новый item
                            const newItem = {
                                id: Date.now(), // временный ID
                                quantity,
                                variation: {
                                    ...optimisticData.variation,
                                    product: optimisticData.product,
                                },
                            };
                            draft.items.push(newItem);
                        }
                    })
                );

                try {
                    // Ждем ответа от сервера
                    await queryFulfilled;
                    // Если успешно - кэш уже обновлен оптимистично, сервер подтвердит
                } catch {
                    // Если ошибка - откатываем изменения
                    patchResult.undo();
                }
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
