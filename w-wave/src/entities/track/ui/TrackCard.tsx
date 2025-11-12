"use client";

import Image from "next/image";
import { Track } from "../model";

interface TrackCardProps {
	track: Track;
	onClick?: () => void;
}

export function TrackCard({ track, onClick }: TrackCardProps) {
	return (
		<div
			className="group relative bg-gray-800/50 hover:bg-gray-800 transition p-4 rounded-lg cursor-pointer"
			onClick={onClick}
		>
			{/* cover image */}
			<div className="relative w-full aspect-square mb-3 rounded overflow-hidden">
				<Image
					src={track.coverUrl || "/img/placeholder.png"}
					alt={track.title}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
				/>
			</div>

			{/* track info */}
			<h3
				className="text-white font-medium truncate mb-1"
				title={track.title}
			>
				{track.title}
			</h3>
			<p className="text-gray-400 text-sm truncate" title={track.artist}>
				{track.artist}
			</p>
		</div>
	);
}
