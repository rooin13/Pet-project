"use client";

import Image from "next/image";
import { Album } from "../model";

interface AlbumCardProps {
	album: Album;
	onClick?: () => void;
}

export function AlbumCard({ album, onClick }: AlbumCardProps) {
	return (
		<div
			className="group relative bg-gray-800/50 hover:bg-gray-800 transition p-4 rounded-lg cursor-pointer"
			onClick={onClick}
		>
			{/* album cover */}
			<div className="relative w-full aspect-square mb-3 rounded overflow-hidden">
				<Image
					src={album.imageUrl || "/img/placeholder.png"}
					alt={album.name}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
				/>
			</div>

			{/* album info */}
			<h3
				className="text-white font-medium truncate mb-1"
				title={album.name}
			>
				{album.name}
			</h3>
			<p className="text-gray-400 text-sm truncate" title={album.artist}>
				{album.artist}
			</p>
			<p className="text-gray-500 text-xs mt-1">
				{album.releaseDate?.split("-")[0]} • {album.totalTracks} tracks
			</p>
		</div>
	);
}
