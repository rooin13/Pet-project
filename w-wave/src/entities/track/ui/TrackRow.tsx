"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface TrackRowProps {
	title: string;
	artist: string;
	artistId?: string;
	coverUrl?: string;
	durationMs?: number;
	index?: number;
	onClick?: () => void;
	onArtistClick?: () => void;
	onPlayOverlay?: () => void;
	actions?: ReactNode;
	className?: string;
}

const FALLBACK_COVER = "/img/placeholder.png";

const formatDuration = (ms?: number) => {
	if (!ms) {
		return "0:00";
	}
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000)
		.toString()
		.padStart(2, "0");
	return `${minutes}:${seconds}`;
};

export function TrackRow({
	title,
	artist,
	artistId,
	coverUrl,
	durationMs,
	index,
	onClick,
	onArtistClick,
	onPlayOverlay,
	actions,
	className,
}: TrackRowProps) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"group flex items-center gap-3 rounded border border-white/10 bg-white/5 pl-2 pr-3 py-2 backdrop-blur-sm transition",
				onClick &&
					"cursor-pointer hover:bg-white/10 hover:border-white/20",
				className
			)}
		>
			{typeof index === "number" && (
				<span className="hidden sm:block w-6 text-center text-xs text-gray-400 tabular-nums">
					{index + 1}
				</span>
			)}
			<div className="relative w-10 h-10 shrink-0 overflow-hidden rounded bg-gray-800">
				<Image
					src={coverUrl || FALLBACK_COVER}
					alt={title}
					fill
					sizes="40px"
					className="object-cover"
				/>
				{onPlayOverlay && (
					<button
						onClick={(event) => {
							event.stopPropagation();
							onPlayOverlay?.();
						}}
						className="absolute inset-0 flex items-center justify-center bg-black/65 opacity-0 transition group-hover:opacity-100"
						aria-label="Play track"
					>
						<svg
							className="w-5 h-5 text-white"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					</button>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<p
					className="text-sm font-medium text-white truncate"
					title={title}
				>
					{title}
				</p>
				{artistId && onArtistClick ? (
					<button
						onClick={(event) => {
							event.stopPropagation();
							onArtistClick?.();
						}}
						className="text-xs text-gray-400 hover:text-white hover:underline transition truncate"
						title={artist}
					>
						{artist}
					</button>
				) : (
					<p
						className="text-xs text-gray-400 truncate"
						title={artist}
					>
						{artist}
					</p>
				)}
			</div>
			<div className="ml-auto flex items-center gap-2">
				{actions && (
					<div className="flex items-center gap-2">{actions}</div>
				)}
				{durationMs !== undefined && (
					<span className="text-xs text-gray-400 tabular-nums">
						{formatDuration(durationMs)}
					</span>
				)}
			</div>
		</div>
	);
}
