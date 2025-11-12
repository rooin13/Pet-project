"use client";

import { useState, useCallback } from "react";
import type { Track } from "@/entities/track";

export type SearchTrack = Omit<
    Track,
    "coverUrl" | "previewUrl" | "duration"
> & {
    coverUrl?: string;
    previewUrl?: string | null;
    duration?: number;
    popularity?: number;
};

export type SearchArtist = {
    id: string;
    name: string;
    imageUrl: string;
    genres: string[];
    popularity: number;
    followers: number;
};

export type SearchAlbum = {
    id: string;
    name: string;
    artist: string;
    artistId?: string;
    imageUrl: string;
    releaseDate: string;
    totalTracks: number;
};

export type SearchPlaylist = {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string;
    tracksCount: number;
    owner: string;
};

export type SearchResults = {
    tracks: SearchTrack[];
    artists: SearchArtist[];
    albums: SearchAlbum[];
    playlists: SearchPlaylist[];
};

export function useUniversalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults>({
        tracks: [],
        artists: [],
        albums: [],
        playlists: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"all" | "tracks" | "artists" | "albums" | "playlists">("all");

    const search = useCallback(
        async (searchQuery: string, tabType: string = "all") => {
            if (!searchQuery.trim()) {
                setResults({ tracks: [], artists: [], albums: [], playlists: [] });
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // normalize type for api (without plural suffix)
                let apiType = tabType;
                if (tabType === "tracks") apiType = "track";
                if (tabType === "artists") apiType = "artist";
                if (tabType === "albums") apiType = "album";
                if (tabType === "playlists") apiType = "playlist";

                const response = await fetch(
                    `/api/search?q=${encodeURIComponent(searchQuery)}&type=${apiType}&limit=20`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || errorData.error || "Failed to search");
                }

                const data = await response.json();
                setResults({
                    tracks: data.tracks || [],
                    artists: data.artists || [],
                    albums: data.albums || [],
                    playlists: data.playlists || [],
                });
            } catch (err) {
                console.error("Search error:", err);
                setError(err instanceof Error ? err.message : "Search failed");
                setResults({ tracks: [], artists: [], albums: [], playlists: [] });
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        search,
        activeTab,
        setActiveTab,
    };
}

