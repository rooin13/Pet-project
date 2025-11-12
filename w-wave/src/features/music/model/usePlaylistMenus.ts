"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    useGetMyPlaylistsQuery,
    useAddTrackToPlaylistMutation,
} from "@/shared/lib/api/musicApi";
import { useIsTrackInPlaylistQuery } from "@/shared/lib/api/playlistTracksApi";

type BasicMenuState = {
    isOpen: boolean;
    isLoading: boolean;
    playlists: { id: string; name: string }[];
};

type BasicMenuHandlers = {
    toggle: () => void;
    select: (playlistId: string) => Promise<void>;
    close: () => void;
};

type BasicMenuRefs = {
    menuRef: React.MutableRefObject<HTMLDivElement | null>;
};

type PlaylistTrackData = {
    title?: string;
    artist?: string;
    coverUrl?: string;
    duration?: number;
    album?: string;
    previewUrl?: string | null;
};

export const useAddToPlaylistMenu = (
    trackId: string,
    trackData?: PlaylistTrackData | null
) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const { data: playlists = [], isLoading } = useGetMyPlaylistsQuery();
    const [addTrack] = useAddTrackToPlaylistMutation();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const select = useCallback(
        async (playlistId: string) => {
            await addTrack({ playlistId, trackId, trackData: trackData ?? undefined });
            setIsOpen(false);
        },
        [addTrack, trackData, trackId]
    );

    const state = useMemo<BasicMenuState>(() => {
        return {
            isOpen,
            isLoading,
            playlists,
        };
    }, [isLoading, isOpen, playlists]);

    const handlers: BasicMenuHandlers = {
        toggle: () => setIsOpen((prev) => !prev),
        select,
        close: () => setIsOpen(false),
    };

    return {
        state,
        refs: { menuRef } satisfies BasicMenuRefs,
        handlers,
    };
};

type EnhancedMenuState = {
    isOpen: boolean;
    isConfirmVisible: boolean;
    menuPosition: { top: number; left: number } | null;
    playlists: { id: string; name: string }[];
    isLoading: boolean;
};

type EnhancedMenuHandlers = {
    toggle: () => void;
    close: () => void;
    select: (playlistId: string, alreadyAdded: boolean) => void;
    confirm: () => Promise<void>;
    cancelConfirm: () => void;
};

type EnhancedMenuRefs = {
    menuRef: React.MutableRefObject<HTMLDivElement | null>;
    buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const MENU_WIDTH = 200;

export const useEnhancedPlaylistMenu = (
    trackId: string,
    trackData?: PlaylistTrackData | null
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [menuPosition, setMenuPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const { data: playlists = [], isLoading } = useGetMyPlaylistsQuery();
    const [addTrack] = useAddTrackToPlaylistMutation();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setConfirmVisible(false);
                setSelectedPlaylist(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - MENU_WIDTH,
            });
        }
    }, [isOpen]);

    const confirm = useCallback(async () => {
        if (!selectedPlaylist) {
            return;
        }

        await addTrack({
            playlistId: selectedPlaylist,
            trackId,
            trackData: trackData ?? undefined,
        });

        setConfirmVisible(false);
        setSelectedPlaylist(null);
        setIsOpen(false);
    }, [addTrack, selectedPlaylist, trackData, trackId]);

    const select = useCallback(
        async (playlistId: string, alreadyAdded: boolean) => {
            if (alreadyAdded) {
                setSelectedPlaylist(playlistId);
                setConfirmVisible(true);
                return;
            }

            await addTrack({
                playlistId,
                trackId,
                trackData: trackData ?? undefined,
            });
            setIsOpen(false);
        },
        [addTrack, trackData, trackId]
    );

    const state = useMemo<EnhancedMenuState>(() => {
        return {
            isOpen,
            isConfirmVisible,
            menuPosition,
            playlists,
            isLoading,
        };
    }, [isConfirmVisible, isLoading, isOpen, menuPosition, playlists]);

    const handlers: EnhancedMenuHandlers = {
        toggle: () => setIsOpen((prev) => !prev),
        close: () => {
            setIsOpen(false);
            setConfirmVisible(false);
            setSelectedPlaylist(null);
        },
        select,
        confirm,
        cancelConfirm: () => {
            setConfirmVisible(false);
            setSelectedPlaylist(null);
        },
    };

    return {
        state,
        refs: {
            menuRef,
            buttonRef,
        } satisfies EnhancedMenuRefs,
        handlers,
    };
};

export const usePlaylistItemStatus = (
    playlistId: string,
    trackId: string
) => {
    const { data: isAdded = false } = useIsTrackInPlaylistQuery({
        playlistId,
        trackId,
    });

    return isAdded;
};

type AddTrackDialogState = {
    playlists: { id: string; name: string }[];
    isLoading: boolean;
    isSuccess: boolean;
};

type AddTrackDialogHandlers = {
    select: (playlistId: string) => Promise<void>;
    resetSuccess: () => void;
};

export const useAddTrackDialog = (
    trackId: string
): {
    state: AddTrackDialogState;
    handlers: AddTrackDialogHandlers;
} => {
    const { data: playlists = [], isLoading } = useGetMyPlaylistsQuery();
    const [addTrack] = useAddTrackToPlaylistMutation();
    const [isSuccess, setSuccess] = useState(false);

    const select = useCallback(
        async (playlistId: string) => {
            await addTrack({ playlistId, trackId });
            setSuccess(true);
        },
        [addTrack, trackId]
    );

    const resetSuccess = useCallback(() => {
        setSuccess(false);
    }, []);

    const state = useMemo<AddTrackDialogState>(() => {
        return {
            playlists,
            isLoading,
            isSuccess,
        };
    }, [isLoading, isSuccess, playlists]);

    return {
        state,
        handlers: {
            select,
            resetSuccess,
        },
    };
};



