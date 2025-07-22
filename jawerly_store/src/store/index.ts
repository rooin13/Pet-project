import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/entities/user/model/slice";
import { authReducer } from "@/features/auth/model/slice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { movieSearchReducer } from "@/features/movie-search/model/slice";



export const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        movieSearch: movieSearchReducer,

    },
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;