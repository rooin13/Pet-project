"use client";

import { useCallback, useMemo, useState } from "react";
import { useGetProfileQuery } from "@/shared/lib/api/profileApi";

type AuthMode = "login" | "signup";

type MobileHeaderState = {
    user: { email?: string | null } | null | undefined;
    profile:
    | {
        username?: string | null;
        avatar_url?: string | null;
    }
    | null
    | undefined;
    isLoadingProfile: boolean;
    showAuthModal: boolean;
    authMode: AuthMode;
    showUsernameSetup: boolean;
};

type MobileHeaderHandlers = {
    openAuth: (mode: AuthMode) => void;
    closeAuth: () => void;
    switchAuthMode: (mode: AuthMode) => void;
};

export const useMobileHeader = (): {
    state: MobileHeaderState;
    handlers: MobileHeaderHandlers;
} => {
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { data: profileData, isLoading: isLoadingProfile } =
        useGetProfileQuery();

    const openAuth = useCallback((mode: AuthMode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    }, []);

    const closeAuth = useCallback(() => {
        setShowAuthModal(false);
    }, []);

    const switchAuthMode = useCallback((mode: AuthMode) => {
        setAuthMode(mode);
    }, []);

    const state = useMemo<MobileHeaderState>(() => {
        const user = profileData?.user;
        const profile = profileData?.profile;

        return {
            user,
            profile,
            isLoadingProfile,
            showAuthModal,
            authMode,
            showUsernameSetup: Boolean(user && !profile?.username),
        };
    }, [authMode, isLoadingProfile, profileData, showAuthModal]);

    return {
        state,
        handlers: {
            openAuth,
            closeAuth,
            switchAuthMode,
        },
    };
};


