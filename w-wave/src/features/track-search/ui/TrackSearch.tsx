"use client";

import { useTrackSearch } from "../model/hooks";
import {
	useToggleLike,
	AddToPlaylistMenuEnhanced,
	usePlayTrack,
	type LikePayload,
} from "@/features/music";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { TrackRowSkeleton } from "@/shared/ui";
import { TrackRow } from "@/entities/track";

const LikeButton = ({
	trackId,
	trackData,
}: {
	trackId: string;
	trackData: LikePayload;
}) => {
	const { isLiked, toggle, isLoading } = useToggleLike(trackId, trackData);
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				toggle();
			}}
			disabled={isLoading}
			className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
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

export const TrackSearch = () => {
	const {
		query,
		setQuery,
		results,
		isLoading,
		error,
		loadMore,
		canLoadMore,
		mapToPlayerTrack,
		buildQueue,
	} = useTrackSearch();
	const { playTrack } = usePlayTrack();

	const handleLoadMore = () => {
		if (canLoadMore && !isLoading && query.trim()) {
			void loadMore(query);
		}
	};

	const observerTarget = useInfiniteScroll(
		handleLoadMore,
		canLoadMore,
		isLoading
	);

	return (
		<div className="max-w-4xl mx-auto">
			{/* search input */}
			<div className="mb-8">
				<div className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.35-4.35" strokeLinecap="round" />
					</svg>
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search for tracks, artists, albums..."
						className="w-full pl-11 pr-4 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none transition"
					/>
					{isLoading && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2">
							<svg
								className="animate-spin h-4 w-4 text-purple-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						</div>
					)}
				</div>
			</div>

			{/* error */}
			{error && (
				<div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			{/* loading skeleton */}
			{isLoading && results.length === 0 && (
				<div
					className="space-y-2 mb-8"
					role="status"
					aria-label="Loading search results"
				>
					{Array.from({ length: 8 }).map((_, index) => (
						<TrackRowSkeleton
							key={`track-search-skeleton-${index}`}
						/>
					))}
				</div>
			)}

			{/* results */}
			{results.length > 0 && (
				<div className="space-y-2">
					{results.map((track) => {
						const playerTrack = mapToPlayerTrack(track);
						const queue = buildQueue(track.id);

						return (
							<TrackRow
								key={track.id}
								title={track.title}
								artist={track.artist}
								coverUrl={track.coverUrl ?? undefined}
								durationMs={playerTrack.duration}
								onClick={() => playTrack(playerTrack, queue)}
								actions={
									<>
										<div
											onClick={(e) => e.stopPropagation()}
										>
											<AddToPlaylistMenuEnhanced
												trackId={track.id}
												trackData={{
													title: playerTrack.title,
													artist: playerTrack.artist,
													coverUrl:
														playerTrack.coverUrl,
													duration:
														playerTrack.duration,
													album: playerTrack.album,
													previewUrl:
														playerTrack.previewUrl ??
														null,
												}}
											/>
										</div>
										<LikeButton
											trackId={track.id}
											trackData={{
												title: playerTrack.title,
												artist: playerTrack.artist,
												coverUrl: playerTrack.coverUrl,
												duration: playerTrack.duration,
												album: playerTrack.album,
												previewUrl:
													playerTrack.previewUrl ??
													null,
											}}
										/>
									</>
								}
							/>
						);
					})}
				</div>
			)}

			{/* intersection observer target */}
			{results.length > 0 && canLoadMore && (
				<div
					ref={observerTarget}
					className="h-4 flex items-center justify-center py-4"
				>
					{isLoading && (
						<div className="w-full">
							<TrackRowSkeleton />
						</div>
					)}
				</div>
			)}

			{/* empty state */}
			{!isLoading && query && results.length === 0 && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">🔍</div>
					<h3 className="text-xl font-semibold text-white mb-2">
						No tracks found
					</h3>
					<p className="text-gray-400">
						Try searching with different keywords
					</p>
				</div>
			)}

			{/* initial state */}
			{!query && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">🎵</div>
					<h3 className="text-xl font-semibold text-white mb-2">
						Search for music
					</h3>
					<p className="text-gray-400">
						Find your favorite tracks, artists, and albums
					</p>
				</div>
			)}
		</div>
	);
};
