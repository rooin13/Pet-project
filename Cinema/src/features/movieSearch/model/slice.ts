// src/features/movieSearch/model/slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MovieSearchState {
    query: string;
}

const initialState: MovieSearchState = {
    query: "",
};

const movieSearchSlice = createSlice({
    name: "movieSearch",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
    },
});

export const { setQuery } = movieSearchSlice.actions;
export const movieSearchReducer = movieSearchSlice.reducer;
