// src/entities/user/model/slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./Chema";




const initialState: User = {
    name: '',
    email: '',
    password: '',
    surname: '',
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            return action.payload;
        },
        clearUser() {

            return initialState;
        },
    },
});


export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
