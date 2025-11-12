"use client";

import {
	memo,
	useCallback,
	useMemo,
	type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { usePlayerController } from "../model";
import { formatTime } from "../lib/formatTime";
import { useToggleLike } from "@/features/music";
import { MobilePlayer } from "@/widgets/player/ui/MobilePlayer";

const SEEK_STEP_SECONDS = 5;
const VOLUME_STEP = 0.05;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const PlayerComponent = () => {
	const t = useTranslations("player");
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;

	const {
		state: {
			currentTrack,
			isPlaying,
			volume,
			currentTime,
			duration,
			shuffle,
			repeat,
		},
		canPlayDirectly,
		handlers: {
			onSeek,
			onProgressClick,
			onVolumeClick,
			onSetVolume,
			onToggleMute,
			onToggleShuffle,
			onPrevious,
			onTogglePlay,
			onNext,
			onToggleRepeat,
		},
	} = usePlayerController();

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

	const playButtonTitle = canPlayDirectly
		? isPlaying
			? t("pause")
			: t("play")
		: t("openInSpotify");

	const libraryActionLabel = isLiked
		? t("removeFromLibrary")
		: t("addToLibrary");

	const progressPercent = useMemo(() => {
		if (!duration) {
			return 0;
		}
		return clamp((currentTime / duration) * 100, 0, 100);
	}, [currentTime, duration]);

	const volumePercent = useMemo(() => clamp(volume * 100, 0, 100), [volume]);

	const handleProgressKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLDivElement>) => {
			if (!duration) {
				return;
			}

			if (event.key === "ArrowLeft") {
				event.preventDefault();
				onSeek(clamp(currentTime - SEEK_STEP_SECONDS, 0, duration));
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				onSeek(clamp(currentTime + SEEK_STEP_SECONDS, 0, duration));
			} else if (event.key === "Home") {
				event.preventDefault();
				onSeek(0);
			} else if (event.key === "End") {
				event.preventDefault();
				onSeek(duration);
			}
		},
		[currentTime, duration, onSeek]
	);

	const handleVolumeKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLDivElement>) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				onSetVolume(clamp(volume - VOLUME_STEP, 0, 1));
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				onSetVolume(clamp(volume + VOLUME_STEP, 0, 1));
			} else if (event.key === "Home") {
				event.preventDefault();
				onSetVolume(0);
			} else if (event.key === "End") {
				event.preventDefault();
				onSetVolume(1);
			}
		},
		[onSetVolume, volume]
	);

	if (!currentTrack) {
		return null;
	}

	return (
		<>
			<footer className="hidden lg:flex fixed bottom-0 left-56 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-t border-white/10 px-4 items-center justify-between gap-4">
				{/* track section */}
				<div className="flex items-center gap-3 flex-1">
					<div className="w-10 h-10 bg-gray-800 shrink-0 overflow-hidden rounded cursor-pointer">
						<Image
							src={currentTrack.coverUrl}
							alt={currentTrack.title}
							width={40}
							height={40}
							priority
						/>
					</div>
					<div className="min-w-0 flex-1 flex items-center gap-3">
						<div className="flex flex-col shrink-0 min-w-0 w-40">
							<p
								className="text-sm font-medium text-white truncate"
								title={currentTrack.title}
							>
								{currentTrack.title}
							</p>
							{currentTrack.artistId ? (
								<button
									onClick={(event) => {
										event.stopPropagation();
										router.push(
											`/${locale}/artist/${currentTrack.artistId}`
										);
									}}
									className="text-xs text-gray-400 hover:text-white hover:underline transition truncate text-left"
									title={currentTrack.artist}
								>
									{currentTrack.artist}
								</button>
							) : (
								<p
									className="text-xs text-gray-400 truncate"
									title={currentTrack.artist}
								>
									{currentTrack.artist}
								</p>
							)}
						</div>

						<button
							onClick={(event) => {
								event.stopPropagation();
								toggle();
							}}
							className="text-gray-500 hover:text-white transition shrink-0"
							aria-label={libraryActionLabel}
							title={libraryActionLabel}
						>
							<svg
								className={`w-4 h-4 ${
									isLiked ? "fill-purple-500" : "fill-none"
								}`}
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								aria-hidden="true"
							>
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
							</svg>
						</button>

						<div className="flex items-center gap-1.5 flex-1 min-w-0">
							<span className="text-xs text-gray-500 shrink-0 w-12 text-right tabular-nums">
								{formatTime(currentTime)}
							</span>
							<div
								className="flex-1 h-1.5 bg-gray-800 overflow-hidden group cursor-pointer hover:h-2 transition-[height] duration-150"
								onClick={onProgressClick}
								role="slider"
								tabIndex={0}
								aria-label={t("progress")}
								aria-valuemin={0}
								aria-valuemax={duration}
								aria-valuenow={currentTime}
								aria-valuetext={`${formatTime(
									currentTime
								)} / ${formatTime(duration)}`}
								onKeyDown={handleProgressKeyDown}
							>
								<div
									className="h-full bg-gray-400 group-hover:bg-purple-500 transition-colors"
									style={{ width: `${progressPercent}%` }}
									aria-hidden="true"
								></div>
							</div>
							<span className="text-xs text-gray-500 shrink-0 w-12 text-left tabular-nums">
								{formatTime(duration)}
							</span>
						</div>
					</div>
				</div>

				{/* playback controls */}
				<div className="flex items-center gap-3 justify-center">
					<button
						onClick={onToggleShuffle}
						className={`transition shrink-0 ${
							shuffle
								? "text-purple-500"
								: "text-gray-500 hover:text-white"
						}`}
						title={t("shuffle")}
						aria-label={t("shuffle")}
					>
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
						</svg>
					</button>

					<button
						onClick={onPrevious}
						className="text-gray-500 hover:text-white transition shrink-0"
						title={t("previous")}
						aria-label={t("previous")}
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
						</svg>
					</button>

					<button
						onClick={onTogglePlay}
						className="w-8 h-8 bg-white hover:bg-gray-100 transition flex items-center justify-center shrink-0"
						title={playButtonTitle}
						aria-label={playButtonTitle}
					>
						{isPlaying ? (
							<svg
								className="w-4 h-4 text-black"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							</svg>
						) : (
							<svg
								className="w-4 h-4 text-black ml-0.5"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
						)}
					</button>

					<button
						onClick={onNext}
						className="text-gray-500 hover:text-white transition shrink-0"
						title={t("next")}
						aria-label={t("next")}
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
						</svg>
					</button>

					<button
						onClick={onToggleRepeat}
						className={`relative transition shrink-0 ${
							repeat !== "off"
								? "text-purple-500"
								: "text-gray-500 hover:text-white"
						}`}
						title={t("repeat")}
						aria-label={t("repeat")}
					>
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
						</svg>
						{repeat === "one" && (
							<span className="absolute -top-1 -right-1 text-[10px]">
								1
							</span>
						)}
					</button>
				</div>

				{/* volume */}
				<div className="flex items-center gap-1.5 w-40 justify-end shrink-0">
					<button
						onClick={onToggleMute}
						className="text-gray-500 hover:text-white transition shrink-0"
						title={volume === 0 ? t("unmute") : t("mute")}
						aria-label={volume === 0 ? t("unmute") : t("mute")}
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							{volume === 0 ? (
								<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
							) : (
								<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
							)}
						</svg>
					</button>
					<div
						className="w-20 h-1.5 bg-gray-800 overflow-hidden group cursor-pointer hover:h-2 transition-[height] duration-150"
						onClick={onVolumeClick}
						role="slider"
						tabIndex={0}
						aria-label={t("volumeControl")}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(volumePercent)}
						aria-valuetext={`${Math.round(volumePercent)}%`}
						onKeyDown={handleVolumeKeyDown}
					>
						<div
							className="h-full bg-gray-400 group-hover:bg-purple-500 transition-colors"
							style={{ width: `${volumePercent}%` }}
							aria-hidden="true"
						></div>
					</div>
				</div>
			</footer>

			<MobilePlayer
				currentTime={currentTime}
				duration={duration}
				onSeek={onSeek}
			/>
		</>
	);
};

export const Player = memo(PlayerComponent);
Player.displayName = "Player";
