"use client";

import { use, useState, useEffect } from "react";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { usePlayTrack } from "@/features/music";
import { useToggleLike, AddToPlaylistMenuEnhanced } from "@/features/music";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Album = {
	id: string;
	name: string;
	imageUrl: string;
	releaseDate: string;
	totalTracks: number;
	artists: Array<{ id: string; name: string }>;
};

type Track = {
	id: string;
	title: string;
	trackNumber: number;
	artist: string;
	artistId?: string;
	album: string;
	albumId?: string;
	coverUrl: string;
	previewUrl: string | null;
	duration: number;
	popularity?: number;
};

export default function AlbumPage({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const [album, setAlbum] = useState<Album | null>(null);
	const [tracks, setTracks] = useState<Track[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { playTrack } = usePlayTrack();

	useEffect(() => {
		const fetchAlbumData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`/api/album/${id}`);
				if (!response.ok) throw new Error("Failed to fetch album");
				const data = await response.json();
				setAlbum(data.album);
				setTracks(data.tracks || []);
			} catch (error) {
				console.error("Failed to load album:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAlbumData();
	}, [id]);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

	if (!album) {
		return (
			<SpotifyLayout>
				<div className="p-8">
					<div className="text-center py-12">
						<div className="text-6xl mb-4">💿</div>
						<h3 className="text-xl font-semibold text-white mb-2">
							Album not found
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
					{album.imageUrl ? (
						<div className="absolute inset-0">
							<Image
								src={album.imageUrl}
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

				{/* album header */}
				<div className="relative z-10 flex items-center gap-6 px-8 py-6">
					{/* Album Cover */}
					<div className="w-52 h-52 shrink-0 overflow-hidden bg-gray-800 shadow-2xl">
						{album.imageUrl ? (
							<Image
								src={album.imageUrl}
								alt={album.name}
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
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
								</svg>
							</div>
						)}
					</div>

					{/* Album Info */}
					<div className="flex-1 pb-2">
						<h1
							className="text-3xl font-bold text-white mb-3 line-clamp-2 cursor-help"
							title={album.name}
						>
							{album.name}
						</h1>
						<div className="flex items-center gap-2 text-sm text-gray-300">
							{album.artists.map((artist, index) => (
								<span key={artist.id}>
									<button
										onClick={() =>
											router.push(`/artist/${artist.id}`)
										}
										className="font-semibold hover:underline"
									>
										{artist.name}
									</button>
									{index < album.artists.length - 1 && ", "}
								</span>
							))}
							<span>•</span>
							<span>
								{new Date(album.releaseDate).getFullYear()}
							</span>
							<span>•</span>
							<span>{album.totalTracks} tracks</span>
						</div>
					</div>
				</div>
			</div>

			{/* content */}
			<div className="bg-gradient-to-b from-black/20 to-black">
				{/* tracks */}
				<div>
					{tracks.length === 0 ? (
						<p className="text-gray-400">No tracks available</p>
					) : (
						<div>
							{tracks.map((track, index) => (
								<div
									key={track.id}
									className="flex items-center gap-4 py-2 bg-white/5 backdrop-blur-sm border-t border-b border-white/10 hover:bg-white/10 hover:border-white/20 transition group cursor-pointer"
								>
									<span className="text-gray-400 text-sm w-4 text-center">
										{track.trackNumber}
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
												const queue =
													tracks.slice(index);
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
										<p className="text-white font-medium truncate text-sm">
											{track.title}
										</p>
										<button
											onClick={() =>
												track.artistId &&
												router.push(
													`/artist/${track.artistId}`
												)
											}
											className="text-gray-400 text-sm truncate hover:underline text-left"
										>
											{track.artist}
										</button>
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
