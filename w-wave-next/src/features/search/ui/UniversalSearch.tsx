"use client";

import { useEffect } from "react";
import {
	useUniversalSearch,
	type SearchArtist,
	type SearchAlbum,
	type SearchPlaylist,
} from "../model/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlayTrack } from "@/features/music";
import { useToggleLike, AddToPlaylistMenuEnhanced } from "@/features/music";
import { useDebounce } from "@/shared/hooks";

export const UniversalSearch = () => {
	const router = useRouter();
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
			{/* Search input */}
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

			{/* Tabs */}
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

			{/* Error */}
			{error && (
				<div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			{/* Results */}
			{query && (
				<div className="space-y-8">
					{/* Tracks */}
					{(activeTab === "all" || activeTab === "tracks") &&
						results.tracks.length > 0 && (
							<div>
								<h2 className="text-xl font-bold text-white mb-4">
									Tracks
								</h2>
								<div className="space-y-2">
									{results.tracks
										.filter((t) => t && t.id)
										.slice(
											0,
											activeTab === "all" ? 5 : undefined
										)
										.map((track) => (
											<TrackCard
												key={track.id}
												track={track}
												allTracks={results.tracks.filter(
													(t) => t && t.id
												)}
												playTrack={playTrack}
											/>
										))}
								</div>
							</div>
						)}

					{/* Artists */}
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
											activeTab === "all" ? 4 : undefined
										)
										.map((artist) => (
											<ArtistCard
												key={artist.id}
												artist={artist}
												router={router}
											/>
										))}
								</div>
							</div>
						)}

					{/* Albums */}
					{(activeTab === "all" || activeTab === "albums") &&
						results.albums.length > 0 && (
							<div>
								<h2 className="text-xl font-bold text-white mb-4">
									Albums
								</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									{results.albums
										.filter((a) => a && a.id)
										.slice(
											0,
											activeTab === "all" ? 4 : undefined
										)
										.map((album) => (
											<AlbumCard
												key={album.id}
												album={album}
												router={router}
											/>
										))}
								</div>
							</div>
						)}

					{/* Playlists */}
					{(activeTab === "all" || activeTab === "playlists") &&
						results.playlists.length > 0 && (
							<div>
								<h2 className="text-xl font-bold text-white mb-4">
									Playlists
								</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									{results.playlists
										.filter((p) => p && p.id)
										.slice(
											0,
											activeTab === "all" ? 4 : undefined
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

					{/* Empty state */}
					{!isLoading &&
						results.tracks.length === 0 &&
						results.artists.length === 0 &&
						results.albums.length === 0 &&
						results.playlists.length === 0 && (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">🔍</div>
								<h3 className="text-xl font-semibold text-white mb-2">
									No results found
								</h3>
								<p className="text-gray-400">
									Try searching with different keywords
								</p>
							</div>
						)}
				</div>
			)}

			{/* Initial state */}
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

// Track Card Component
const TrackCard = ({
	track,
	allTracks,
	playTrack,
}: {
	track: any;
	allTracks: any[];
	playTrack: any;
}) => {
	const { isLiked, toggle } = useToggleLike(track?.id || "", {
		title: track?.title || "",
		artist: track?.artist || "",
		artistId: track?.artistId,
		coverUrl: track?.coverUrl || "",
		duration: track?.duration || 0,
		album: track?.album || "",
		albumId: track?.albumId,
		previewUrl: track?.previewUrl || null,
	});

	if (!track || !track.id) {
		console.error("❌ Invalid track data:", track);
		return null;
	}

	return (
		<div className="flex items-center gap-3 p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition group">
			<div className="relative shrink-0">
				<Image
					src={track.coverUrl || "/placeholder.png"}
					alt={track.title || "Track"}
					width={40}
					height={40}
					className="rounded"
				/>
				<button
					onClick={() => {
						const currentIndex = allTracks.findIndex(
							(t) => t?.id === track.id
						);
						const queue = allTracks
							.slice(currentIndex)
							.filter((t) => t && t.id);
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
				<p className="text-white font-medium truncate">{track.title}</p>
				<p className="text-gray-400 text-sm truncate">{track.artist}</p>
			</div>
			<div className="text-gray-400 text-sm">
				{formatDuration(track.duration)}
			</div>
			<AddToPlaylistMenuEnhanced trackId={track.id} trackData={track} />
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
		</div>
	);
};

function formatDuration(ms: number) {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Artist Card Component
const ArtistCard = ({
	artist,
	router,
}: {
	artist: SearchArtist;
	router: any;
}) => {
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

// Album Card Component
const AlbumCard = ({ album, router }: { album: SearchAlbum; router: any }) => {
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

// Playlist Card Component
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
