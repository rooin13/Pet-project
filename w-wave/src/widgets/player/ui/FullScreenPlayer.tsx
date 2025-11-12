"use client";

import {
	memo,
	useCallback,
	useEffect,
	useMemo,
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
} from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { AddToPlaylistMenuEnhanced } from "@/features/music";
import { usePlayerState, usePlayerControls } from "../model";
import { formatTime } from "../lib/formatTime";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";

type FullScreenPlayerProps = {
	isOpen: boolean;
	onClose: () => void;
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
};

const SEEK_STEP_SECONDS = 5;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const FullScreenPlayerComponent = ({
	isOpen,
	onClose,
	currentTime,
	duration,
	onSeek,
}: FullScreenPlayerProps) => {
	const t = useTranslations("player");
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;

	const { currentTrack, isPlaying, shuffle, repeat } = usePlayerState();
	const {
		toggleShuffle: onToggleShuffle,
		toggleRepeat: onToggleRepeat,
		playNext: onPlayNext,
		playPrevious: onPlayPrevious,
		togglePlayPause: onTogglePlayPause,
	} = usePlayerControls();

	const progressPercent = useMemo(() => {
		if (!duration) {
			return 0;
		}
		return clamp((currentTime / duration) * 100, 0, 100);
	}, [currentTime, duration]);

	const handleProgressClick = useCallback(
		(event: ReactMouseEvent<HTMLDivElement>) => {
			const rect = event.currentTarget.getBoundingClientRect();
			const percent = (event.clientX - rect.left) / rect.width;
			const nextTime = percent * duration;

			onSeek(nextTime);
		},
		[duration, onSeek]
	);

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

	const handlePrevious = useCallback(() => {
		if (currentTime > 3) {
			onSeek(0);
			return;
		}

		onPlayPrevious();
	}, [currentTime, onPlayPrevious, onSeek]);

	const shouldRender = isOpen && currentTrack;

	useEffect(() => {
		if (!shouldRender) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [shouldRender]);

	return (
		<AnimatePresence>
			{shouldRender && (
				<motion.div
					className="fixed inset-x-0 top-0 bottom-16 z-100"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.button
						type="button"
						className="absolute inset-x-0 top-0 bottom-0 w-full bg-black/80"
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						aria-label={t("close")}
					/>

					<motion.div
						className="absolute inset-x-0 top-0 bottom-0 flex flex-col bg-black"
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{
							type: "spring",
							stiffness: 360,
							damping: 40,
						}}
						drag="y"
						dragDirectionLock
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={0.15}
						onDragEnd={(
							_event: MouseEvent | TouchEvent | PointerEvent,
							info: PanInfo
						) => {
							if (info.offset.y > 120 || info.velocity.y > 800) {
								onClose();
							}
						}}
						role="dialog"
						aria-modal="true"
						aria-label={t("nowPlaying")}
					>
						<div className="flex items-center justify-center pt-4 pb-4">
							<div className="h-1.5 w-14 rounded-full bg-white/20" />
						</div>
						<div className="flex-1 flex flex-col px-6">
							<div className="flex-1 flex items-center justify-center">
								<div className="w-full max-w-sm aspect-square relative overflow-hidden rounded-2xl">
									<Image
										src={currentTrack.coverUrl}
										alt={currentTrack.title}
										fill
										sizes="(max-width: 768px) 85vw, 50vw"
										className="object-cover"
										priority
									/>
								</div>
							</div>
							<div className="w-full max-w-sm mx-auto pb-14 flex flex-col gap-6">
								<div className="text-center">
									<h1 className="text-2xl font-bold text-white mb-2 truncate">
										{currentTrack.title}
									</h1>
									{currentTrack.artistId ? (
										<button
											onClick={() => {
												router.push(
													`/${locale}/artist/${currentTrack.artistId}`
												);
												onClose();
											}}
											className="text-gray-400 hover:text-white hover:underline transition block truncate"
											aria-label={currentTrack.artist}
										>
											{currentTrack.artist}
										</button>
									) : (
										<p className="text-gray-400 truncate">
											{currentTrack.artist}
										</p>
									)}
								</div>
								<div>
									<div
										className="w-full h-1.5 rounded-full bg-gray-800 cursor-pointer mb-2"
										onClick={handleProgressClick}
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
											className="h-full bg-white transition-[width] duration-150"
											style={{
												width: `${progressPercent}%`,
											}}
											aria-hidden="true"
										/>
									</div>
									<div className="flex justify-between text-xs text-gray-400 tabular-nums">
										<span>{formatTime(currentTime)}</span>
										<span>{formatTime(duration)}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<button
										onClick={onToggleShuffle}
										className={`p-3 transition ${
											shuffle
												? "text-purple-500"
												: "text-gray-400 hover:text-white"
										}`}
										aria-label={t("shuffle")}
										title={t("shuffle")}
									>
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
										</svg>
									</button>

									<button
										onClick={handlePrevious}
										className="p-3 text-white hover:scale-110 transition"
										aria-label={t("previous")}
										title={t("previous")}
									>
										<svg
											className="w-8 h-8"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
										</svg>
									</button>

									<button
										onClick={onTogglePlayPause}
										className="w-16 h-16 bg-white hover:scale-105 transition flex items-center justify-center rounded-full"
										aria-label={
											isPlaying ? t("pause") : t("play")
										}
										title={
											isPlaying ? t("pause") : t("play")
										}
									>
										{isPlaying ? (
											<svg
												className="w-8 h-8 text-black"
												fill="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
											</svg>
										) : (
											<svg
												className="w-8 h-8 text-black ml-1"
												fill="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path d="M8 5v14l11-7z" />
											</svg>
										)}
									</button>

									<button
										onClick={onPlayNext}
										className="p-3 text-white hover:scale-110 transition"
										aria-label={t("next")}
										title={t("next")}
									>
										<svg
											className="w-8 h-8"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
										</svg>
									</button>

									<button
										onClick={onToggleRepeat}
										className={`p-3 transition ${
											repeat !== "off"
												? "text-purple-500"
												: "text-gray-400 hover:text-white"
										}`}
										aria-label={t("repeat")}
										title={t("repeat")}
									>
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
										</svg>
									</button>
								</div>
								<div
									onClick={(event) => event.stopPropagation()}
									aria-label={t("addToPlaylist")}
									title={t("addToPlaylist")}
									className="flex items-center justify-center"
								>
									<AddToPlaylistMenuEnhanced
										trackId={currentTrack.id}
										trackData={currentTrack}
									/>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const FullScreenPlayer = memo(FullScreenPlayerComponent);
FullScreenPlayer.displayName = "FullScreenPlayer";
