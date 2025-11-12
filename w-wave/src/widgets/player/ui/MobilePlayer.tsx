"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { usePlayerState, usePlayerControls } from "../model";
import { FullScreenPlayer } from "./FullScreenPlayer";

type MobilePlayerProps = {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
};

const MobilePlayerComponent = ({
	currentTime,
	duration,
	onSeek,
}: MobilePlayerProps) => {
	const t = useTranslations("player");
	const [showFullScreen, setShowFullScreen] = useState(false);
	const { currentTrack, isPlaying } = usePlayerState();
	const {
		playPrevious: onPlayPrevious,
		togglePlayPause: onTogglePlayPause,
		playNext: onPlayNext,
	} = usePlayerControls();

	const playButtonLabel = isPlaying ? t("pause") : t("play");

	const progressPercent = useMemo(() => {
		if (!duration) {
			return 0;
		}
		return Math.min(100, Math.max(0, (currentTime / duration) * 100));
	}, [currentTime, duration]);

	if (!currentTrack) {
		return null;
	}

	return (
		<>
			{/* player bar */}
			<div className="lg:hidden fixed bottom-16 left-0 right-0 z-50 bg-black border-t border-white/10">
				<div className="h-1 bg-gray-800 relative" aria-hidden="true">
					<div
						className="h-full bg-purple-500 transition-[width] duration-150"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>

				{/* content */}
				<div
					className="flex items-center gap-3 px-3 py-2 cursor-pointer"
					onClick={() => setShowFullScreen(true)}
					aria-label={t("nowPlaying")}
				>
					<div className="flex items-center gap-3 flex-1 min-w-0">
						<div className="w-12 h-12 bg-gray-800 shrink-0">
							<Image
								src={currentTrack.coverUrl}
								alt={currentTrack.title}
								width={48}
								height={48}
								className="object-cover"
								sizes="48px"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-white truncate">
								{currentTrack.title}
							</p>
							<p className="text-xs text-gray-400 truncate">
								{currentTrack.artist}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<button
							onClick={(event) => {
								event.stopPropagation();
								onPlayPrevious();
							}}
							className="p-2 text-white"
							aria-label={t("previous")}
						>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
							</svg>
						</button>

						<button
							onClick={(event) => {
								event.stopPropagation();
								onTogglePlayPause();
							}}
							className="w-8 h-8 bg-white flex items-center justify-center transition hover:scale-105"
							aria-label={playButtonLabel}
							title={playButtonLabel}
						>
							{isPlaying ? (
								<svg
									className="w-5 h-5 text-black"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
								</svg>
							) : (
								<svg
									className="w-5 h-5 text-black ml-0.5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							)}
						</button>

						<button
							onClick={(event) => {
								event.stopPropagation();
								onPlayNext();
							}}
							className="p-2 text-white"
							aria-label={t("next")}
						>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* full-screen player */}
			<FullScreenPlayer
				isOpen={showFullScreen}
				onClose={() => setShowFullScreen(false)}
				currentTime={currentTime}
				duration={duration}
				onSeek={onSeek}
			/>
		</>
	);
};

export const MobilePlayer = memo(MobilePlayerComponent);
MobilePlayer.displayName = "MobilePlayer";
