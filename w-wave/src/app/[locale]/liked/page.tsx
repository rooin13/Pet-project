"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { useGetLikedTracksQuery } from "@/shared/lib/api/musicApi";
import {
	useToggleLike,
	AddToPlaylistMenuEnhanced,
	usePlayTrack,
} from "@/features/music";
import { useState } from "react";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useRouter, useParams } from "next/navigation";
import { TrackRowSkeleton } from "@/shared/ui";
import { TrackRow } from "@/entities/track";

export default function LikedPage() {
	const [search, setSearch] = useState("");
	const { data: allTracks = [], isLoading } = useGetLikedTracksQuery();

	// Фильтрация и пагинация на клиенте
	const filteredTracks = search
		? allTracks.filter(
				(track) =>
					track.track_data?.title
						?.toLowerCase()
						.includes(search.toLowerCase()) ||
					track.track_data?.artist
						?.toLowerCase()
						.includes(search.toLowerCase())
		  )
		: allTracks;

	const [displayCount, setDisplayCount] = useState(15);
	const likedTracks = filteredTracks.slice(0, displayCount);
	const hasMore = displayCount < filteredTracks.length;

	const loadMore = () => {
		if (hasMore && !isLoading) {
			setDisplayCount((prev) =>
				Math.min(prev + 15, filteredTracks.length)
			);
		}
	};

	const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoading);

	return (
		<SpotifyLayout>
			<div className="mx-auto max-w-4xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
				{/* search */}
				<div className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search in your liked songs..."
						className="w-full px-4 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
						aria-label="Search in liked songs"
					/>
				</div>

				{isLoading ? (
					<div
						className="space-y-4 animate-pulse"
						role="status"
						aria-label="Loading liked tracks"
					>
						<div className="space-y-2">
							<div className="h-5 w-32 bg-white/10 rounded" />
							<div className="h-3 w-24 bg-white/10 rounded" />
						</div>
						<div className="space-y-2">
							{Array.from({ length: 10 }).map((_, index) => (
								<TrackRowSkeleton
									key={`liked-track-skeleton-${index}`}
								/>
							))}
						</div>
					</div>
				) : likedTracks.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">💜</div>
						<h3 className="text-xl font-semibold text-white mb-2">
							{search
								? "No matching tracks"
								: "No liked songs yet"}
						</h3>
						<p className="text-gray-400">
							{search
								? "Try a different search term"
								: "Songs you like will appear here"}
						</p>
					</div>
				) : (
					<>
						<div className="space-y-2">
							{likedTracks.map((track) => (
								<LikedTrackItem
									key={track.spotify_track_id}
									trackId={track.spotify_track_id}
									trackData={track.track_data}
									allTracks={filteredTracks}
								/>
							))}
						</div>

						{/* intersection observer target */}
						{hasMore && (
							<div
								ref={observerTarget}
								className="h-4 flex items-center justify-center py-4"
							>
								{isLoading && (
									<div
										className="w-full"
										role="status"
										aria-label="Loading more liked tracks"
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

const LikedTrackItem = ({
	trackId,
	trackData,
	allTracks,
}: {
	trackId: string;
	trackData: {
		title?: string;
		artist?: string;
		artistId?: string;
		album?: string;
		coverUrl?: string;
		duration?: number;
		previewUrl?: string | null;
	} | null;
	allTracks: Array<{
		spotify_track_id: string;
		track_data: {
			title?: string;
			artist?: string;
			artistId?: string;
			album?: string;
			coverUrl?: string;
			duration?: number;
			previewUrl?: string | null;
		} | null;
	}>;
}) => {
	const { isLiked, toggle } = useToggleLike(trackId);
	const { playTrack } = usePlayTrack();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;

	const handlePlay = () => {
		const currentIndex = allTracks.findIndex(
			(t) => t.spotify_track_id === trackId
		);
		const queue = allTracks.slice(currentIndex).map((t) => ({
			id: t.spotify_track_id,
			title: t.track_data?.title || "Unknown",
			artist: t.track_data?.artist || "Unknown",
			artistId: t.track_data?.artistId,
			album: t.track_data?.album,
			coverUrl: t.track_data?.coverUrl || "",
			previewUrl: t.track_data?.previewUrl || null,
			duration: t.track_data?.duration || 0,
		}));

		playTrack(
			{
				id: trackId,
				title: trackData?.title || "Unknown",
				artist: trackData?.artist || "Unknown",
				artistId: trackData?.artistId,
				album: trackData?.album,
				coverUrl: trackData?.coverUrl || "",
				previewUrl: trackData?.previewUrl || null,
				duration: trackData?.duration || 0,
			},
			queue
		);
	};

	return (
		<TrackRow
			title={trackData?.title || `Track ${trackId}`}
			artist={trackData?.artist || "Unknown Artist"}
			artistId={trackData?.artistId ?? undefined}
			coverUrl={trackData?.coverUrl ?? undefined}
			durationMs={trackData?.duration ?? undefined}
			onClick={handlePlay}
			onArtistClick={
				trackData?.artistId
					? () =>
							router.push(
								`/${locale}/artist/${trackData.artistId}`
							)
					: undefined
			}
			actions={
				<>
					<div onClick={(event) => event.stopPropagation()}>
						<AddToPlaylistMenuEnhanced
							trackId={trackId}
							trackData={trackData ?? undefined}
						/>
					</div>
					<button
						onClick={(event) => {
							event.stopPropagation();
							toggle();
						}}
						className="p-2 hover:bg-gray-700 transition rounded-full text-gray-300"
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
				</>
			}
		/>
	);
};
