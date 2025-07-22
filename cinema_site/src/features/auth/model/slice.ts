import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLogoutUser, getUserProfile, postLoginUser, postRegisterUser } from "@/shared/lib/api/authApi/api";
import { LoginDataType, RegisterDataType } from "./types";
import { User } from "@/entities/user/model/Chema";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const getUserThunk = createAsyncThunk(
    "auth/user",
    async (_, thunkAPI) => {
        try {
            const res = await getUserProfile();
            if (res) {
                thunkAPI.dispatch(loginSuccess())
                return res
            }

        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Ошибка");
        }
    }
);


export const registerThunk = createAsyncThunk<
    any,
    RegisterDataType,
    { rejectValue: number }
>(
    "auth/register",
    async (data: RegisterDataType, thunkAPI) => {
        try {
            const res = await postRegisterUser(data);
            if (res) {
                thunkAPI.dispatch(loginSuccess())
                await postLoginUser(data);
            }
            return res;

        } catch (e: any) {
            if (e.response.status > 500) {
                console.log("ошибка сервера")

            } if (e.response.status === 409) {
                return thunkAPI.rejectWithValue(409);
            }
        }
    }
);


export const loginThunk = createAsyncThunk<
    any,
    LoginDataType,
    { rejectValue: number }
>(
    'auth/login',
    async (data: LoginDataType, thunkAPI) => {
        try {
            const response = await postLoginUser(data);
            return response;
        } catch (e: any) {
            if (e.response.status > 500) {
                console.log("ошибка сервера")

            } if (e.response.status === 400) {
                return thunkAPI.rejectWithValue(400);
            }
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            await getLogoutUser()
            thunkAPI.dispatch(authSlice.actions.logout());
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Ошибка выхода");
        }
    }

);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state) => {
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loginThunk.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload !== undefined ? String(action.payload) : null;

            })
            .addCase(registerThunk.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, state => {
                state.isLoading = false;
                state.isAuthenticated = true;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = action.payload !== undefined ? String(action.payload) : null;
            })
            .addCase(getUserThunk.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserThunk.fulfilled, state => {
                state.isLoading = false;

            })
            .addCase(getUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

    },
});

export const authReducer = authSlice.reducer;
export const { loginSuccess, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;


