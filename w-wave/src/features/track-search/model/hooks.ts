"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { Track as PlayerTrack } from "@/entities/track";
import type { Track } from "./types";

const DEFAULT_LIMIT = 15;

export function useTrackSearch() {
    const [query, setQueryState] = useState("");
    const [results, setResults] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);

    const limitRef = useRef(limit);
    useEffect(() => {
        limitRef.current = limit;
    }, [limit]);

    const setQuery = useCallback((value: string) => {
        setQueryState(value);
        setLimit(DEFAULT_LIMIT);
    }, []);

    const search = useCallback(
        async (searchQuery: string, overrideLimit?: number) => {
            const trimmedQuery = searchQuery.trim();

            if (!trimmedQuery) {
                setResults([]);
                setError(null);
                setIsLoading(false);
                return;
            }

            const targetLimit = overrideLimit ?? limitRef.current;
            if (
                overrideLimit !== undefined &&
                overrideLimit !== limitRef.current
            ) {
                setLimit(overrideLimit);
                limitRef.current = overrideLimit;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/tracks/search?q=${encodeURIComponent(
                        trimmedQuery
                    )}&limit=${targetLimit}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("failed to search tracks");
                }

                const data = await response.json();
                setResults(data.tracks || []);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "search failed"
                );
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const loadMore = useCallback(
        async (searchQuery: string) => {
            const trimmedQuery = searchQuery.trim();
            if (!trimmedQuery) {
                return;
            }

            const nextLimit = limitRef.current + DEFAULT_LIMIT;
            limitRef.current = nextLimit;
            setLimit(nextLimit);
            await search(trimmedQuery, nextLimit);
        },
        [search]
    );

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setResults([]);
            setError(null);
            return;
        }

        const timer = setTimeout(() => {
            void search(trimmedQuery);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [query, search]);

    const mapToPlayerTrack = useCallback(
        (track: Track): PlayerTrack => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            album: track.album,
            coverUrl: track.coverUrl,
            previewUrl: track.previewUrl,
            duration: track.duration,
        }),
        []
    );

    const buildQueue = useCallback(
        (startId: string): PlayerTrack[] => {
            const startIndex = results.findIndex((track) => track.id === startId);
            if (startIndex === -1) {
                return [];
            }

            return results.slice(startIndex).map(mapToPlayerTrack);
        },
        [mapToPlayerTrack, results]
    );

    const canLoadMore = useMemo(
        () => results.length >= limitRef.current,
        [results]
    );

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        search,
        loadMore,
        canLoadMore,
        mapToPlayerTrack,
        buildQueue,
    };
}

