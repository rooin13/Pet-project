"use client";

import Image from "next/image";
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
			<div className="p-8 max-w-4xl">
				<h1 className="text-3xl font-bold text-white">Liked Songs</h1>

				<div className="h-3"></div>

				{/* Search */}
				<div className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search in your liked songs..."
						className="w-full px-4 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
					/>
				</div>

				{isLoading ? (
					<div className="text-center py-12">
						<div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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

						{/* Intersection Observer target */}
						{hasMore && (
							<div
								ref={observerTarget}
								className="h-4 flex items-center justify-center py-4"
							>
								{isLoading && (
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

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="flex items-center gap-3 p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition group">
			{trackData?.coverUrl && (
				<div className="relative w-10 h-10 shrink-0">
					<Image
						src={trackData.coverUrl}
						alt={trackData.title || "Track"}
						width={40}
						height={40}
						className="object-cover"
					/>
					<button
						onClick={() => {
							// Создаем очередь из всех треков начиная с текущего
							const currentIndex = allTracks.findIndex(
								(t) => t.spotify_track_id === trackId
							);
							const queue = allTracks
								.slice(currentIndex)
								.map((t) => ({
									id: t.spotify_track_id,
									title: t.track_data?.title || "Unknown",
									artist: t.track_data?.artist || "Unknown",
									artistId: t.track_data?.artistId,
									album: t.track_data?.album,
									coverUrl: t.track_data?.coverUrl || "",
									previewUrl:
										t.track_data?.previewUrl || null,
									duration: t.track_data?.duration || 0,
								}));

							playTrack(
								{
									id: trackId,
									title: trackData.title || "Unknown",
									artist: trackData.artist || "Unknown",
									artistId: trackData.artistId,
									album: trackData.album,
									coverUrl: trackData.coverUrl || "",
									previewUrl: trackData.previewUrl || null,
									duration: trackData.duration || 0,
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
						{trackData?.title || `Track ${trackId}`}
					</p>
					{trackData?.artistId ? (
						<button
							onClick={(e) => {
								e.stopPropagation();
								router.push(
									`/${locale}/artist/${trackData.artistId}`
								);
							}}
							className="text-sm text-gray-400 truncate hover:underline hover:text-white transition text-left w-full"
						>
							{trackData?.artist || "Unknown Artist"}
						</button>
					) : (
						<p className="text-sm text-gray-400 truncate">
							{trackData?.artist || "Unknown Artist"}
						</p>
					)}
				</div>
				<p className="text-gray-400 text-sm truncate">
					{trackData?.album || "Single"}
				</p>
				<p className="text-gray-400 text-sm">
					{trackData?.duration
						? formatDuration(trackData.duration)
						: "0:00"}
				</p>
			</div>
			<AddToPlaylistMenuEnhanced
				trackId={trackId}
				trackData={trackData}
			/>
			<button
				onClick={(e) => {
					e.stopPropagation();
					toggle();
				}}
				className="p-2 hover:bg-gray-700 transition"
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
		</div>
	);
};
