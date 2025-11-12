"use client";

import { useCallback } from "react";
import {
    useIsTrackLikedQuery,
    useLikeTrackMutation,
    useUnlikeTrackMutation,
    useIsPlaylistLikedQuery,
    useLikePlaylistMutation,
    useUnlikePlaylistMutation,
    useIsAlbumLikedQuery,
    useLikeAlbumMutation,
    useUnlikeAlbumMutation,
    type PlaylistLibraryData,
    type AlbumLibraryData,
} from "@/shared/lib/api/musicApi";
import type { Track } from "@/entities/track";

export type LikePayload = Pick<
    Track,
    | "title"
    | "artist"
    | "artistId"
    | "album"
    | "albumId"
    | "coverUrl"
    | "previewUrl"
    | "duration"
>;

export const useToggleLike = (trackId: string, trackData?: LikePayload) => {
    const { data: isLiked = false, isLoading: isCheckingLike } =
        useIsTrackLikedQuery(
            { trackId },
            {
                skip: !trackId,
            }
        );
    const [likeTrack, { isLoading: isLiking }] = useLikeTrackMutation();
    const [unlikeTrack, { isLoading: isUnliking }] = useUnlikeTrackMutation();

    const toggle = useCallback(async () => {
        try {
            if (isLiked) {
                await unlikeTrack({ trackId }).unwrap();
                return;
            }

            await likeTrack({ trackId, trackData }).unwrap();
        } catch (error) {
            console.error("failed to toggle like", error);
        }
    }, [isLiked, likeTrack, trackData, trackId, unlikeTrack]);

    return {
        isLiked,
        toggle,
        isLoading: isCheckingLike || isLiking || isUnliking,
    };
};

export type PlaylistLikePayload = PlaylistLibraryData;

export const useTogglePlaylistLike = (
    playlistId: string,
    playlistData?: PlaylistLikePayload
) => {
    const { data: isLiked = false, isLoading: isChecking } =
        useIsPlaylistLikedQuery(
            { playlistId },
            {
                skip: !playlistId,
            }
        );

    const [likePlaylist, { isLoading: isLiking }] = useLikePlaylistMutation();
    const [unlikePlaylist, { isLoading: isUnliking }] =
        useUnlikePlaylistMutation();

    const toggle = useCallback(async () => {
        try {
            if (isLiked) {
                await unlikePlaylist({ playlistId }).unwrap();
                return;
            }

            await likePlaylist({
                playlistId,
                playlistData,
            }).unwrap();
        } catch (error) {
            console.error("failed to toggle playlist like", error);
        }
    }, [isLiked, likePlaylist, playlistData, playlistId, unlikePlaylist]);

    return {
        isLiked,
        toggle,
        isLoading: isChecking || isLiking || isUnliking,
    };
};

export type AlbumLikePayload = AlbumLibraryData;

export const useToggleAlbumLike = (
    albumId: string,
    albumData?: AlbumLikePayload
) => {
    const { data: isLiked = false, isLoading: isChecking } =
        useIsAlbumLikedQuery(
            { albumId },
            {
                skip: !albumId,
            }
        );

    const [likeAlbum, { isLoading: isLiking }] = useLikeAlbumMutation();
    const [unlikeAlbum, { isLoading: isUnliking }] = useUnlikeAlbumMutation();

    const toggle = useCallback(async () => {
        try {
            if (isLiked) {
                await unlikeAlbum({ albumId }).unwrap();
                return;
            }

            await likeAlbum({ albumId, albumData }).unwrap();
        } catch (error) {
            console.error("failed to toggle album like", error);
        }
    }, [albumData, albumId, isLiked, likeAlbum, unlikeAlbum]);

    return {
        isLiked,
        toggle,
        isLoading: isChecking || isLiking || isUnliking,
    };
};

