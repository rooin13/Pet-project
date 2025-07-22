import { api } from "@/shared/lib/api/api";
import { LoginDataType, RegisterDataType } from "@/features/auth/model/types";
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

export const getUserProfile = async () => {
    try {
        const response = await api.get("/profile");
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            // Например, можно отправить logout или просто прокинуть дальше
            console.warn("Unauthorized: Пользователь не авторизован");
            getLogoutUser()
        }
    }
};
