"use client";

import { use, useState, useEffect } from "react";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { usePlayTrack } from "@/features/music";
import { useToggleLike, AddToPlaylistMenuEnhanced } from "@/features/music";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Artist = {
	id: string;
	name: string;
	imageUrl: string;
	genres: string[];
	popularity: number;
	followers: number;
};

type Track = {
	id: string;
	title: string;
	artist: string;
	artistId?: string;
	album: string;
	albumId?: string;
	coverUrl: string;
	previewUrl: string | null;
	duration: number;
	popularity?: number;
};

type Album = {
	id: string;
	name: string;
	imageUrl: string;
	releaseDate: string;
	totalTracks: number;
};

export default function ArtistPage({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) {
	const { id, locale } = use(params);
	const router = useRouter();
	const [artist, setArtist] = useState<Artist | null>(null);
	const [topTracks, setTopTracks] = useState<Track[]>([]);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { playTrack } = usePlayTrack();

	useEffect(() => {
		const fetchArtistData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`/api/artist/${id}`);
				if (!response.ok) throw new Error("Failed to fetch artist");
				const data = await response.json();
				setArtist(data.artist);
				setTopTracks(data.topTracks || []);
				setAlbums(data.albums || []);
			} catch (error) {
				console.error("Failed to load artist:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchArtistData();
	}, [id]);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const formatFollowers = (count: number) => {
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M`;
		}
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K`;
		}
		return count.toString();
	};

	if (isLoading) {
		return (
			<SpotifyLayout>
				<div className="p-8">
					<div className="text-center py-12">
						<div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				</div>
			</SpotifyLayout>
		);
	}

	if (!artist) {
		return (
			<SpotifyLayout>
				<div className="p-8">
					<div className="text-center py-12">
						<div className="text-6xl mb-4">🎤</div>
						<h3 className="text-xl font-semibold text-white mb-2">
							Artist not found
						</h3>
					</div>
				</div>
			</SpotifyLayout>
		);
	}

	return (
		<SpotifyLayout>
			{/* Hero section with background image */}
			<div className="relative h-[260px]">
				{/* Background with gradient */}
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

				{/* Artist Header */}
				<div className="relative z-10 flex items-end gap-6 px-8 py-4">
					{/* Artist Image */}
					<div className="w-52 h-52 shrink-0 rounded-full overflow-hidden bg-gray-800 shadow-2xl">
						{artist.imageUrl ? (
							<Image
								src={artist.imageUrl}
								alt={artist.name}
								width={208}
								height={208}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<svg
									className="w-28 h-28 text-gray-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
								</svg>
							</div>
						)}
					</div>

					{/* Artist Info */}
					<div className="flex-1 pb-2">
						<h1
							className="text-4xl md:text-5xl font-bold text-white mb-4 line-clamp-2 cursor-help"
							title={artist.name}
						>
							{artist.name}
						</h1>
						<div className="flex items-center gap-2 text-sm text-gray-300">
							<span className="font-semibold">
								{formatFollowers(artist.followers)} followers
							</span>
							{artist.genres.length > 0 && (
								<>
									<span>•</span>
									<span>
										{artist.genres.slice(0, 3).join(", ")}
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="bg-gradient-to-b from-black/20 to-black px-8 py-6">
				{/* Top Tracks */}
				<div className="mb-12">
					{topTracks.length === 0 ? (
						<p className="text-gray-400">No tracks available</p>
					) : (
						<div>
							{topTracks.slice(0, 10).map((track, index) => (
								<div
									key={track.id}
									className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-sm border-t border-b border-white/10 hover:bg-white/10 hover:border-white/20 transition group"
								>
									<span className="text-gray-400 text-sm w-4 text-center">
										{index + 1}
									</span>
									<div className="relative w-10 h-10 shrink-0">
										<Image
											src={track.coverUrl}
											alt={track.title}
											width={40}
											height={40}
											className="rounded"
										/>
										<button
											onClick={() => {
												const queue = topTracks
													.slice(0, 10)
													.slice(index);
												playTrack(track, queue);
											}}
											className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
										>
											<svg
												className="w-5 h-5 text-white"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M8 5v14l11-7z" />
											</svg>
										</button>
									</div>
									<div className="flex-1 min-w-0">
										<p
											className="text-white font-medium truncate text-sm cursor-help"
											title={track.title}
										>
											{track.title.length > 30
												? track.title.substring(0, 30) +
												  "..."
												: track.title}
										</p>
										<p className="text-gray-400 text-sm truncate">
											{artist.name}
										</p>
									</div>
									<div className="text-gray-400 text-sm">
										{formatDuration(track.duration)}
									</div>
									<AddToPlaylistMenuEnhanced
										trackId={track.id}
										trackData={track}
									/>
									<LikeButton
										trackId={track.id}
										trackData={track}
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Albums */}
				{albums.length > 0 && (
					<div>
						<h2 className="text-2xl font-bold text-white mb-6">
							Albums
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{albums.map((album) => (
								<div
									key={album.id}
									className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition p-4 cursor-pointer group"
								>
									<div className="aspect-square mb-3 relative overflow-hidden">
										{album.imageUrl ? (
											<Image
												src={album.imageUrl}
												alt={album.name}
												fill
												className="object-cover"
											/>
										) : (
											<div className="w-full h-full bg-gray-800" />
										)}
										<button
											onClick={() =>
												router.push(
													`/${locale}/album/${album.id}`
												)
											}
											className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
										>
											<div className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center transition">
												<svg
													className="w-5 h-5 text-black ml-0.5"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</button>
									</div>
									<p className="text-white font-medium truncate text-sm mb-1">
										{album.name}
									</p>
									<p className="text-gray-400 text-xs">
										{new Date(
											album.releaseDate
										).getFullYear()}{" "}
										• {album.totalTracks} tracks
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</SpotifyLayout>
	);
}

const LikeButton = ({
	trackId,
	trackData,
}: {
	trackId: string;
	trackData: Track;
}) => {
	const { isLiked, toggle } = useToggleLike(trackId, trackData);
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				toggle();
			}}
			className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-gray-700 rounded-full"
		>
			<svg
				className={`w-5 h-5 ${
					isLiked ? "text-purple-500" : "text-gray-300"
				}`}
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</svg>
		</button>
	);
};
