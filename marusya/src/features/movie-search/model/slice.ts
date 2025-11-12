import type { IMovie } from "@/entities/movie";
import { getMovieByTitle } from "@/shared/lib/api/moviesApi";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MovieSearchState {
    query: string;
}

const initialState: MovieSearchState = {
    query: "",
};

export const getMoviesThunk = createAsyncThunk(
    "movieSearch/getMovies",
    async (data: string, thunkAPI) => {
        try {
            const res = await getMovieByTitle(data);
            return res;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Error fetching movies");
        }
    }
);

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

