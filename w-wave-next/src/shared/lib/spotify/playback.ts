/**
 * Spotify Web Playback SDK Integration
 * Для воспроизведения полных треков (требует Premium)
 */

export interface SpotifyPlayer {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(
        event: "ready" | "not_ready",
        callback: (data: { device_id: string }) => void
    ): boolean;
    addListener(
        event: "player_state_changed",
        callback: (state: SpotifyPlaybackState | null) => void
    ): boolean;
    addListener(
        event: "initialization_error" | "authentication_error" | "account_error" | "playback_error",
        callback: (data: { message: string }) => void
    ): boolean;
    removeListener(event: string): boolean;
    getCurrentState(): Promise<SpotifyPlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
}

export interface SpotifyPlaybackState {
    context: {
        uri: string | null;
        metadata: Record<string, unknown>;
    };
    disallows: {
        pausing: boolean;
        peeking_next: boolean;
        peeking_prev: boolean;
        resuming: boolean;
        seeking: boolean;
        skipping_next: boolean;
        skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
        current_track: SpotifyTrack;
        previous_tracks: SpotifyTrack[];
        next_tracks: SpotifyTrack[];
    };
}

export interface SpotifyTrack {
    uri: string;
    id: string;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: {
        uri: string;
        name: string;
        images: { url: string }[];
    };
    artists: { uri: string; name: string }[];
    duration_ms: number;
}

export interface SpotifyPlayerConstructor {
    new(options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
    }): SpotifyPlayer;
}

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: {
            Player: SpotifyPlayerConstructor;
        };
    }
}

export type SpotifyPlayerInstance = SpotifyPlayer;

/**
 * Инициализация Spotify Web Playback SDK
 */
export function initSpotifyPlayer(
    accessToken: string,
    onReady: (deviceId: string) => void,
    onStateChange: (state: SpotifyPlaybackState | null) => void
): Promise<SpotifyPlayerInstance> {
    return new Promise((resolve, reject) => {
        // Проверяем загружен ли SDK
        if (!window.Spotify) {
            // Загружаем SDK
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;

            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = () => {
                createPlayer();
            };
        } else {
            createPlayer();
        }

        function createPlayer() {
            const player = new window.Spotify.Player({
                name: "W-Wave Player",
                getOAuthToken: (cb) => {
                    cb(accessToken);
                },
                volume: 0.5,
            });

            // Обработчики событий
            player.addListener("ready", ({ device_id }: { device_id: string }) => {
                console.log("Spotify Player ready with Device ID:", device_id);
                onReady(device_id);
            });

            player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
                console.log("Device ID has gone offline:", device_id);
            });

            player.addListener("player_state_changed", (state) => {
                if (!state) return;
                onStateChange(state);
            });

            player.addListener("initialization_error", ({ message }: { message: string }) => {
                console.error("Spotify Player initialization error:", message);
                reject(new Error(message));
            });

            player.addListener("authentication_error", ({ message }: { message: string }) => {
                console.error("Spotify Player auth error:", message);
                reject(new Error(message));
            });

            player.addListener("account_error", ({ message }: { message: string }) => {
                console.error("Spotify Player account error:", message);
                reject(new Error(message));
            });

            player.addListener("playback_error", ({ message }: { message: string }) => {
                console.error("Spotify Player playback error:", message);
            });

            // Подключаем плеер
            player.connect().then((success) => {
                if (success) {
                    console.log("Spotify Player connected successfully!");
                    resolve(player);
                } else {
                    reject(new Error("Failed to connect Spotify Player"));
                }
            });
        }
    });
}

/**
 * Воспроизвести трек через Spotify API
 */
export async function playSpotifyTrack(
    accessToken: string,
    deviceId: string,
    trackUri: string
) {
    try {
        console.log("🎮 Activating device:", deviceId);

        // Сначала активируем устройство (transfer playback)
        const transferResponse = await fetch(
            "https://api.spotify.com/v1/me/player",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: false, // Не начинаем воспроизведение сразу
                }),
            }
        );

        if (!transferResponse.ok && transferResponse.status !== 204) {
            console.warn("⚠️ Failed to transfer playback:", transferResponse.status);
        } else {
            console.log("✅ Device activated");
        }

        // Небольшая задержка для активации
        await new Promise(resolve => setTimeout(resolve, 300));

        console.log("▶️ Starting playback on device:", deviceId);
        const response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uris: [trackUri],
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Playback failed:", response.status, errorText);
            let error;
            try {
                error = JSON.parse(errorText);
            } catch {
                throw new Error(`Failed to play track: ${response.status}`);
            }
            throw new Error(error.error?.message || "Failed to play track");
        }

        console.log("✅ Playback started successfully!");
        return true;
    } catch (error) {
        console.error("❌ Failed to play track:", error);
        return false;
    }
}

/**
 * Воспроизвести список треков
 */
export async function playSpotifyTracks(
    accessToken: string,
    deviceId: string,
    trackUris: string[],
    offset: number = 0
) {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uris: trackUris,
                    offset: { position: offset },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Failed to play tracks");
        }

        return true;
    } catch (error) {
        console.error("Failed to play tracks:", error);
        return false;
    }
}
