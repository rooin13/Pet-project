import { instance } from "../common/instance";
import type { RegisterPayload, RegisterResponse } from "./types";
import { signIn, signOut, useSession } from "next-auth/react";

export const authApi = {
    register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        const { data } = await instance.post<RegisterResponse>("/api/register", payload);
        return data;
    },


    login: async (email: string, password: string) => {
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (res?.error) throw new Error("Wrong email or password");
        return res;
    },

    logout: async () => {
        await signOut({ redirect: false });
    },


    useSession
};
