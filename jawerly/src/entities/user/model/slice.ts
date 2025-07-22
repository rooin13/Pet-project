import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./schema";
import { getUserProfile } from "@/shared/lib/api/auth-api/api";
import { RootState, useAppSelector } from "@/store";

const initialState: User = {
    name: '',
    surname: '',
    email: '',
    favorites: [],
};

export const getUserProfileThunk = createAsyncThunk(
    "user/fetch",
    async (_, thunkAPI) => {
        try {
            const res = await getUserProfile();
            if (res) {
                thunkAPI.dispatch(setUser(res));
            }
            return res;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Ошибка");
        }
    }
);



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
export default userSlice.reducer;
export const selectUser = ((state: RootState) => state.user);