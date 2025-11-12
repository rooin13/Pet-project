"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";
import { loginSchema, signupSchema, usernameSchema } from "./schema";
import type {
    LoginFormData,
    SignupFormData,
    UsernameFormData,
} from "./types";
import { useSignInWithPasswordMutation } from "@/shared/lib/api/profileApi";
import { useUpdateUsernameMutation } from "@/shared/lib/api/profileApi";

type LoginHookParams = {
    onSuccess?: () => void;
};

type LoginHookState = {
    error: string;
    isSubmitting: boolean;
};

type LoginHookHandlers = {
    submit: (values: LoginFormData) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
};

export const useLoginForm = (
    params: LoginHookParams = {}
): {
    form: ReturnType<typeof useForm<LoginFormData>>;
    state: LoginHookState;
    handlers: LoginHookHandlers;
} => {
    const { onSuccess } = params;
    const router = useRouter();
    const [error, setError] = useState("");
    const [signIn, { isLoading }] = useSignInWithPasswordMutation();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const submit = useCallback(
        async (values: LoginFormData) => {
            setError("");

            try {
                await signIn(values).unwrap();
                onSuccess?.();
                router.refresh();
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "invalid email or password"
                );
            }
        },
        [onSuccess, router, signIn]
    );

    const signInWithGoogle = useCallback(async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }, []);

    return {
        form,
        state: {
            error,
            isSubmitting: isLoading,
        },
        handlers: {
            submit,
            signInWithGoogle,
        },
    };
};

type SignupHookParams = {
    onSuccess?: () => void;
};

type SignupHookState = {
    error: string;
    successMessage: string;
    isSubmitting: boolean;
};

type SignupHookHandlers = {
    submit: (values: SignupFormData) => Promise<void>;
    signUpWithGoogle: () => Promise<void>;
    resetSuccess: () => void;
};

export const useSignupForm = (
    params: SignupHookParams = {}
): {
    form: ReturnType<typeof useForm<SignupFormData>>;
    state: SignupHookState;
    handlers: SignupHookHandlers;
} => {
    const { onSuccess } = params;
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const submit = useCallback(async (values: SignupFormData) => {
        setSubmitting(true);
        setError("");
        setSuccessMessage("");

        const supabase = createClient();
        const { data: authData, error: authError } =
            await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

        setSubmitting(false);

        if (authError) {
            if (
                authError.message
                    .toLowerCase()
                    .includes("already registered") ||
                authError.message.toLowerCase().includes("already exists") ||
                authError.message.toLowerCase().includes("duplicate")
            ) {
                setError("this email is already registered");
            } else {
                setError(authError.message);
            }
            return;
        }

        if (!authData.user && authData.session === null) {
            setError("this email is already registered");
            return;
        }

        setSuccessMessage(
            "account created. check your email to confirm the account"
        );
        onSuccess?.();
    }, [onSuccess]);

    const signUpWithGoogle = useCallback(async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }, []);

    const resetSuccess = useCallback(() => {
        setSuccessMessage("");
    }, []);

    return {
        form,
        state: {
            error,
            successMessage,
            isSubmitting,
        },
        handlers: {
            submit,
            signUpWithGoogle,
            resetSuccess,
        },
    };
};

type UsernameSetupState = {
    error: string;
    step: "username" | "spotify";
    isCheckingSpotify: boolean;
    isSubmitting: boolean;
};

type UsernameSetupHandlers = {
    submit: (values: UsernameFormData) => Promise<void>;
    connectSpotify: () => void;
    skipSpotify: () => void;
};

export const useUsernameSetup = (
    isOpen: boolean
): {
    form: ReturnType<typeof useForm<UsernameFormData>>;
    state: UsernameSetupState;
    handlers: UsernameSetupHandlers;
} => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [step, setStep] = useState<"username" | "spotify">("username");
    const [isCheckingSpotify, setCheckingSpotify] = useState(false);
    const [updateUsername, { isLoading }] = useUpdateUsernameMutation();

    const form = useForm<UsernameFormData>({
        resolver: zodResolver(usernameSchema),
    });

    const checkSpotifyStatus = useCallback(async () => {
        setCheckingSpotify(true);
        try {
            const response = await fetch("/api/spotify/status");
            const data = await response.json();
            if (data.connected) {
                setStep("username");
            }
        } catch (err) {
            console.error("failed to check spotify status", err);
        } finally {
            setCheckingSpotify(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && step === "username") {
            void checkSpotifyStatus();
        }
    }, [checkSpotifyStatus, isOpen, step]);

    const submit = useCallback(
        async (values: UsernameFormData) => {
            setError("");

            try {
                await updateUsername({ username: values.username }).unwrap();

                const response = await fetch("/api/spotify/status");
                const data = await response.json();

                if (!data.connected) {
                    setStep("spotify");
                } else {
                    router.refresh();
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "failed to set username"
                );
            }
        },
        [router, updateUsername]
    );

    const connectSpotify = useCallback(() => {
        window.location.href = "/api/spotify/auth";
    }, []);

    const skipSpotify = useCallback(() => {
        router.refresh();
    }, [router]);

    const state = useMemo<UsernameSetupState>(() => {
        return {
            error,
            step,
            isCheckingSpotify,
            isSubmitting: isLoading,
        };
    }, [error, isCheckingSpotify, isLoading, step]);

    return {
        form,
        state,
        handlers: {
            submit,
            connectSpotify,
            skipSpotify,
        },
    };
};


