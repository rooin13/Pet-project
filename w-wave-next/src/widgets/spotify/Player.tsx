"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/store";
import {
	togglePlayPause,
	setCurrentTime,
	setDuration,
	setVolume,
	toggleShuffle,
	toggleRepeat,
	playNext,
	playPrevious,
} from "./Player/model";
import { useToggleLike } from "@/features/music";
import {
	initSpotifyPlayer,
	playSpotifyTrack,
	type SpotifyPlayerInstance,
	type SpotifyPlaybackState,
} from "@/shared/lib/spotify/playback";

export const Player = () => {
	const t = useTranslations("player");
	const dispatch = useDispatch();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const spotifyPlayerRef = useRef<SpotifyPlayerInstance | null>(null);
	const [deviceId, setDeviceId] = useState<string | null>(null);
	const [useSpotifySDK, setUseSpotifySDK] = useState(false);
	const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
	const [isSpotifyReady, setIsSpotifyReady] = useState(false);
	const spotifyStateRef = useRef<SpotifyPlaybackState | null>(null);
	const [previousVolume, setPreviousVolume] = useState(0.7); // Для восстановления после мута

	const {
		currentTrack,
		isPlaying,
		volume,
		currentTime,
		duration,
		shuffle,
		repeat,
	} = useSelector((state: RootState) => state.player);

	const { isLiked, toggle } = useToggleLike(
		currentTrack?.id || "",
		currentTrack
			? {
					title: currentTrack.title,
					artist: currentTrack.artist,
					artistId: currentTrack.artistId,
					coverUrl: currentTrack.coverUrl,
					duration: currentTrack.duration,
					album: currentTrack.album,
					previewUrl: currentTrack.previewUrl,
			  }
			: undefined
	);

	// Проверка подключения Spotify и инициализация SDK
	useEffect(() => {
		let mounted = true;

		console.log("🎧 Checking Spotify connection...");
		fetch("/api/spotify/token")
			.then((res) => res.json())
			.then(async (data) => {
				if (!mounted) return;

				console.log("🎧 Spotify token response:", data);
				if (data.connected && data.token) {
					console.log("🎧 Spotify connected! Initializing SDK...");
					console.log(
						"🔑 Token (first 50 chars):",
						data.token.substring(0, 50) + "..."
					);
					setSpotifyToken(data.token);
					try {
						const player = await initSpotifyPlayer(
							data.token,
							(deviceId) => {
								if (!mounted) return;
								console.log(
									"✅ Spotify Player ready, device_id:",
									deviceId
								);
								setDeviceId(deviceId);
								setIsSpotifyReady(true);
								setUseSpotifySDK(true);
							},
							(state) => {
								if (!mounted) return;

								const prevState = spotifyStateRef.current;
								spotifyStateRef.current = state;

								if (state) {
									// Синхронизируем состояние плеера с Redux
									dispatch(
										setCurrentTime(state.position / 1000)
									);
									dispatch(
										setDuration(
											state.track_window.current_track
												.duration_ms / 1000
										)
									);

									// автоматический переход к следующему треку
									// когда трек закончился (position близка к концу)
									const duration =
										state.track_window.current_track
											.duration_ms;
									const isNearEnd =
										duration - state.position < 500; // последние 500ms

									// если трек в конце И (на паузе ИЛИ позиция >= длительности)
									if (
										isNearEnd &&
										(state.paused ||
											state.position >= duration - 100)
									) {
										console.log(
											"🎵 Spotify SDK: Track ended, playing next from queue"
										);
										dispatch(playNext());
									}
								}
							}
						);
						if (mounted) {
							spotifyPlayerRef.current = player;
							console.log(
								"✅ Spotify Player initialized successfully"
							);
						}
					} catch (error) {
						console.error(
							"❌ Failed to initialize Spotify Player:",
							error
						);
						console.error("⚠️ Falling back to HTML5 Audio mode");
						if (mounted) {
							setUseSpotifySDK(false);
							setIsSpotifyReady(false);
							setDeviceId(null);
							setSpotifyToken(null);
							if (spotifyPlayerRef.current) {
								try {
									spotifyPlayerRef.current.disconnect();
								} catch {
									console.log(
										"Failed to disconnect failed player"
									);
								}
								spotifyPlayerRef.current = null;
							}
						}
					}
				} else {
					console.log(
						"❌ Spotify not connected - using HTML5 Audio mode"
					);
					if (mounted) {
						setUseSpotifySDK(false);
						setIsSpotifyReady(false);
						setDeviceId(null);
						setSpotifyToken(null);
					}
				}
			})
			.catch((error) => {
				console.error("❌ Failed to get Spotify token:", error);
				console.log("⚠️ Using HTML5 Audio mode");
				if (mounted) {
					setUseSpotifySDK(false);
					setIsSpotifyReady(false);
					setDeviceId(null);
					setSpotifyToken(null);
				}
			});

		// Cleanup при размонтировании
		return () => {
			mounted = false;
			if (spotifyPlayerRef.current) {
				console.log("🔌 Disconnecting Spotify Player");
				try {
					spotifyPlayerRef.current.disconnect();
				} catch {
					console.log("Failed to disconnect player on cleanup");
				}
				spotifyPlayerRef.current = null;
			}
		};
	}, [dispatch]);

	// Инициализация Audio
	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio();
			audioRef.current.volume = volume; // Устанавливаем начальную громкость

			// Обработчики событий
			audioRef.current.addEventListener("timeupdate", () => {
				if (audioRef.current) {
					dispatch(setCurrentTime(audioRef.current.currentTime));
				}
			});

			audioRef.current.addEventListener("loadedmetadata", () => {
				if (audioRef.current) {
					dispatch(setDuration(audioRef.current.duration));
				}
			});

			audioRef.current.addEventListener("ended", () => {
				// автоматически играем следующий трек
				console.log("🎵 HTML5 Audio: Track ended, playing next");
				dispatch(playNext());
			});

			console.log("✅ HTML5 Audio initialized");
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = "";
			}
		};
	}, [dispatch]);

	// Загрузка трека
	useEffect(() => {
		console.log("🎵 LOADING TRACK:", currentTrack);
		console.log("🎧 SDK Status:", {
			useSpotifySDK,
			isSpotifyReady,
			deviceId,
			hasToken: !!spotifyToken,
			isPlaying,
		});

		if (!currentTrack) return;

		// Сбрасываем время при загрузке нового трека
		dispatch(setCurrentTime(0));

		// ПРИОРИТЕТ: Если есть Spotify SDK и он ГОТОВ - используем для полных треков
		if (useSpotifySDK && isSpotifyReady && deviceId && spotifyToken) {
			const trackUri = `spotify:track:${currentTrack.id}`;
			console.log("🔊 Playing via Spotify SDK:", trackUri);

			playSpotifyTrack(spotifyToken, deviceId, trackUri)
				.then((success) => {
					if (success) {
						console.log("✅ Spotify track started playing!");
					} else {
						console.error("❌ Failed to start Spotify track");
						// Fallback на preview если доступен
						if (currentTrack.previewUrl && audioRef.current) {
							console.log("⚠️ Falling back to preview");
							audioRef.current.src = currentTrack.previewUrl;
							audioRef.current.load();
							audioRef.current.play().catch(console.error);
						}
					}
				})
				.catch((error) => {
					console.error("❌ Spotify playback error:", error);
					// Fallback на preview
					if (currentTrack.previewUrl && audioRef.current) {
						console.log("⚠️ Falling back to preview after error");
						audioRef.current.src = currentTrack.previewUrl;
						audioRef.current.load();
						audioRef.current.play().catch(console.error);
					}
				});
			return; // НЕ играем preview если SDK активен
		}

		// Используем HTML5 Audio для preview треков
		if (!currentTrack.previewUrl) {
			console.warn("❌ Track has NO preview URL:", currentTrack.title);
			console.log("⚠️ SDK not ready, cannot play without preview");
			return;
		}

		console.log("✅ Using preview URL:", currentTrack.previewUrl);

		if (audioRef.current) {
			audioRef.current.src = currentTrack.previewUrl;
			audioRef.current.load();

			// ВСЕГДА автоматически начинаем воспроизведение нового трека
			console.log("▶️ Auto-playing new track");
			audioRef.current
				.play()
				.then(() => {
					console.log("✅ Preview playing!");
				})
				.catch((err) => {
					console.error("❌ Failed to play preview:", err);
				});
		}
	}, [
		currentTrack,
		useSpotifySDK,
		isSpotifyReady,
		deviceId,
		spotifyToken,
		dispatch,
	]);

	// Обновление времени для Spotify SDK (SDK не отправляет timeupdate события)
	useEffect(() => {
		if (
			!useSpotifySDK ||
			!isSpotifyReady ||
			!spotifyPlayerRef.current ||
			!isPlaying
		) {
			return;
		}

		// Обновляем время каждые 100ms
		const interval = setInterval(() => {
			if (spotifyPlayerRef.current && isPlaying) {
				spotifyPlayerRef.current.getCurrentState().then((state) => {
					if (state && !state.paused) {
						dispatch(setCurrentTime(state.position / 1000));
					}
				});
			}
		}, 100);

		return () => clearInterval(interval);
	}, [useSpotifySDK, isSpotifyReady, isPlaying, dispatch]);

	// Play/Pause
	useEffect(() => {
		console.log(
			"🎮 Play/Pause changed:",
			isPlaying,
			"SDK ready:",
			useSpotifySDK && !!spotifyPlayerRef.current,
			"Has audio src:",
			!!audioRef.current?.src
		);

		// Если используем Spotify SDK
		if (useSpotifySDK && spotifyPlayerRef.current && isSpotifyReady) {
			if (isPlaying) {
				console.log("▶️ Resuming Spotify playback");
				spotifyPlayerRef.current.resume().catch((err) => {
					console.error("❌ Failed to resume Spotify:", err);
				});
			} else {
				console.log("⏸️ Pausing Spotify playback");
				spotifyPlayerRef.current.pause().catch((err) => {
					console.error("❌ Failed to pause Spotify:", err);
				});
			}
		} else if (audioRef.current && audioRef.current.src) {
			// HTML5 Audio для preview (только если есть src)
			if (isPlaying) {
				console.log("▶️ Playing preview");
				const playPromise = audioRef.current.play();
				if (playPromise !== undefined) {
					playPromise.catch((err) => {
						// Игнорируем AbortError (трек сменился)
						if (err.name !== "AbortError") {
							console.error("❌ Failed to play preview:", err);
						}
					});
				}
			} else {
				console.log("⏸️ Pausing preview");
				audioRef.current.pause();
			}
		}
	}, [isPlaying, useSpotifySDK, isSpotifyReady]);

	// Громкость
	useEffect(() => {
		console.log("🔊 Volume changed:", volume);
		if (audioRef.current) {
			audioRef.current.volume = volume;
			console.log("✅ Volume applied to audio:", audioRef.current.volume);
		}
		if (useSpotifySDK && spotifyPlayerRef.current) {
			spotifyPlayerRef.current.setVolume(volume).catch(console.error);
		}
	}, [volume, useSpotifySDK]);

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!duration) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const percent = (e.clientX - rect.left) / rect.width;
		const newTime = percent * duration;

		// Если используем Spotify SDK
		if (useSpotifySDK && spotifyPlayerRef.current) {
			spotifyPlayerRef.current
				.seek(Math.floor(newTime * 1000))
				.catch((err) => console.error("Failed to seek Spotify:", err));
		} else if (audioRef.current) {
			// HTML5 Audio для preview
			audioRef.current.currentTime = newTime;
		}

		dispatch(setCurrentTime(newTime));
	};

	const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const percent = (e.clientX - rect.left) / rect.width;
		dispatch(setVolume(percent));

		// Синхронизируем громкость с Spotify SDK
		if (useSpotifySDK && spotifyPlayerRef.current) {
			spotifyPlayerRef.current.setVolume(percent).catch(console.error);
		}
	};

	const formatTime = (seconds: number) => {
		if (!seconds || isNaN(seconds)) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Полностью скрываем Player если нет трека
	if (!currentTrack) {
		return null;
	}

	return (
		<>
			<footer className="fixed bottom-0 left-56 right-0 z-50 h-14 bg-black/80 backdrop-blur-md border-t border-white/10 px-3 flex items-center justify-between gap-4">
				{/* track info + progress слева */}
				<div className="flex items-center gap-3 flex-1 max-w-xl">
					<div className="w-10 h-10 bg-gray-800 shrink-0 cursor-pointer">
						<Image
							src={currentTrack.coverUrl}
							alt={currentTrack.title}
							width={40}
							height={40}
						/>
					</div>
					<div className="min-w-0 flex-1 flex items-center gap-2">
						{/* название и артист */}
						<div className="flex items-center gap-2 shrink-0 min-w-0 max-w-[240px]">
							<p className="text-sm font-medium text-white truncate">
								{currentTrack.title}
							</p>
							<span className="text-sm text-gray-500 shrink-0">•</span>
							{currentTrack.artistId ? (
								<button
									onClick={(e) => {
										e.stopPropagation();
										router.push(
											`/${locale}/artist/${currentTrack.artistId}`
										);
									}}
									className="text-sm text-gray-400 hover:text-white hover:underline transition cursor-pointer truncate"
								>
									{currentTrack.artist}
								</button>
							) : (
								<p className="text-sm text-gray-400 truncate">
									{currentTrack.artist}
								</p>
							)}
						</div>
						
						{/* лайк */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								toggle();
							}}
							className="text-gray-500 hover:text-white transition shrink-0 cursor-pointer"
						>
							<svg
								className={`w-4 h-4 ${
									isLiked
										? "fill-purple-500"
										: "fill-none"
								}`}
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
							>
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
							</svg>
						</button>
						
						{/* progress bar */}
						<div className="flex items-center gap-1.5 flex-1 min-w-0">
							<span className="text-xs text-gray-500 shrink-0 w-10 text-right">
								{formatTime(currentTime)}
							</span>
							<div
								className="flex-1 h-1 bg-gray-800 overflow-hidden group cursor-pointer hover:h-1.5 transition-all"
								onClick={handleProgressClick}
							>
								<div
									className="h-full bg-gray-400 group-hover:bg-purple-500 transition-colors"
									style={{
										width: `${
											duration > 0
												? (currentTime / duration) * 100
												: 0
										}%`,
									}}
								></div>
							</div>
							<span className="text-xs text-gray-500 shrink-0 w-10 text-left">
								{formatTime(duration)}
							</span>
						</div>
					</div>
				</div>

				{/* player controls по центру */}
				<div className="flex items-center gap-2 justify-center">
					{/* shuffle */}
					<button
						onClick={() => dispatch(toggleShuffle())}
						className={`transition shrink-0 cursor-pointer ${
							shuffle
								? "text-purple-500"
								: "text-gray-500 hover:text-white"
						}`}
						title={t("shuffle")}
					>
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
						</svg>
					</button>

					{/* previous */}
					<button
						onClick={() => {
							console.log("⏮️ Previous button clicked");
							// Если прошло больше 3 секунд - перемотать в начало, иначе предыдущий трек
							if (currentTime > 3) {
								dispatch(setCurrentTime(0));
								if (audioRef.current) {
									audioRef.current.currentTime = 0;
								}
								// Для Spotify SDK тоже перематываем в начало
								if (useSpotifySDK && spotifyPlayerRef.current) {
									spotifyPlayerRef.current
										.seek(0)
										.catch(console.error);
								}
							} else {
								// Используем Redux очередь для переключения треков
								dispatch(playPrevious());
							}
						}}
						className="text-gray-500 hover:text-white transition shrink-0 cursor-pointer"
						title={t("previous")}
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
						</svg>
					</button>

					{/* play/pause */}
					<button
						onClick={() => {
							// Если есть Spotify SDK, всегда используем его
							if (useSpotifySDK && isSpotifyReady && deviceId) {
								dispatch(togglePlayPause());
								return;
							}

							// Если нет preview, открываем в Spotify только если нет SDK
							if (!currentTrack.previewUrl && !useSpotifySDK) {
								window.open(
									`https://open.spotify.com/track/${currentTrack.id}`,
									"_blank"
								);
								return;
							}

							dispatch(togglePlayPause());
						}}
						className="w-8 h-8 bg-white hover:bg-gray-100 transition flex items-center justify-center shrink-0 cursor-pointer"
						title={
							useSpotifySDK || currentTrack.previewUrl
								? isPlaying
									? t("pause")
									: t("play")
								: "Open in Spotify"
						}
					>
						{isPlaying ? (
							<svg
								className="w-4 h-4 text-black"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							</svg>
						) : (
							<svg
								className="w-4 h-4 text-black ml-0.5"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
						)}
					</button>

					{/* next */}
					<button
						onClick={() => {
							console.log("⏭️ Next button clicked");
							// Всегда используем Redux очередь для переключения треков
							console.log("🔊 Playing next from queue");
							dispatch(playNext());
						}}
						className="text-gray-500 hover:text-white transition shrink-0 cursor-pointer"
						title={t("next")}
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
						</svg>
					</button>

					{/* repeat */}
					<button
						onClick={() => dispatch(toggleRepeat())}
						className={`transition shrink-0 cursor-pointer ${
							repeat !== "off"
								? "text-purple-500"
								: "text-gray-500 hover:text-white"
						}`}
						title={t("repeat")}
					>
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
						</svg>
						{repeat === "one" && (
							<span className="absolute top-0 right-0 text-xs">
								1
							</span>
						)}
					</button>
				</div>

				{/* volume controls */}
				<div className="flex items-center gap-1.5 w-40 justify-end shrink-0">
					<button
						onClick={() => {
							if (volume === 0) {
								// Размутить: вернуть предыдущий уровень
								dispatch(setVolume(previousVolume));
							} else {
								// Замутить: сохранить текущий уровень и поставить 0
								setPreviousVolume(volume);
								dispatch(setVolume(0));
							}
						}}
						className="text-gray-500 hover:text-white transition shrink-0 cursor-pointer"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							{volume === 0 ? (
								<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
							) : (
								<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
							)}
						</svg>
					</button>
					<div
						className="w-20 h-2 bg-gray-800 overflow-hidden group cursor-pointer hover:h-3 transition-all"
						onClick={handleVolumeClick}
					>
						<div
							className="h-full bg-gray-400 group-hover:bg-purple-500 transition-colors"
							style={{ width: `${volume * 100}%` }}
						></div>
					</div>
				</div>
			</footer>
		</>
	);
};
