"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
    setCurrentTrack,
    play,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    setDuration,
    setQueue,
    clearQueue,
    type PlayerState,
} from "./slice";
import {
    initSpotifyPlayer,
    playSpotifyTracks,
    type SpotifyPlayerInstance,
    type SpotifyPlaybackState,
} from "@/shared/lib/spotify/playback";
import type { Track } from "@/entities/track";

const DEFAULT_VOLUME = 0.7;

export const usePlayerState = () => {
    return useSelector((state: RootState) => state.player as PlayerState);
};

export const usePlayerControls = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleToggleShuffle = useCallback(
        () => dispatch(toggleShuffle()),
        [dispatch]
    );
    const handleToggleRepeat = useCallback(
        () => dispatch(toggleRepeat()),
        [dispatch]
    );
    const handlePlayNext = useCallback(() => dispatch(playNext()), [dispatch]);
    const handlePlayPrevious = useCallback(
        () => dispatch(playPrevious()),
        [dispatch]
    );
    const handleTogglePlayPause = useCallback(
        () => dispatch(togglePlayPause()),
        [dispatch]
    );
    const handleSetCurrentTime = useCallback(
        (time: number) => dispatch(setCurrentTime(time)),
        [dispatch]
    );
    const handleSetCurrentTrack = useCallback(
        (track: Track) => dispatch(setCurrentTrack(track)),
        [dispatch]
    );
    const handlePlay = useCallback(() => dispatch(play()), [dispatch]);
    const handleSetVolume = useCallback(
        (value: number) => dispatch(setVolume(value)),
        [dispatch]
    );
    const handleSetDuration = useCallback(
        (value: number) => dispatch(setDuration(value)),
        [dispatch]
    );
    const handleSetQueue = useCallback(
        (tracks: Track[]) => dispatch(setQueue(tracks)),
        [dispatch]
    );
    const handleClearQueue = useCallback(
        () => dispatch(clearQueue()),
        [dispatch]
    );

    return {
        toggleShuffle: handleToggleShuffle,
        toggleRepeat: handleToggleRepeat,
        playNext: handlePlayNext,
        playPrevious: handlePlayPrevious,
        togglePlayPause: handleTogglePlayPause,
        setCurrentTime: handleSetCurrentTime,
        setCurrentTrack: handleSetCurrentTrack,
        play: handlePlay,
        setVolume: handleSetVolume,
        setDuration: handleSetDuration,
        setQueue: handleSetQueue,
        clearQueue: handleClearQueue,
    };
};

type PlayerHandlers = {
    onSeek: (time: number) => void;
    onProgressClick: (event: ReactMouseEvent<HTMLDivElement>) => void;
    onVolumeClick: (event: ReactMouseEvent<HTMLDivElement>) => void;
    onSetVolume: (value: number) => void;
    onToggleMute: () => void;
    onToggleShuffle: () => void;
    onPrevious: () => void;
    onTogglePlay: () => void;
    onNext: () => void;
    onToggleRepeat: () => void;
};

type PlayerController = {
    state: PlayerState;
    canPlayDirectly: boolean;
    handlers: PlayerHandlers;
};

