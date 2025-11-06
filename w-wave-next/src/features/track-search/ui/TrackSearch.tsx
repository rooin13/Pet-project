"use client";

import { useEffect } from "react";
import { useTrackSearch } from "../model/hooks";
import Image from "next/image";
import {
	useToggleLike,
	AddToPlaylistMenuEnhanced,
	usePlayTrack,
} from "@/features/music";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

const LikeButton = ({
	trackId,
	trackData,
}: {
	trackId: string;
	trackData: {
		title: string;
		artist: string;
		coverUrl: string;
		duration: number;
		album?: string;
		previewUrl?: string | null;
	};
}) => {
	const { isLiked, toggle, isLoading } = useToggleLike(trackId, trackData);
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				toggle();
			}}
			disabled={isLoading}
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

export const TrackSearch = () => {
	const {
		query,
		setQuery,
		results,
		isLoading,
		error,
		search,
		loadMore,
		canLoadMore,
	} = useTrackSearch();
	const { playTrack } = usePlayTrack();

	const handleLoadMore = () => {
		if (canLoadMore && !isLoading && query.trim()) {
			loadMore();
			// Запускаем новый поиск с увеличенным лимитом
			setTimeout(() => search(query), 100);
		}
	};

	const observerTarget = useInfiniteScroll(
		handleLoadMore,
		canLoadMore,
		isLoading
	);

	// debounced search
	useEffect(() => {
		if (!query.trim()) {
			return;
		}

		const timer = setTimeout(() => {
			search(query);
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [query, search]);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

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

			{/* results */}
			{results.length > 0 && (
				<div className="space-y-2">
					{results.map((track) => (
						<div
							key={track.id}
							className="flex items-center gap-3 p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition group"
						>
							<div className="relative shrink-0">
								<Image
									src={track.coverUrl}
									alt={track.title}
									width={40}
									height={40}
									className="rounded"
								/>
								<button
									onClick={() => {
										// Создаем очередь из результатов поиска начиная с текущего
										const currentIndex = results.findIndex(
											(t) => t.id === track.id
										);
										const queue = results
											.slice(currentIndex)
											.map((t) => ({
												id: t.id,
												title: t.title,
												artist: t.artist,
												album: t.album,
												coverUrl: t.coverUrl,
												previewUrl: t.previewUrl,
												duration: t.duration,
											}));

										playTrack(
											{
												id: track.id,
												title: track.title,
												artist: track.artist,
												album: track.album,
												coverUrl: track.coverUrl,
												previewUrl: track.previewUrl,
												duration: track.duration,
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
							<div className="flex-1 min-w-0">
								<p className="text-white font-medium truncate">
									{track.title}
								</p>
								<p className="text-gray-400 text-sm truncate">
									{track.artist}
								</p>
							</div>
							<div className="text-gray-400 text-sm">
								{formatDuration(track.duration)}
							</div>
							<AddToPlaylistMenuEnhanced
								trackId={track.id}
								trackData={{
									title: track.title,
									artist: track.artist,
									coverUrl: track.coverUrl,
									duration: track.duration,
									album: track.album,
									previewUrl: track.previewUrl,
								}}
							/>
							<LikeButton
								trackId={track.id}
								trackData={{
									title: track.title,
									artist: track.artist,
									coverUrl: track.coverUrl,
									duration: track.duration,
									album: track.album,
									previewUrl: track.previewUrl,
								}}
							/>
						</div>
					))}
				</div>
			)}

			{/* Intersection Observer target */}
			{results.length > 0 && canLoadMore && (
				<div
					ref={observerTarget}
					className="h-4 flex items-center justify-center py-4"
				>
					{isLoading && (
						<div className="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
