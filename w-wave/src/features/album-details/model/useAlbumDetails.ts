"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlayTrack } from "@/features/music";
import type { Track } from "@/entities/track";

type AlbumDetails = {
    id: string;
    name: string;
    imageUrl: string;
    releaseDate: string;
    totalTracks: number;
    artists: Array<{ id: string; name: string }>;
};

type ApiTrack = {
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

type AlbumResponse = {
    album: AlbumDetails;
    tracks: ApiTrack[];
};

type AlbumState = {
    album: AlbumDetails | null;
    tracks: Track[];
    isLoading: boolean;
};

type AlbumHandlers = {
    playAll: (startIndex?: number) => void;
    refresh: () => Promise<void>;
};

const mapTrack = (track: ApiTrack): Track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    artistId: track.artistId,
    album: track.album,
    albumId: track.albumId,
    coverUrl: track.coverUrl ?? "",
    duration: track.duration ?? 0,
    previewUrl: track.previewUrl ?? null,
});

export const useAlbumDetails = (
    albumId: string
): { state: AlbumState; handlers: AlbumHandlers } => {
    const [album, setAlbum] = useState<AlbumDetails | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { playTrack } = usePlayTrack();

    const fetchAlbum = useCallback(async () => {
        if (!albumId) {
            setAlbum(null);
            setTracks([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/album/${albumId}`, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("failed to fetch album");
            }

            const data = (await response.json()) as AlbumResponse;
            setAlbum(data.album);
            setTracks((data.tracks ?? []).map(mapTrack));
        } catch (error) {
            console.error("failed to load album", error);
            setAlbum(null);
            setTracks([]);
        } finally {
            setIsLoading(false);
        }
    }, [albumId]);

    useEffect(() => {
        void fetchAlbum();
    }, [fetchAlbum]);

    const playAll = useCallback(
        (startIndex = 0) => {
            if (!tracks.length || startIndex < 0 || startIndex >= tracks.length) {
                return;
            }

            playTrack(tracks[startIndex], tracks.slice(startIndex + 1));
        },
        [playTrack, tracks]
    );

    const state = useMemo<AlbumState>(() => {
        return {
            album,
            tracks,
            isLoading,
        };
    }, [album, isLoading, tracks]);

    return {
        state,
        handlers: {
            playAll,
            refresh: fetchAlbum,
        },
    };
};


