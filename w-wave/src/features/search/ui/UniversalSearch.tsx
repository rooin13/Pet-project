"use client";

import { useEffect } from "react";
import {
	useUniversalSearch,
	type SearchArtist,
	type SearchAlbum,
	type SearchPlaylist,
	type SearchTrack,
} from "../model/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlayTrack } from "@/features/music";
import { useToggleLike, AddToPlaylistMenuEnhanced } from "@/features/music";
import { useDebounce } from "@/shared/hooks";
import type { Track } from "@/entities/track";
import {
	TrackCardSkeleton,
	ArtistCardSkeleton,
	AlbumCardSkeleton,
	PlaylistCardSkeleton,
} from "@/shared/ui";
import { TrackRow } from "@/entities/track";

export const UniversalSearch = () => {
	const {
		query,
		setQuery,
		results,
		isLoading,
		error,
		search,
		activeTab,
		setActiveTab,
	} = useUniversalSearch();
	const { playTrack } = usePlayTrack();

	// debounced search
	const debouncedQuery = useDebounce(query, 500);

	useEffect(() => {
		if (!debouncedQuery.trim()) {
			return;
		}

		search(debouncedQuery, activeTab);
	}, [debouncedQuery, activeTab, search]);

	const tabs = [
		{
			id: "all" as const,
			label: "All",
			count:
				results.tracks.length +
				results.artists.length +
				results.albums.length +
				results.playlists.length,
		},
		{
			id: "tracks" as const,
			label: "Tracks",
			count: results.tracks.length,
		},
		{
			id: "artists" as const,
			label: "Artists",
			count: results.artists.length,
		},
		{
			id: "albums" as const,
			label: "Albums",
			count: results.albums.length,
		},
		{
			id: "playlists" as const,
			label: "Playlists",
			count: results.playlists.length,
		},
	];

	return (
		<div className="max-w-4xl mx-auto">
			{/* search input */}
			<div className="mb-6">
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
						placeholder="Search for tracks, artists, albums, playlists..."
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

			{/* tabs */}
			{query && (
				<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-1.5 text-sm font-medium transition whitespace-nowrap ${
								activeTab === tab.id
									? "bg-purple-600 text-white"
									: "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
							}`}
						>
							{tab.label}
							{tab.count > 0 && (
								<span className="ml-2 text-xs opacity-70">
									{tab.count}
								</span>
							)}
						</button>
					))}
				</div>
			)}

			{/* error */}
			{error && (
				<div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			{/* results */}
			{query && (
				<div className="space-y-8">
					{isLoading ? (
						<>
							{(activeTab === "all" ||
								activeTab === "tracks") && (
								<div>
									<div className="h-4 w-24 bg-white/10 rounded mb-4" />
									<div className="space-y-2">
										{Array.from({
											length: activeTab === "all" ? 5 : 6,
										}).map((_, index) => (
											<TrackCardSkeleton
												key={`tracks-skeleton-${index}`}
											/>
										))}
									</div>
								</div>
							)}

							{(activeTab === "all" ||
								activeTab === "artists") && (
								<div>
									<div className="h-4 w-28 bg-white/10 rounded mb-4" />
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										{Array.from({
											length: activeTab === "all" ? 4 : 8,
										}).map((_, index) => (
											<ArtistCardSkeleton
												key={`artists-skeleton-${index}`}
											/>
										))}
									</div>
								</div>
							)}

							{(activeTab === "all" ||
								activeTab === "albums") && (
								<div>
									<div className="h-4 w-24 bg-white/10 rounded mb-4" />
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										{Array.from({
											length: activeTab === "all" ? 4 : 8,
										}).map((_, index) => (
											<AlbumCardSkeleton
												key={`albums-skeleton-${index}`}
											/>
										))}
									</div>
								</div>
							)}

							{(activeTab === "all" ||
								activeTab === "playlists") && (
								<div>
									<div className="h-4 w-28 bg-white/10 rounded mb-4" />
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										{Array.from({
											length: activeTab === "all" ? 4 : 8,
										}).map((_, index) => (
											<PlaylistCardSkeleton
												key={`playlists-skeleton-${index}`}
											/>
										))}
									</div>
								</div>
							)}
						</>
					) : (
						<>
							{/* tracks */}
							{(activeTab === "all" || activeTab === "tracks") &&
								results.tracks.length > 0 && (
									<div>
										<h2 className="text-xl font-bold text-white mb-4">
											Tracks
										</h2>
										<div className="space-y-2">
											{results.tracks
												.filter(
													(
														track
													): track is SearchTrack =>
														Boolean(track?.id)
												)
												.slice(
													0,
													activeTab === "all"
														? 5
														: undefined
												)
												.map(
													(
														track,
														index,
														filteredTracks
													) => (
														<TrackCard
															key={track.id}
															track={track}
															tracks={
																filteredTracks
															}
															onPlay={playTrack}
														/>
													)
												)}
										</div>
									</div>
								)}

							{/* artists */}
							{(activeTab === "all" || activeTab === "artists") &&
								results.artists.length > 0 && (
									<div>
										<h2 className="text-xl font-bold text-white mb-4">
											Artists
										</h2>
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
											{results.artists
												.filter((a) => a && a.id)
												.slice(
													0,
													activeTab === "all"
														? 4
														: undefined
												)
												.map((artist) => (
													<ArtistCard
														key={artist.id}
														artist={artist}
													/>
												))}
										</div>
									</div>
								)}

							{/* albums */}
							{(activeTab === "all" || activeTab === "albums") &&
								results.albums.length > 0 && (
									<div>
										<h2 className="text-xl font-bold text-white mb-4">
											Albums
										</h2>
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
											{results.albums
												.filter(
													(
														album
													): album is SearchAlbum =>
														Boolean(album?.id)
												)
												.slice(
													0,
													activeTab === "all"
														? 4
														: undefined
												)
												.map((album) => (
													<AlbumCard
														key={album.id}
														album={album}
													/>
												))}
										</div>
									</div>
								)}

							{/* playlists */}
							{(activeTab === "all" ||
								activeTab === "playlists") &&
								results.playlists.length > 0 && (
									<div>
										<h2 className="text-xl font-bold text-white mb-4">
											Playlists
										</h2>
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
											{results.playlists
												.filter(
													(
														playlist
													): playlist is SearchPlaylist =>
														Boolean(playlist?.id)
												)
												.slice(
													0,
													activeTab === "all"
														? 4
														: undefined
												)
												.map((playlist) => (
													<PlaylistCard
														key={playlist.id}
														playlist={playlist}
													/>
												))}
										</div>
									</div>
								)}

							{/* empty state */}
							{results.tracks.length === 0 &&
								results.artists.length === 0 &&
								results.albums.length === 0 &&
								results.playlists.length === 0 && (
									<div className="text-center py-12">
										<div className="text-6xl mb-4">🔍</div>
										<h3 className="text-xl font-semibold text-white mb-2">
											No results found
										</h3>
										<p className="text-gray-400">
											Try searching with different
											keywords
										</p>
									</div>
								)}
						</>
					)}
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
						Find tracks, artists, albums, and playlists
					</p>
				</div>
			)}
		</div>
	);
};

type TrackCardProps = {
	track: SearchTrack;
	tracks: SearchTrack[];
	onPlay: (track: Track, queue: Track[]) => void;
};

const TrackCard = ({ track, tracks, onPlay }: TrackCardProps) => {
	const normalizedTrack = mapSearchTrackToTrack(track);
	const normalizedQueue = tracks.map(mapSearchTrackToTrack);
	const durationMs = normalizedTrack.duration ?? 0;
	const router = useRouter();

	const { isLiked, toggle } = useToggleLike(normalizedTrack.id, {
		title: normalizedTrack.title,
		artist: normalizedTrack.artist,
		artistId: normalizedTrack.artistId,
		coverUrl: normalizedTrack.coverUrl,
		duration: durationMs,
		album: normalizedTrack.album,
		albumId: normalizedTrack.albumId,
		previewUrl: normalizedTrack.previewUrl,
	});

	const playlistTrackPayload = {
		title: normalizedTrack.title,
		artist: normalizedTrack.artist,
		coverUrl: normalizedTrack.coverUrl,
		duration: durationMs,
		album: normalizedTrack.album,
		previewUrl: normalizedTrack.previewUrl,
	};

	const handlePlay = () => {
		const currentIndex = normalizedQueue.findIndex(
			(item) => item.id === normalizedTrack.id
		);

		if (currentIndex === -1) {
			return;
		}
		const queue = normalizedQueue.slice(currentIndex);
		onPlay(normalizedTrack, queue);
	};

	return (
		<TrackRow
			title={normalizedTrack.title || "Unknown track"}
			artist={normalizedTrack.artist || "Unknown artist"}
			artistId={normalizedTrack.artistId}
			coverUrl={normalizedTrack.coverUrl || undefined}
			durationMs={durationMs}
			onClick={handlePlay}
			onArtistClick={
				normalizedTrack.artistId
					? () => router.push(`/artist/${normalizedTrack.artistId}`)
					: undefined
			}
			actions={
				<>
					<div onClick={(event) => event.stopPropagation()}>
						<AddToPlaylistMenuEnhanced
							trackId={normalizedTrack.id}
							trackData={playlistTrackPayload}
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

const mapSearchTrackToTrack = (searchTrack: SearchTrack): Track => {
	const normalized: Track = {
		id: searchTrack.id,
		title: searchTrack.title,
		artist: searchTrack.artist,
		artistId: searchTrack.artistId,
		album: searchTrack.album,
		albumId: searchTrack.albumId,
		coverUrl: searchTrack.coverUrl || "/placeholder.png",
		previewUrl: searchTrack.previewUrl ?? null,
		duration: searchTrack.duration ?? 0,
	};

	if (typeof searchTrack.popularity === "number") {
		normalized.popularity = searchTrack.popularity;
	}

	return normalized;
};

// artist card
const ArtistCard = ({ artist }: { artist: SearchArtist }) => {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push(`/artist/${artist.id}`)}
			className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition p-4 group text-left"
		>
			<div className="aspect-square mb-3 relative overflow-hidden rounded-full">
				{artist.imageUrl ? (
					<Image
						src={artist.imageUrl}
						alt={artist.name}
						fill
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-gray-800 flex items-center justify-center">
						<svg
							className="w-12 h-12 text-gray-600"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
						</svg>
					</div>
				)}
			</div>
			<p className="text-white font-medium truncate mb-1">
				{artist.name}
			</p>
			<p className="text-gray-400 text-xs truncate">Artist</p>
		</button>
	);
};

// album card
const AlbumCard = ({ album }: { album: SearchAlbum }) => {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push(`/album/${album.id}`)}
			className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition p-4 group text-left"
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
			</div>
			<p className="text-white font-medium truncate mb-1">{album.name}</p>
			<p className="text-gray-400 text-xs truncate">{album.artist}</p>
		</button>
	);
};

// playlist card
const PlaylistCard = ({ playlist }: { playlist: SearchPlaylist }) => {
	return (
		<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition p-4 group cursor-pointer">
			<div className="aspect-square mb-3 relative overflow-hidden">
				{playlist.imageUrl ? (
					<Image
						src={playlist.imageUrl}
						alt={playlist.name}
						fill
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-gray-800" />
				)}
			</div>
			<p className="text-white font-medium truncate mb-1">
				{playlist.name}
			</p>
			<p className="text-gray-400 text-xs truncate">
				by {playlist.owner} • {playlist.tracksCount} tracks
			</p>
		</div>
	);
};
