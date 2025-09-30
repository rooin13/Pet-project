// src/features/movieSearch/model/slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

interface SearchState {
    query: string;
}

const initialState: SearchState = {
    query: "",
};


export const getsThunk = createAsyncThunk(
    "Search/get",
    async (data: string, thunkAPI) => {
        try {


        } catch (e) {
            if (isAxiosError(e)) {
                return thunkAPI.rejectWithValue(e.response?.data?.message || "Ошибка от сервера");
            }

            return thunkAPI.rejectWithValue("Неизвестная ошибка");
        }
    }
);

const SearchSlice = createSlice({
    name: "Search",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
    },
});

export const { setQuery } = SearchSlice.actions;
export const SearchReducer = SearchSlice.reducer;
