import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/model/slice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { SearchReducer } from "@/features/search/model/slice";
import modalReducer from "@/features/modal/model/modalSlice";
import filtersReducer from "@/features/filtration/model/slice";
import uiReducer from "@/widgets/header/model/slice";
import { cartApi } from "@/shared/lib/api/cart/cartApi";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        Search: SearchReducer,
        modal: modalReducer,
        filters: filtersReducer,
        ui: uiReducer,
        [cartApi.reducerPath]: cartApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartApi.middleware),

    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;