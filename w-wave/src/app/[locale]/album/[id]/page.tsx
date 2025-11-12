"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import {
	AddToPlaylistMenuEnhanced,
	useToggleLike,
	useToggleAlbumLike,
	type LikePayload,
} from "@/features/music";
import { useAlbumDetails } from "@/features/album-details";
import { TrackRow } from "@/entities/track";

export default function AlbumPage({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) {
	const { id, locale } = use(params);
	const router = useRouter();
	const {
		state: { album, tracks, isLoading },
		handlers: { playAll },
	} = useAlbumDetails(id);

	const releaseYear = album?.releaseDate
		? new Date(album.releaseDate).getFullYear()
		: undefined;

	const {
		isLiked: isAlbumSaved,
		toggle: toggleAlbumSave,
		isLoading: isSavingAlbum,
	} = useToggleAlbumLike(id, {
		title: album?.name,
		artist: album?.artists?.[0]?.name,
		artistId: album?.artists?.[0]?.id,
		coverUrl: album?.imageUrl,
		releaseYear,
		totalTracks: album?.totalTracks,
		source: "spotify",
	});

	if (isLoading) {
		return (
			<SpotifyLayout>
				<div
					className="px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-pulse"
					role="status"
					aria-label="Loading album details"
				>
					<div className="relative h-[180px] lg:h-[260px] rounded-xl overflow-hidden bg-linear-to-b from-purple-900/60 via-black/80 to-black">
						<div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex items-center gap-4 lg:gap-6">
							<div className="w-24 h-24 lg:w-52 lg:h-52 bg-white/10" />
							<div className="space-y-2 lg:space-y-3">
								<div className="h-6 lg:h-9 w-48 lg:w-72 bg-white/10 rounded" />
								<div className="h-4 w-36 bg-white/10 rounded" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						{Array.from({ length: 8 }).map((_, index) => (
							<div
								key={`album-track-skeleton-${index}`}
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
				</div>
			</SpotifyLayout>
		);
	}

	if (!album) {
		return (
			<SpotifyLayout>
				<div className="px-4 py-8 sm:px-6 lg:px-8">
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
			{/* hero section with background image */}
			<div className="relative h-[180px] lg:h-[260px]">
				{/* background with gradient */}
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
							<div className="absolute inset-0 bg-linear-to-b from-purple-900/60 via-black/80 to-black"></div>
						</div>
					) : (
						<div className="absolute inset-0 bg-linear-to-b from-purple-900/60 via-black/80 to-black"></div>
					)}
				</div>

				{/* album header */}
				<div className="relative z-10 flex items-center gap-4 lg:gap-6 px-4 lg:px-8 py-4 lg:py-6">
					{/* album cover */}
					<div className="w-24 h-24 lg:w-52 lg:h-52 shrink-0 overflow-hidden bg-gray-800 shadow-2xl">
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
									className="w-12 h-12 lg:w-28 lg:h-28 text-gray-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
								</svg>
							</div>
						)}
					</div>

					{/* album info */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
							<div className="min-w-0">
								<h1
									className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-3 truncate"
									title={album.name}
								>
									{album.name}
								</h1>
								<div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-gray-300 flex-wrap">
									{album.artists.map((artist, index) => (
										<span key={artist.id}>
											<button
												onClick={() =>
													router.push(
														`/${locale}/artist/${artist.id}`
													)
												}
												className="font-semibold hover:underline"
											>
												{artist.name}
											</button>
											{index < album.artists.length - 1 &&
												", "}
										</span>
									))}
									<span>•</span>
									<span>
										{new Date(
											album.releaseDate
										).getFullYear()}
									</span>
									<span className="hidden lg:inline">•</span>
									<span className="hidden lg:inline">
										{album.totalTracks} tracks
									</span>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => toggleAlbumSave()}
									disabled={isSavingAlbum}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
										isAlbumSaved
											? "bg-purple-600 text-white hover:bg-purple-500"
											: "bg-white/10 text-white hover:bg-white/20"
									} disabled:opacity-60 disabled:cursor-wait`}
									aria-pressed={isAlbumSaved}
									aria-label={
										isAlbumSaved
											? "Remove album from your library"
											: "Save album to your library"
									}
								>
									<svg
										className={`w-4 h-4 ${
											isAlbumSaved
												? "text-white"
												: "text-purple-300"
										}`}
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>
									<span>
										{isAlbumSaved ? "Saved" : "Save"}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* content */}
			<div className="bg-linear-to-b from-black/20 to-black">
				{/* tracks */}
				<div>
					{tracks.length === 0 ? (
						<p className="text-gray-400">No tracks available</p>
					) : (
						<div>
							{tracks.map((track, index) => {
								const handlePlay = () => {
									playAll(index);
								};

								return (
									<TrackRow
										key={track.id}
										index={index}
										title={track.title}
										artist={track.artist}
										artistId={track.artistId}
										coverUrl={track.coverUrl || undefined}
										durationMs={track.duration}
										onClick={handlePlay}
										onPlayOverlay={handlePlay}
										onArtistClick={
											track.artistId
												? () =>
														router.push(
															`/${locale}/artist/${track.artistId}`
														)
												: undefined
										}
										className="px-4 sm:px-6"
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
									/>
								);
							})}
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
	trackData: LikePayload;
}) => {
	const { isLiked, toggle } = useToggleLike(trackId, trackData);
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
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
	);
};
