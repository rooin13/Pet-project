"use client";

import Image from "next/image";
import { Track } from "../model";

interface TrackRowProps {
	track: Track;
	index: number;
	onPlay?: () => void;
}

// format duration from ms to MM:SS
function formatDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TrackRow({ track, index, onPlay }: TrackRowProps) {
	return (
		<div
			className="grid grid-cols-[40px_1fr_auto] gap-4 items-center p-2 hover:bg-white/5 rounded cursor-pointer group"
			onClick={onPlay}
		>
			{/* index */}
			<span className="text-gray-400 text-sm text-right tabular-nums">
				{index + 1}
			</span>

			{/* track info */}
			<div className="flex items-center gap-3 min-w-0">
				<div className="relative w-10 h-10 shrink-0 rounded overflow-hidden">
					<Image
						src={track.coverUrl || "/img/placeholder.png"}
						alt={track.title}
						fill
						className="object-cover"
						sizes="40px"
					/>
				</div>
				<div className="min-w-0 flex-1">
					<p
						className="text-white font-medium truncate"
						title={track.title}
					>
						{track.title}
					</p>
					<p
						className="text-gray-400 text-sm truncate"
						title={track.artist}
					>
						{track.artist}
					</p>
				</div>
			</div>

			{/* duration */}
			<span className="text-gray-400 text-sm tabular-nums">
				{formatDuration(track.duration)}
			</span>
		</div>
	);
}
