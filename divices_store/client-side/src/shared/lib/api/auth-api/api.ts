import { api } from "@/shared/lib/api/api";
import { LoginDataType, RegisterDataType } from "@/features/auth/model/types";
import { User } from "@/entities/user/model/schema";
import { isAxiosError } from "axios";
export const postRegisterUser = async (data: RegisterDataType) => {
    const response = await api.post("/user", data);
    if (response.status === 400) {
        throw new Error("Registration failed");
    }
    return response.data;
};

export const postLoginUser = async (data: LoginDataType) => {
    const response = await api.post("/auth/login", data);
    if (response.status === 400) {
        throw new Error("Login failed");
    }
    return response.data;
};

export const getLogoutUser = async () => {
    const response = await api.get("/auth/logout");
    if (response.status === 400) {
        throw new Error("Logout failed");
    }
    return response.data;

}


export const getLoginUser = async () => {
    const response = await api.get("/profile");
    if (response.status === 400) {
        throw new Error("Login failed");
    }
    return response.data;
}
export const getUserProfile = async (): Promise<User> => {
    try {
        const response = await api.get<User>("/profile");
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized: Пользователь не авторизован");
                await getLogoutUser();
                throw new Error("Unauthorized");
            }
        }

        throw error instanceof Error ? error : new Error("Unknown error");
    }
};