"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import {
	useGetPlaylistQuery,
	useGetPlaylistTracksQuery,
} from "@/shared/lib/api/musicApi";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import {
	usePlayTrack,
	useToggleLike,
	useTogglePlaylistLike,
	AddToPlaylistMenuEnhanced,
} from "@/features/music";
import { TrackRowSkeleton } from "@/shared/ui";
import { TrackRow } from "@/entities/track";

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

	const playlistCoverUrl = allTracks[0]?.track_data?.coverUrl ?? undefined;

	const {
		isLiked: isPlaylistSaved,
		toggle: togglePlaylistSave,
		isLoading: isSavingPlaylist,
	} = useTogglePlaylistLike(id, {
		title: playlist?.name,
		coverUrl: playlistCoverUrl,
		owner: "You",
		tracksCount: allTracks.length,
		source: "local",
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
			<div className="px-4 pt-8 pb-6 sm:px-6 lg:px-8">
				{playlistLoading ? (
					<div
						className="flex items-center justify-between mb-6 animate-pulse"
						role="status"
						aria-label="Loading playlist details"
					>
						<div className="space-y-3">
							<div className="h-6 w-40 bg-white/10 rounded" />
							<div className="h-4 w-32 bg-white/10 rounded" />
						</div>
						<div className="w-28 h-9 bg-white/10 rounded" />
					</div>
				) : (
					<>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
							<div className="min-w-0">
								<h1 className="text-3xl font-bold text-white mb-2 truncate">
									{playlist?.name || "Playlist"}
								</h1>
								<p className="text-sm text-gray-400">
									{playlist?.is_public
										? "Public Playlist"
										: "Private Playlist"}
									&nbsp;• {tracks.length} tracks
								</p>
							</div>
							<div className="flex items-center gap-3">
								<button
									onClick={() => void togglePlaylistSave()}
									disabled={isSavingPlaylist}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
										isPlaylistSaved
											? "bg-purple-600 text-white hover:bg-purple-500"
											: "bg-white/10 text-white hover:bg-white/20"
									} disabled:opacity-60 disabled:cursor-wait`}
									aria-pressed={isPlaylistSaved}
									aria-label={
										isPlaylistSaved
											? "Remove playlist from your library"
											: "Save playlist to your library"
									}
								>
									<svg
										className={`w-4 h-4 ${
											isPlaylistSaved
												? "text-white"
												: "text-purple-300"
										}`}
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>
									<span>
										{isPlaylistSaved ? "Saved" : "Save"}
									</span>
								</button>
								<button
									onClick={() =>
										router.push(`/${locale}/search`)
									}
									className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
								>
									+ Add Tracks
								</button>
							</div>
						</div>
					</>
				)}

				{tracksLoading ? (
					<div
						className="space-y-2 animate-pulse"
						role="status"
						aria-label="Loading playlist tracks"
					>
						{Array.from({ length: 8 }).map((_, index) => (
							<TrackRowSkeleton
								key={`playlist-track-skeleton-${index}`}
							/>
						))}
					</div>
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
							{tracks.map((track, index) => {
								const data = track.track_data;
								const playCurrent = () => {
									const currentIndex = allTracks.findIndex(
										(t) =>
											t.spotify_track_id ===
											track.spotify_track_id
									);
									const queue = allTracks
										.slice(currentIndex)
										.map((t) => ({
											id: t.spotify_track_id,
											title:
												t.track_data?.title ||
												"Unknown",
											artist:
												t.track_data?.artist ||
												"Unknown",
											artistId: t.track_data?.artistId,
											album: t.track_data?.album,
											coverUrl:
												t.track_data?.coverUrl || "",
											previewUrl:
												t.track_data?.previewUrl ||
												null,
											duration:
												t.track_data?.duration || 0,
										}));

									playTrack(
										{
											id: track.spotify_track_id,
											title: data?.title || "Unknown",
											artist: data?.artist || "Unknown",
											artistId: data?.artistId,
											album: data?.album,
											coverUrl: data?.coverUrl || "",
											previewUrl:
												data?.previewUrl || null,
											duration: data?.duration || 0,
										},
										queue
									);
								};

								return (
									<TrackRow
										key={track.spotify_track_id}
										index={index}
										title={
											data?.title ||
											`Track ${track.spotify_track_id}`
										}
										artist={
											data?.artist || "Unknown Artist"
										}
										artistId={data?.artistId ?? undefined}
										coverUrl={data?.coverUrl ?? undefined}
										durationMs={data?.duration ?? undefined}
										onClick={playCurrent}
										onArtistClick={
											data?.artistId
												? () =>
														router.push(
															`/${locale}/artist/${data.artistId}`
														)
												: undefined
										}
										actions={
											<>
												<div
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<AddToPlaylistMenuEnhanced
														trackId={
															track.spotify_track_id
														}
														trackData={data}
													/>
												</div>
												<LikeButton
													trackId={
														track.spotify_track_id
													}
													trackData={data}
												/>
											</>
										}
									/>
								);
							})}
						</div>

						{/* intersection observer target */}
						{hasMore && (
							<div
								ref={observerTarget}
								className="h-4 flex items-center justify-center py-4"
							>
								{tracksLoading && (
									<div
										className="w-full"
										role="status"
										aria-label="Loading more tracks"
									>
										<TrackRowSkeleton />
									</div>
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
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</svg>
		</button>
	);
};
