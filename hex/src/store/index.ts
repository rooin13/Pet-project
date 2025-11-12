import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/model/slice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { SearchReducer } from "@/features/search";
import modalReducer from "@/features/modal/model/modalSlice";
import { filtersReducer } from "@/features/filtration";
import { uiReducer } from "@/widgets/header";
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