export const usePlayerController = (): PlayerController => {
    const state = usePlayerState();
    const {
        toggleShuffle: toggleShuffleAction,
        toggleRepeat: toggleRepeatAction,
        playNext: playNextAction,
        playPrevious: playPreviousAction,
        togglePlayPause: togglePlayPauseAction,
        setCurrentTime: setCurrentTimeAction,
        setVolume: setVolumeAction,
        setDuration: setDurationAction,
    } = usePlayerControls();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const spotifyPlayerRef = useRef<SpotifyPlayerInstance | null>(null);
    const spotifyStateRef = useRef<SpotifyPlaybackState | null>(null);
    const isLoadingQueueRef = useRef(false);
    const lastLoadedTrackIdRef = useRef<string | null>(null);

    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
    const [useSpotifySDK, setUseSpotifySDK] = useState(false);
    const [isSpotifyReady, setIsSpotifyReady] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(DEFAULT_VOLUME);

    useEffect(() => {
        if (!state.currentTrack) {
            console.info("[Player] current track cleared", {
                queueSize: state.queue.length,
                shuffle: state.shuffle,
                repeat: state.repeat,
            });
            return;
        }

        console.info("[Player] current track changed", {
            trackId: state.currentTrack.id,
            title: state.currentTrack.title,
            queueSize: state.queue.length,
            queueIds: state.queue.map((track) => track.id),
            shuffle: state.shuffle,
            repeat: state.repeat,
            useSpotifySDK,
        });
    }, [
        state.currentTrack,
        state.queue,
        state.repeat,
        state.shuffle,
        useSpotifySDK,
    ]);

    useEffect(() => {
        console.info("[Player] queue updated", {
            size: state.queue.length,
            ids: state.queue.map((track) => track.id),
        });
    }, [state.queue]);

    useEffect(() => {
        let mounted = true;

        fetch("/api/spotify/token")
            .then((res) => res.json())
            .then(async (data) => {
                if (!mounted) return;

                if (data.connected && data.token) {
                    setSpotifyToken(data.token);
                    try {
                        const player = await initSpotifyPlayer(
                            data.token,
                            (newDeviceId: string) => {
                                if (!mounted) return;
                                setDeviceId(newDeviceId);
                                setIsSpotifyReady(true);
                                setUseSpotifySDK(true);
                            },
                            (stateUpdate: SpotifyPlaybackState | null) => {
                                if (!mounted) return;

                                const previousState = spotifyStateRef.current;
                                spotifyStateRef.current = stateUpdate;

                                if (stateUpdate) {
                                    setCurrentTimeAction(
                                        stateUpdate.position / 1000
                                    );
                                    setDurationAction(
                                        stateUpdate.track_window.current_track
                                            .duration_ms / 1000
                                    );

                                    const currentUri =
                                        stateUpdate.track_window.current_track
                                            .uri;
                                    const previousUri =
                                        previousState?.track_window
                                            .current_track.uri;

                                    if (
                                        previousUri &&
                                        currentUri !== previousUri &&
                                        !isLoadingQueueRef.current
                                    ) {
                                        const nextTrackId =
                                            currentUri.split(":")[2];

                                        if (
                                            nextTrackId !==
                                            lastLoadedTrackIdRef.current
                                        ) {
                                            lastLoadedTrackIdRef.current =
                                                nextTrackId;
                                            playNextAction();
                                        } else {
                                            lastLoadedTrackIdRef.current =
                                                nextTrackId;
                                        }
                                    }
                                }
                            }
                        );

                        if (mounted) {
                            spotifyPlayerRef.current = player;
                        }
                    } catch (error: unknown) {
                        console.error(
                            "❌ Failed to initialize Spotify Player:",
                            error
                        );
                        if (mounted) {
                            setUseSpotifySDK(false);
                            setIsSpotifyReady(false);
                            setDeviceId(null);
                            setSpotifyToken(null);

                            if (spotifyPlayerRef.current) {
                                try {
                                    spotifyPlayerRef.current.disconnect();
                                } catch (disconnectError: unknown) {
                                    console.error(
                                        "Failed to disconnect player after initialization error",
                                        disconnectError
                                    );
                                }
                                spotifyPlayerRef.current = null;
                            }
                        }
                    }
                } else {
                    if (mounted) {
                        setUseSpotifySDK(false);
                        setIsSpotifyReady(false);
                        setDeviceId(null);
                        setSpotifyToken(null);
                    }
                }
            })
            .catch((error: unknown) => {
                console.error("❌ Failed to get Spotify token:", error);
                if (mounted) {
                    setUseSpotifySDK(false);
                    setIsSpotifyReady(false);
                    setDeviceId(null);
                    setSpotifyToken(null);
                }
            });

        return () => {
            mounted = false;

            if (spotifyPlayerRef.current) {
                try {
                    spotifyPlayerRef.current.disconnect();
                } catch (disconnectError) {
                    console.error(
                        "Failed to disconnect player during cleanup",
                        disconnectError
                    );
                }
                spotifyPlayerRef.current = null;
            }
        };
    }, [playNextAction, setCurrentTimeAction, setDurationAction]);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();

            audioRef.current.addEventListener("timeupdate", () => {
                if (audioRef.current) {
                    setCurrentTimeAction(audioRef.current.currentTime);
                }
            });

            audioRef.current.addEventListener("loadedmetadata", () => {
                if (audioRef.current) {
                    setDurationAction(audioRef.current.duration);
                }
            });

            audioRef.current.addEventListener("ended", () => {
                playNextAction();
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, [playNextAction, setCurrentTimeAction, setDurationAction]);

    useEffect(() => {
        const currentTrack = state.currentTrack;

        if (!currentTrack) {
            return;
        }

        if (
            isLoadingQueueRef.current &&
            lastLoadedTrackIdRef.current &&
            lastLoadedTrackIdRef.current !== currentTrack.id
        ) {
            isLoadingQueueRef.current = false;

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }

        if (isLoadingQueueRef.current) {
            return;
        }

        if (lastLoadedTrackIdRef.current === currentTrack.id) {
            return;
        }

        setCurrentTimeAction(0);

        if (useSpotifySDK && isSpotifyReady && deviceId && spotifyToken) {
            const trackUris = [
                `spotify:track:${currentTrack.id}`,
                ...state.queue.map(
                    (track) => `spotify:track:${track.id}`
                ),
            ];

            isLoadingQueueRef.current = true;
            lastLoadedTrackIdRef.current = currentTrack.id;

            playSpotifyTracks(spotifyToken, deviceId, trackUris, 0)
                .then((success: boolean) => {
                    isLoadingQueueRef.current = false;

                    if (!success) {
                        console.error("❌ Failed to start Spotify queue");
                        lastLoadedTrackIdRef.current = null;
                        if (currentTrack.previewUrl && audioRef.current) {
                            audioRef.current.src = currentTrack.previewUrl;
                            audioRef.current.load();
                            audioRef.current.play().catch(console.error);
                        }
                    }
                })
                .catch((error: unknown) => {
                    console.error("❌ Spotify playback error:", error);
                    isLoadingQueueRef.current = false;
                    lastLoadedTrackIdRef.current = null;
                    if (currentTrack.previewUrl && audioRef.current) {
                        audioRef.current.src = currentTrack.previewUrl;
                        audioRef.current.load();
                        audioRef.current.play().catch(console.error);
                    }
                });
            return;
        }

        if (!currentTrack.previewUrl) {
            lastLoadedTrackIdRef.current = currentTrack.id;
            if (typeof window !== "undefined") {
                window.open(
                    `https://open.spotify.com/track/${currentTrack.id}`,
                    "_blank",
                    "noopener"
                );
            }
            return;
        }

        if (audioRef.current) {
            audioRef.current.src = currentTrack.previewUrl;
            audioRef.current.load();
            audioRef.current.play().catch((err: unknown) => {
                console.error("❌ Failed to play preview:", err);
            });
        }
    }, [
        state.currentTrack,
        state.queue,
        useSpotifySDK,
        isSpotifyReady,
        deviceId,
        spotifyToken,
        playNextAction,
        setCurrentTimeAction,
    ]);

    useEffect(() => {
        if (
            !useSpotifySDK ||
            !isSpotifyReady ||
            !spotifyPlayerRef.current ||
            !state.isPlaying
        ) {
            return;
        }

        const interval = setInterval(() => {
            if (spotifyPlayerRef.current && state.isPlaying) {
                spotifyPlayerRef.current
                    .getCurrentState()
                    .then((playerState: SpotifyPlaybackState | null) => {
                        if (playerState && !playerState.paused) {
                            setCurrentTimeAction(playerState.position / 1000);
                        }
                    });
            }
        }, 100);

        return () => clearInterval(interval);
    }, [
        isSpotifyReady,
        setCurrentTimeAction,
        state.isPlaying,
        useSpotifySDK,
    ]);

    useEffect(() => {
        if (useSpotifySDK && spotifyPlayerRef.current && isSpotifyReady) {
            spotifyPlayerRef.current
                .getCurrentState()
                .then((playerState: SpotifyPlaybackState | null) => {
                    if (!playerState) {
                        return;
                    }

                    if (state.isPlaying && playerState.paused) {
                        spotifyPlayerRef.current
                            ?.resume()
                            .catch((err: unknown) => {
                                console.error(
                                    "❌ Failed to resume Spotify:",
                                    err
                                );
                            });
                    } else if (!state.isPlaying && !playerState.paused) {
                        spotifyPlayerRef.current
                            ?.pause()
                            .catch((err: unknown) => {
                                console.error(
                                    "❌ Failed to pause Spotify:",
                                    err
                                );
                            });
                    }
                })
                .catch((err: unknown) => {
                    console.error("❌ Failed to get SDK state:", err);
                });
        } else if (audioRef.current && audioRef.current.src) {
            if (state.isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err: unknown) => {
                        if (
                            !(err instanceof Error) ||
                            err.name !== "AbortError"
                        ) {
                            console.error("❌ Failed to play preview:", err);
                        }
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isSpotifyReady, state.isPlaying, useSpotifySDK]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = state.volume;
        }

        if (useSpotifySDK && spotifyPlayerRef.current) {
            spotifyPlayerRef.current
                .setVolume(state.volume)
                .catch((err: unknown) => {
                    console.error("❌ Failed to update Spotify volume:", err);
                });
        }
    }, [state.volume, useSpotifySDK]);

    const handleSeek = useCallback(
        (newTime: number) => {
            if (useSpotifySDK && spotifyPlayerRef.current) {
                spotifyPlayerRef.current
                    .seek(Math.floor(newTime * 1000))
                    .catch((err: unknown) =>
                        console.error("Failed to seek Spotify:", err)
                    );
            } else if (audioRef.current) {
                audioRef.current.currentTime = newTime;
            }

            setCurrentTimeAction(newTime);
        },
        [setCurrentTimeAction, useSpotifySDK]
    );

    const handleProgressClick = useCallback(
        (event: ReactMouseEvent<HTMLDivElement>) => {
            if (!state.duration) return;

            const rect = event.currentTarget.getBoundingClientRect();
            const percent = (event.clientX - rect.left) / rect.width;
            const nextTime = percent * state.duration;

            handleSeek(nextTime);
        },
        [handleSeek, state.duration]
    );

    const handleSetExactVolume = useCallback(
        (value: number) => {
            const nextVolume = Math.max(0, Math.min(1, value));
            setVolumeAction(nextVolume);
        },
        [setVolumeAction]
    );

    const handleVolumeClick = useCallback(
        (event: ReactMouseEvent<HTMLDivElement>) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const percent = (event.clientX - rect.left) / rect.width;
            const nextVolume = Math.max(0, Math.min(1, percent));

            handleSetExactVolume(nextVolume);
        },
        [handleSetExactVolume]
    );

    const handleToggleMute = useCallback(() => {
        if (state.volume === 0) {
            handleSetExactVolume(previousVolume);
        } else {
            setPreviousVolume(state.volume);
            handleSetExactVolume(0);
        }
    }, [handleSetExactVolume, previousVolume, state.volume]);

    const handleShuffle = useCallback(() => {
        console.info("[Player] shuffle toggled", {
            source: "ui",
            previous: state.shuffle,
        });
        toggleShuffleAction();
    }, [state.shuffle, toggleShuffleAction]);

    const handlePrevious = useCallback(() => {
        console.info("[Player] handlePrevious invoked", {
            currentTime: state.currentTime,
            currentTrackId: state.currentTrack?.id,
            queueSize: state.queue.length,
        });
        if (state.currentTime > 3) {
            setCurrentTimeAction(0);

            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }

            if (useSpotifySDK && spotifyPlayerRef.current) {
                spotifyPlayerRef.current
                    .seek(0)
                    .catch((err: unknown) =>
                        console.error("Failed to seek Spotify:", err)
                    );
            }
        } else {
            console.info("[Player] dispatching previous action", {
                queueSize: state.queue.length,
            });
            isLoadingQueueRef.current = false;
            lastLoadedTrackIdRef.current = null;
            playPreviousAction();
        }
    }, [
        playPreviousAction,
        setCurrentTimeAction,
        state.currentTime,
        state.currentTrack?.id,
        state.queue,
        useSpotifySDK,
    ]);

    const handlePlayPause = useCallback(() => {
        if (useSpotifySDK && isSpotifyReady && deviceId) {
            togglePlayPauseAction();
            return;
        }

        if (!state.currentTrack?.previewUrl && !useSpotifySDK) {
            if (typeof window !== "undefined" && state.currentTrack) {
                window.open(
                    `https://open.spotify.com/track/${state.currentTrack.id}`,
                    "_blank",
                    "noopener"
                );
            }
            return;
        }

        togglePlayPauseAction();
    }, [
        deviceId,
        isSpotifyReady,
        state.currentTrack,
        togglePlayPauseAction,
        useSpotifySDK,
    ]);

    const handleNext = useCallback(() => {
        console.info("[Player] handleNext invoked", {
            currentTrackId: state.currentTrack?.id,
            queueSize: state.queue.length,
            useSpotifySDK,
        });
        isLoadingQueueRef.current = false;
        lastLoadedTrackIdRef.current = null;
        playNextAction();
    }, [playNextAction, state.currentTrack?.id, state.queue, useSpotifySDK]);

    const handleRepeat = useCallback(() => {
        console.info("[Player] repeat toggled", {
            source: "ui",
            previous: state.repeat,
        });
        toggleRepeatAction();
    }, [state.repeat, toggleRepeatAction]);

    const canPlayDirectly = useMemo(
        () => useSpotifySDK || !!state.currentTrack?.previewUrl,
        [state.currentTrack?.previewUrl, useSpotifySDK]
    );

    return {
        state,
        canPlayDirectly,
        handlers: {
            onSeek: handleSeek,
            onProgressClick: handleProgressClick,
            onVolumeClick: handleVolumeClick,
            onSetVolume: handleSetExactVolume,
            onToggleMute: handleToggleMute,
            onToggleShuffle: handleShuffle,
            onPrevious: handlePrevious,
            onTogglePlay: handlePlayPause,
            onNext: handleNext,
            onToggleRepeat: handleRepeat,
        },
    };
};

