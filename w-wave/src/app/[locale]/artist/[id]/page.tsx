"use client";

import { use, useEffect, useState } from "react";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { usePlayTrack } from "@/features/music";
import { useToggleLike, AddToPlaylistMenuEnhanced } from "@/features/music";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TrackRow } from "@/entities/track";

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
				<div
					className="px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-pulse"
					role="status"
					aria-label="Loading artist details"
				>
					<div className="relative h-[180px] lg:h-[260px] rounded-xl overflow-hidden bg-linear-to-b from-purple-900/60 via-black/80 to-black">
						<div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex items-center gap-4 lg:gap-6">
							<div className="w-24 h-24 lg:w-52 lg:h-52 rounded-full bg-white/10" />
							<div className="space-y-3">
								<div className="h-6 lg:h-10 w-40 lg:w-72 bg-white/10 rounded" />
								<div className="h-4 w-32 bg-white/10 rounded" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={`track-skeleton-${index}`}
								className="flex items-center gap-3 px-4 py-2 sm:px-6 bg-white/5 border border-white/10 rounded-lg"
							>
								<div className="w-4 text-sm text-white/30">
									{index + 1}
								</div>
								<div className="w-10 h-10 bg-white/10 rounded" />
								<div className="flex-1 grid grid-cols-[1fr_60px_auto_auto] gap-3 items-center">
									<div className="space-y-2 min-w-0">
										<div className="h-4 bg-white/10 rounded w-2/3" />
										<div className="h-3 bg-white/10 rounded w-1/3" />
									</div>
									<div className="h-3 bg-white/10 rounded w-12" />
									<div className="h-8 bg-white/10 rounded" />
									<div className="h-8 bg-white/10 rounded" />
								</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={`album-skeleton-${index}`}
								className="space-y-3 bg-white/5 border border-white/10 rounded-lg p-4"
							>
								<div className="aspect-square bg-white/10 rounded" />
								<div className="h-4 bg-white/10 rounded w-3/4" />
								<div className="h-3 bg-white/10 rounded w-1/2" />
							</div>
						))}
					</div>
				</div>
			</SpotifyLayout>
		);
	}

	if (!artist) {
		return (
			<SpotifyLayout>
				<div className="px-4 py-8 sm:px-6 lg:px-8">
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
			{/* hero section with background image */}
			<div className="relative h-[180px] lg:h-[260px]">
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
							<div className="absolute inset-0 bg-linear-to-b from-purple-900/60 via-black/80 to-black"></div>
						</div>
					) : (
						<div className="absolute inset-0 bg-linear-to-b from-purple-900/60 via-black/80 to-black"></div>
					)}
				</div>

				{/* artist header */}
				<div className="relative z-10 h-full flex items-center gap-4 lg:gap-6 px-4 lg:px-8">
					{/* artist image */}
					<div className="w-24 h-24 lg:w-52 lg:h-52 shrink-0 rounded-full overflow-hidden bg-gray-800 shadow-2xl">
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
									className="w-12 h-12 lg:w-28 lg:h-28 text-gray-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
								</svg>
							</div>
						)}
					</div>

					{/* artist info */}
					<div className="flex-1 min-w-0">
						<h1
							className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 lg:mb-4 truncate"
							title={artist.name}
						>
							{artist.name}
						</h1>
						<div className="flex items-center gap-2 text-xs lg:text-sm text-gray-300">
							<span className="font-semibold">
								{formatFollowers(artist.followers)} followers
							</span>
							{artist.genres.length > 0 && (
								<>
									<span className="hidden lg:inline">•</span>
									<span className="hidden lg:inline truncate">
										{artist.genres.slice(0, 3).join(", ")}
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* content */}
			<div className="bg-linear-to-b from-black/20 to-black">
				{/* top tracks */}
				<div className="mb-12">
					{topTracks.length === 0 ? (
						<p className="text-gray-400">No tracks available</p>
					) : (
						<div>
							{topTracks.slice(0, 10).map((track, index) => {
								const playSelection = () => {
									const queue = topTracks
										.slice(0, 10)
										.slice(index);
									playTrack(track, queue);
								};

								return (
									<TrackRow
										key={track.id}
										index={index}
										title={track.title}
										artist={artist.name}
										coverUrl={track.coverUrl}
										durationMs={track.duration}
										onClick={playSelection}
										onPlayOverlay={playSelection}
										actions={
											<>
												<div
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<AddToPlaylistMenuEnhanced
														trackId={track.id}
														trackData={track}
													/>
												</div>
												<div
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<LikeButton
														trackId={track.id}
														trackData={track}
													/>
												</div>
											</>
										}
										className="px-4 sm:px-6"
									/>
								);
							})}
						</div>
					)}
				</div>

				{/* albums */}
				{albums.length > 0 && (
					<div className="px-4 mt-8 sm:px-6 lg:px-8">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{albums.map((album) => (
								<div
									key={album.id}
									className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition p-4 group"
								>
									{/* album cover with play button */}
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
											onClick={async (e) => {
												e.stopPropagation();
												// Fetch album tracks and start playing
												try {
													const response =
														await fetch(
															`/api/album/${album.id}`
														);
													if (!response.ok)
														throw new Error(
															"Failed to fetch album"
														);
													const data =
														await response.json();
													if (
														data.tracks &&
														data.tracks.length > 0
													) {
														playTrack(
															data.tracks[0],
															data.tracks
														);
													}
												} catch (error) {
													console.error(
														"Failed to play album:",
														error
													);
												}
											}}
											className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer z-10"
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

									{/* album info - clickable to open album page */}
									<button
										onClick={() =>
											router.push(
												`/${locale}/album/${album.id}`
											)
										}
										className="w-full text-left cursor-pointer"
									>
										<p className="text-white font-medium truncate text-sm mb-1 hover:underline">
											{album.name}
										</p>
										<p className="text-gray-400 text-xs">
											{new Date(
												album.releaseDate
											).getFullYear()}{" "}
											• {album.totalTracks} tracks
										</p>
									</button>
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
			className="rounded-full p-1.5 text-gray-300 transition hover:bg-gray-700 hover:text-white"
		>
			<svg
				className={`h-5 w-5 ${
					isLiked ? "text-purple-500 fill-current" : "fill-none"
				}`}
				fill={isLiked ? "currentColor" : "none"}
				stroke="currentColor"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
			>
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</svg>
		</button>
	);
};
