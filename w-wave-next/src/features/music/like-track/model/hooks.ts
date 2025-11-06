"use client";

import { useToggleLikeTrackMutation } from "@/shared/lib/api/trackApi";
import { Track } from "@/entities/track";

// hook for toggling track like
export function useLikeTrack() {
    const [toggleLike, { isLoading }] = useToggleLikeTrackMutation();

    const toggle = async (track: Track, isLiked: boolean) => {
        try {
            await toggleLike({
                trackId: track.id,
                isLiked,
            }).unwrap();
        } catch (error) {
            console.error("Failed to toggle like:", error);
            throw error;
        }
    };

    return {
        toggle,
        isLoading,
    };
}

