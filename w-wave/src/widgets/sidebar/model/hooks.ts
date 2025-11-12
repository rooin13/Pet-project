"use client";

import { useCallback, useMemo, useState } from "react";
import { useGetProfileQuery } from "@/shared/lib/api/profileApi";
import {
    useGetMyPlaylistsQuery,
    type Playlist,
} from "@/shared/lib/api/musicApi";

type AuthMode = "login" | "signup";

type ProfileUser = {
    id: string;
    email?: string | null;
} | null;

type ProfileDetails = {
    username?: string | null;
    avatar_url?: string | null;
} | null;

type SidebarState = {
    user: ProfileUser;
    profile: ProfileDetails;
    playlists: Playlist[];
    visiblePlaylists: Playlist[];
    isLoadingProfile: boolean;
    showAuthModal: boolean;
    authMode: AuthMode;
    showUsernameSetup: boolean;
};

type SidebarHandlers = {
    openAuth: (mode: AuthMode) => void;
    closeAuth: () => void;
    switchAuthMode: (mode: AuthMode) => void;
};

export const useSidebar = (): {
    state: SidebarState;
    handlers: SidebarHandlers;
} => {
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { data: profileData, isLoading: isLoadingProfile } =
        useGetProfileQuery();
    const { data: playlistsData = [] } = useGetMyPlaylistsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: false,
        }
    );

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

    const state = useMemo<SidebarState>(() => {
        const user = (profileData?.user ?? null) as ProfileUser;
        const profile = (profileData?.profile ?? null) as ProfileDetails;

        return {
            user,
            profile,
            playlists: playlistsData,
            visiblePlaylists: playlistsData.slice(0, 10),
            isLoadingProfile,
            showAuthModal,
            authMode,
            showUsernameSetup: Boolean(user && !profile?.username),
        };
    }, [authMode, isLoadingProfile, playlistsData, profileData, showAuthModal]);

    return {
        state,
        handlers: {
            openAuth,
            closeAuth,
            switchAuthMode,
        },
    };
};

