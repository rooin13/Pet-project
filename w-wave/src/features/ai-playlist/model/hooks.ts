"use client";

import { useState } from "react";
import {
    aiPlaylistRequestSchema,
    type AIPlaylistResponse,
} from "./types";

export function useAIPlaylist() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePlaylist = async (
        prompt: string,
        useMyLikes: boolean = true
    ): Promise<AIPlaylistResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const payload = { prompt, useMyLikes };
            const validation = aiPlaylistRequestSchema.safeParse(payload);

            if (!validation.success) {
                throw new Error(
                    validation.error.issues[0]?.message ??
                    "Prompt must be at least 3 characters"
                );
            }

            const response = await fetch("/api/ai/generate-playlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(validation.data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate playlist");
            }

            const data: AIPlaylistResponse = await response.json();
            return data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Something went wrong";
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        generatePlaylist,
        isLoading,
        error,
    };
}

