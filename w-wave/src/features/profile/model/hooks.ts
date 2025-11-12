"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/features/auth/model/schema";
import type { UsernameFormData } from "@/features/auth/model/types";
import {
    useGetProfileQuery,
    useUpdateUsernameMutation,
} from "@/shared/lib/api/profileApi";

type ProfileEditorStatus = {
    error: string;
    isSuccess: boolean;
};

type ProfileEditorState = {
    userEmail: string | null | undefined;
    displayName: string | null | undefined;
    initial: string;
    isProfileLoading: boolean;
    isUpdating: boolean;
    status: ProfileEditorStatus;
};

type ProfileEditorHandlers = {
    submit: (values: UsernameFormData) => Promise<void>;
};

type ProfileEditorHook = {
    state: ProfileEditorState;
    form: ReturnType<typeof useForm<UsernameFormData>>;
    handlers: ProfileEditorHandlers;
};

const SUCCESS_TIMEOUT_MS = 3000;

export const useProfileEditor = (): ProfileEditorHook => {
    const { data, isLoading: isProfileLoading } = useGetProfileQuery();
    const [updateUsername, { isLoading: isUpdating }] =
        useUpdateUsernameMutation();

    const [status, setStatus] = useState<ProfileEditorStatus>({
        error: "",
        isSuccess: false,
    });
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const form = useForm<UsernameFormData>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: "",
        },
    });

    const profile = data?.profile;
    const user = data?.user;

    useEffect(() => {
        if (profile?.username) {
            form.reset({ username: profile.username });
        }
    }, [form, profile?.username]);

    useEffect(() => {
        return () => {
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    const submit = useCallback(
        async (values: UsernameFormData) => {
            setStatus({ error: "", isSuccess: false });

            try {
                await updateUsername({ username: values.username }).unwrap();
                setStatus({ error: "", isSuccess: true });
                if (successTimeoutRef.current) {
                    clearTimeout(successTimeoutRef.current);
                }
                successTimeoutRef.current = setTimeout(() => {
                    setStatus({ error: "", isSuccess: false });
                }, SUCCESS_TIMEOUT_MS);
            } catch (error: unknown) {
                setStatus({
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to update username",
                    isSuccess: false,
                });
            }
        },
        [updateUsername]
    );

    const state = useMemo<ProfileEditorState>(() => {
        const email = user?.email ?? null;
        const displayName = profile?.username ?? null;
        const initial =
            displayName?.[0]?.toUpperCase() ||
            email?.[0]?.toUpperCase() ||
            "U";

        return {
            userEmail: email,
            displayName,
            initial,
            isProfileLoading,
            isUpdating,
            status,
        };
    }, [isProfileLoading, isUpdating, profile?.username, status, user?.email]);

    return {
        state,
        form,
        handlers: {
            submit,
        },
    };
};


