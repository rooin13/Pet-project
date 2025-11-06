"use client";

import Image from "next/image";
import { Playlist } from "../model";

interface PlaylistCardProps {
	playlist: Playlist;
	onClick?: () => void;
}

export function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
	return (
		<div
			className="group relative bg-gray-800/50 hover:bg-gray-800 transition p-4 rounded-lg cursor-pointer"
			onClick={onClick}
		>
			{/* playlist cover */}
			<div className="relative w-full aspect-square mb-3 rounded overflow-hidden">
				<Image
					src={playlist.coverUrl || "/img/placeholder.png"}
					alt={playlist.title}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
				/>
			</div>

			{/* playlist info */}
			<h3
				className="text-white font-medium truncate mb-1"
				title={playlist.title}
			>
				{playlist.title}
			</h3>
			<p
				className="text-gray-400 text-sm truncate"
				title={playlist.owner}
			>
				By {playlist.owner}
			</p>
			<p className="text-gray-500 text-xs mt-1">
				{playlist.tracksCount} tracks
			</p>
		</div>
	);
}
