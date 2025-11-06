"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { usePlayTrack } from "@/features/music";

type Artist = {
	id: string;
	name: string;
	imageUrl: string | null;
	genres: string[];
	followers: number;
};

type Track = {
	id: string;
	title: string;
	artist: string;
	artistId?: string;
	album?: string;
	coverUrl: string;
	previewUrl: string | null;
	duration: number;
};

export default function ArtistPageClient({ artistId }: { artistId: string }) {
	const router = useRouter();
	const { playTrack } = usePlayTrack();

	const dataPromise = fetch(`/api/artist/${artistId}`).then((res) =>
		res.json()
	);
	const data = use(dataPromise);

	if (!data.artist) {
		return (
			<SpotifyLayout>
				<div className="flex items-center justify-center h-96">
					<p className="text-white">Artist not found</p>
				</div>
			</SpotifyLayout>
		);
	}

	const artist: Artist = data.artist;
	const topTracks: Track[] = data.topTracks || [];

	const handleTrackClick = (track: Track, index: number) => {
		playTrack(track, topTracks.slice(index + 1));
	};

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const truncateTitle = (title: string, maxLength: number = 30) => {
		if (title.length <= maxLength) return title;
		return title.slice(0, maxLength) + "...";
	};

	return (
		<SpotifyLayout>
			{/* hero section with background image */}
			<div className="relative h-[260px]">
				{/* background with gradient */}
				<div className="absolute inset-0 overflow-hidden">
					{artist.imageUrl ? (
						<div className="absolute inset-0">
							<Image
								src={artist.imageUrl}
								alt=""
								fill
								sizes="100vw"
								className="object-cover blur-3xl opacity-40 scale-110"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-black/80 to-black"></div>
						</div>
					) : (
						<div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-black/80 to-black"></div>
					)}
				</div>

				{/* artist header */}
				<div className="relative z-10 flex items-end gap-6 px-8 py-4">
					{/* artist image */}
					<div className="w-52 h-52 shrink-0 rounded-full overflow-hidden bg-gray-800 shadow-2xl">
						{artist.imageUrl ? (
							<Image
								src={artist.imageUrl}
								alt={artist.name}
								width={208}
								height={208}
								className="w-full h-full object-cover"
								priority
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-6xl text-gray-600">
								🎤
							</div>
						)}
					</div>

					{/* artist info */}
					<div className="flex-1 min-w-0 pb-3">
						<p className="text-sm font-semibold mb-2 text-white/90">
							Artist
						</p>
						<h1
							className="text-6xl font-black mb-6 text-white truncate cursor-pointer hover:underline"
							onClick={() => router.push(`/artist/${artist.id}`)}
							title={artist.name}
						>
							{artist.name}
						</h1>
						<div className="flex items-center gap-2 text-sm text-white/90">
							<span className="font-semibold">
								{artist.followers?.toLocaleString() || 0}{" "}
								followers
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* content */}
			<div className="bg-gradient-to-b from-black/40 to-black min-h-screen">
				{/* top tracks */}
				{topTracks.length > 0 && (
					<section>
						<div>
							{topTracks.map((track, index) => (
								<div
									key={track.id}
									onClick={() =>
										handleTrackClick(track, index)
									}
									className="group flex items-center gap-4 px-8 py-3 hover:bg-white/10 transition cursor-pointer"
								>
									<span className="text-gray-400 text-sm font-medium w-6 text-right">
										{index + 1}
									</span>

									<div className="w-12 h-12 bg-gray-800 shrink-0 relative">
										{track.coverUrl && (
											<Image
												src={track.coverUrl}
												alt={track.title}
												fill
												sizes="48px"
												className="object-cover"
											/>
										)}
									</div>

									<div className="flex-1 min-w-0">
										<p
											className="text-white font-medium"
											title={track.title}
										>
											{truncateTitle(track.title)}
										</p>
										<p className="text-sm text-gray-400">
											{track.album || "Single"}
										</p>
									</div>

									<span className="text-sm text-gray-400 tabular-nums">
										{formatDuration(track.duration)}
									</span>
								</div>
							))}
						</div>
					</section>
				)}
			</div>
		</SpotifyLayout>
	);
}
