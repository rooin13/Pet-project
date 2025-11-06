"use client";

import {
    useIsTrackLikedQuery,
    useLikeTrackMutation,
    useUnlikeTrackMutation,
} from "@/shared/lib/api/musicApi";

export type TrackData = {
    title: string;
    artist: string;
    artistId?: string;
    coverUrl: string;
    duration: number;
    album?: string;
    albumId?: string;
    previewUrl?: string | null;
};

export const useToggleLike = (trackId: string, trackData?: TrackData) => {
    const { data: isLiked = false, isLoading: isCheckingLike } = useIsTrackLikedQuery({ trackId }, {
        skip: !trackId,
    });
    const [likeTrack, { isLoading: isLiking }] = useLikeTrackMutation();
    const [unlikeTrack, { isLoading: isUnliking }] = useUnlikeTrackMutation();

    const toggle = async () => {
        console.log("💜 TOGGLE LIKE:", trackId, "isLiked:", isLiked, "trackData:", trackData);

        try {
            if (isLiked) {
                await unlikeTrack({ trackId }).unwrap();
            } else {
                await likeTrack({ trackId, trackData }).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    return {
        isLiked,
        toggle,
        isLoading: isCheckingLike || isLiking || isUnliking,
    };
};
