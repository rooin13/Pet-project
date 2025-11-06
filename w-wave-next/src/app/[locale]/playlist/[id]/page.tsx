"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import {
	useGetPlaylistQuery,
	useGetPlaylistTracksQuery,
} from "@/shared/lib/api/musicApi";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import {
	usePlayTrack,
	useToggleLike,
	AddToPlaylistMenuEnhanced,
} from "@/features/music";

const formatDuration = (ms: number) => {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function PlaylistPage({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) {
	const { id, locale } = use(params);
	const router = useRouter();

	const { data: playlist, isLoading: playlistLoading } = useGetPlaylistQuery({
		playlistId: id,
	});
	const { data: allTracks = [], isLoading: tracksLoading } =
		useGetPlaylistTracksQuery({
			playlistId: id,
		});

	const [displayCount, setDisplayCount] = useState(15);
	const tracks = allTracks.slice(0, displayCount);
	const hasMore = displayCount < allTracks.length;

	const loadMore = () => {
		if (hasMore && !tracksLoading) {
			setDisplayCount((prev) => Math.min(prev + 15, allTracks.length));
		}
	};

	const observerTarget = useInfiniteScroll(loadMore, hasMore, tracksLoading);
	const { playTrack } = usePlayTrack();

	return (
		<SpotifyLayout>
			<div className="p-8">
				{playlistLoading ? (
					<>
						<h1 className="text-3xl font-bold text-white">
							Loading...
						</h1>
						<div className="h-3"></div>
					</>
				) : (
					<>
						<div className="flex items-center justify-between mb-6">
							<div>
								<h1 className="text-3xl font-bold text-white mb-2">
									{playlist?.name || "Playlist"}
								</h1>
								<p className="text-sm text-gray-400">
									{playlist?.is_public
										? "Public Playlist"
										: "Private Playlist"}{" "}
									• {tracks.length} tracks
								</p>
							</div>
							<button
								onClick={() => router.push(`/${locale}/search`)}
								className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
							>
								+ Add Tracks
							</button>
						</div>
					</>
				)}

				{tracksLoading ? (
					<p className="text-gray-400">Loading tracks...</p>
				) : tracks.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">🎵</div>
						<h3 className="text-xl font-semibold text-white mb-2">
							No tracks yet
						</h3>
						<p className="text-gray-400 mb-8">
							Add tracks from search or your liked songs
						</p>
						<button
							onClick={() => router.push(`/${locale}/search`)}
							className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
						>
							Browse Tracks
						</button>
					</div>
				) : (
					<>
						<div className="space-y-2">
							{tracks.map((track) => {
								const data = track.track_data;
								return (
									<div
										key={track.spotify_track_id}
										className="flex items-center gap-3 p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition group"
									>
										{data?.coverUrl && (
											<div className="relative w-10 h-10 shrink-0">
												<Image
													src={data.coverUrl}
													alt={data.title || "Track"}
													width={40}
													height={40}
													className="object-cover"
												/>
												<button
													onClick={() => {
														// Создаем очередь из треков плейлиста начиная с текущего
														const currentIndex =
															allTracks.findIndex(
																(t) =>
																	t.spotify_track_id ===
																	track.spotify_track_id
															);
														const queue = allTracks
															.slice(currentIndex)
															.map((t) => ({
																id: t.spotify_track_id,
																title:
																	t.track_data
																		?.title ||
																	"Unknown",
																artist:
																	t.track_data
																		?.artist ||
																	"Unknown",
																artistId:
																	t.track_data
																		?.artistId,
																album: t
																	.track_data
																	?.album,
																coverUrl:
																	t.track_data
																		?.coverUrl ||
																	"",
																previewUrl:
																	t.track_data
																		?.previewUrl ||
																	null,
																duration:
																	t.track_data
																		?.duration ||
																	0,
															}));

														playTrack(
															{
																id: track.spotify_track_id,
																title:
																	data?.title ||
																	"Unknown",
																artist:
																	data?.artist ||
																	"Unknown",
																artistId:
																	data?.artistId,
																album: data?.album,
																coverUrl:
																	data?.coverUrl ||
																	"",
																previewUrl:
																	data?.previewUrl ||
																	null,
																duration:
																	data?.duration ||
																	0,
															},
															queue
														);
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
										)}
										<div className="flex-1 min-w-0 grid grid-cols-[1fr_200px_80px] gap-4 items-center">
											<div className="min-w-0">
												<p className="text-sm font-medium text-white truncate">
													{data?.title ||
														`Track ${track.spotify_track_id}`}
												</p>
												{data?.artistId ? (
													<button
														onClick={(e) => {
															e.stopPropagation();
															router.push(
																`/${locale}/artist/${data.artistId}`
															);
														}}
														className="text-sm text-gray-400 truncate hover:underline hover:text-white transition text-left w-full"
													>
														{data?.artist ||
															"Unknown Artist"}
													</button>
												) : (
													<p className="text-sm text-gray-400 truncate">
														{data?.artist ||
															"Unknown Artist"}
													</p>
												)}
											</div>
											<p className="text-gray-400 text-sm truncate">
												{data?.album || "Single"}
											</p>
											<p className="text-gray-400 text-sm">
												{data?.duration
													? formatDuration(
															data.duration
													  )
													: "0:00"}
											</p>
										</div>
										<AddToPlaylistMenuEnhanced
											trackId={track.spotify_track_id}
											trackData={data}
										/>
										<LikeButton
											trackId={track.spotify_track_id}
											trackData={data}
										/>
									</div>
								);
							})}
						</div>

						{/* Intersection Observer target */}
						{hasMore && (
							<div
								ref={observerTarget}
								className="h-4 flex items-center justify-center py-4"
							>
								{tracksLoading && (
									<div className="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
								)}
							</div>
						)}
					</>
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
	trackData: {
		title?: string;
		artist?: string;
		artistId?: string;
		album?: string;
		albumId?: string;
		coverUrl?: string;
		duration?: number;
		previewUrl?: string | null;
	} | null;
}) => {
	const { isLiked, toggle } = useToggleLike(
		trackId,
		trackData
			? {
					title: trackData.title || "Unknown",
					artist: trackData.artist || "Unknown",
					artistId: trackData.artistId,
					coverUrl: trackData.coverUrl || "",
					duration: trackData.duration || 0,
					album: trackData.album,
					albumId: trackData.albumId,
					previewUrl: trackData.previewUrl || null,
			  }
			: undefined
	);

	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				toggle();
			}}
			className="p-2 hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
		>
			<svg
				className={`w-5 h-5 ${
					isLiked ? "text-purple-500 fill-current" : "text-gray-300"
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
