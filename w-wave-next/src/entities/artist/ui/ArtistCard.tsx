"use client";

import Image from "next/image";
import { Artist } from "../model";

interface ArtistCardProps {
	artist: Artist;
	onClick?: () => void;
}

export function ArtistCard({ artist, onClick }: ArtistCardProps) {
	return (
		<div
			className="group relative bg-gray-800/50 hover:bg-gray-800 transition p-4 rounded-lg cursor-pointer"
			onClick={onClick}
		>
			{/* artist image */}
			<div className="relative w-full aspect-square mb-3 rounded-full overflow-hidden">
				<Image
					src={artist.imageUrl || "/img/placeholder.png"}
					alt={artist.name}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
				/>
			</div>

			{/* artist info */}
			<h3
				className="text-white font-medium truncate text-center mb-1"
				title={artist.name}
			>
				{artist.name}
			</h3>
			<p className="text-gray-400 text-sm text-center">Artist</p>
		</div>
	);
}
