// shared/api/auth.ts

import {
    postLoginUser,
    postRegisterUser,
    getLogoutUser,
    getUserProfile,
} from "@/shared/lib/api/auth-api/api";


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from "@/store";
import { setUser, clearUser } from "@/features/auth/model/slice";
import { User } from "@/entities/user/model/schema";
import { useEffect } from "react";


export const useAuthUser = () => {
    const dispatch = useAppDispatch();

    const query = useQuery<User, Error>({
        queryKey: ["auth", "me"],
        queryFn: getUserProfile,
        staleTime: 5 * 60 * 1000,

        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setUser(query.data));
        } else if (query.isError) {
            dispatch(clearUser());
        }
    }, [query.data, query.isError, dispatch]);

    return query;
};

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postLoginUser,
        onSuccess: async (_, variables) => {
            await postLoginUser(variables);
            const user = await queryClient.fetchQuery({
                queryKey: ["auth", "me"],
                queryFn: getUserProfile,
            });
            dispatch(setUser(user));
        },
    });
};

// REGISTER
export const useRegister = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postRegisterUser,
        onSuccess: async (_, variables) => {
            await postLoginUser(variables);
            const user = await queryClient.fetchQuery({
                queryKey: ["auth", "me"],
                queryFn: getUserProfile,
            });
            dispatch(setUser(user));
        },
    });
};

// LOGOUT
export const useLogout = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: getLogoutUser,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["auth"] });
            dispatch(clearUser());
            window.location.reload();
        },
    });
};
