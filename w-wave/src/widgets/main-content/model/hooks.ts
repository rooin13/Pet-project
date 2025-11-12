"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlayTrack } from "@/features/music";
import type { Track } from "@/entities/track";

export type FeaturedPlaylist = {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    owner: string;
    tracksCount: number;
};

type PlaylistTrack = {
    id: string;
    title: string;
    artist: string;
    artistId?: string;
    album?: string;
    albumId?: string;
    coverUrl?: string;
    duration?: number;
    previewUrl?: string | null;
};

type PlaylistResponse = {
    tracks?: PlaylistTrack[];
};

type MainContentState = {
    playlists: FeaturedPlaylist[];
    isLoading: boolean;
    topPlaylists: FeaturedPlaylist[];
    error: string | null;
};

type MainContentHandlers = {
    playPlaylist: (playlistId: string) => Promise<void>;
    refresh: () => Promise<void>;
};

const PLAYLISTS_API = "/api/spotify/featured-playlists";

const fetchPlaylists = async (): Promise<{
    playlists: FeaturedPlaylist[];
    error?: string;
}> => {
    console.info("[Home] requesting featured playlists", {
        endpoint: PLAYLISTS_API,
    });
    const response = await fetch(PLAYLISTS_API, { cache: "no-store" });

    let payload: { playlists?: FeaturedPlaylist[]; error?: string } | null = null;
    try {
        payload = (await response.json()) as {
            playlists?: FeaturedPlaylist[];
            error?: string;
        };
    } catch (parseError) {
        console.error("[Home] failed to parse featured playlists response", {
            status: response.status,
            statusText: response.statusText,
            error: parseError,
        });
    }

    if (!response.ok) {
        console.error("[Home] featured playlists request failed", {
            status: response.status,
            statusText: response.statusText,
            error: payload?.error,
        });
        return {
            playlists: payload?.playlists ?? [],
            error:
                payload?.error ?? `HTTP ${response.status} ${response.statusText}`,
        };
    }

    console.info("[Home] featured playlists loaded", {
        count: payload?.playlists?.length ?? 0,
    });

    return {
        playlists: payload?.playlists ?? [],
        error: payload?.error,
    };
};

const fetchPlaylistTracks = async (playlistId: string): Promise<PlaylistTrack[]> => {
    const response = await fetch(`/api/spotify/playlist/${playlistId}`, {
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("failed to fetch playlist tracks");
    }

    const data = (await response.json()) as PlaylistResponse;
    return data.tracks ?? [];
};

const mapPlaylistTrackToTrack = (track: PlaylistTrack): Track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    artistId: track.artistId,
    album: track.album,
    albumId: track.albumId,
    coverUrl: track.coverUrl ?? "",
    previewUrl: track.previewUrl ?? null,
    duration: track.duration ?? 0,
});

export const useMainContent = (): {
    state: MainContentState;
    handlers: MainContentHandlers;
} => {
    const [playlists, setPlaylists] = useState<FeaturedPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { playTrack } = usePlayTrack();

    const loadPlaylists = useCallback(async () => {
        setIsLoading(true);
        try {
            const { playlists: result, error: fetchError } = await fetchPlaylists();
            setPlaylists(result);
            setError(fetchError ?? null);
        } catch (error) {
            console.error("[Home] loadPlaylists failed", { error });
            setPlaylists([]);
            setError("Failed to load Spotify playlists");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPlaylists();
    }, [loadPlaylists]);

    const playPlaylist = useCallback(
        async (playlistId: string) => {
            try {
                console.info("[Home] playPlaylist invoked", {
                    playlistId,
                });
                const tracks = await fetchPlaylistTracks(playlistId);
                if (!tracks.length) {
                    console.warn("[Home] playlist has no tracks", { playlistId });
                    return;
                }

                const playlistTracks = tracks.map(mapPlaylistTrackToTrack);

                const uniqueTracks = playlistTracks.filter((track, index, self) => {
                    if (!track.id) {
                        return index === 0;
                    }
                    return (
                        index ===
                        self.findIndex((candidate) => candidate.id === track.id)
                    );
                });

                if (uniqueTracks.length === 0) {
                    console.warn("[Home] unique playlist tracks empty", {
                        playlistId,
                    });
                    return;
                }

                console.info("[Home] starting playlist playback", {
                    playlistId,
                    trackCount: uniqueTracks.length,
                    trackIds: uniqueTracks.map((track) => track.id),
                });
                playTrack(uniqueTracks[0], uniqueTracks);
            } catch (error) {
                console.error("[Home] failed to start playlist playback", {
                    error,
                    playlistId,
                });
            }
        },
        [playTrack]
    );

    const state = useMemo<MainContentState>(() => {
        return {
            playlists,
            isLoading,
            topPlaylists: playlists.slice(0, 5),
            error,
        };
    }, [error, isLoading, playlists]);

    return {
        state,
        handlers: {
            playPlaylist,
            refresh: loadPlaylists,
        },
    };
};


