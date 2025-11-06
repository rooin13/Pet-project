"use client";

import { useState, useCallback } from "react";
import { Track } from "./types";

export function useTrackSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState(15);

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setLimit(15);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/tracks/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to search tracks");
            }

            const data = await response.json();
            setResults(data.tracks || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Search failed");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    const loadMore = useCallback(() => {
        setLimit(prev => prev + 15);
    }, []);

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        search,
        loadMore,
        canLoadMore: results.length >= limit,
    };
}

