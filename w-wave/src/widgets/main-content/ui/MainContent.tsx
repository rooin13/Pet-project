"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useMainContent, type FeaturedPlaylist } from "../model";
import { PlaylistCardSkeleton } from "@/shared/ui";
import { useTogglePlaylistLike } from "@/features/music";

type PlaylistCardProps = {
	playlist: FeaturedPlaylist;
	onOpen: (playlistId: string) => void;
	onPlay: (playlistId: string) => void;
};

const SpotifyPlaylistCard = ({
	playlist,
	onOpen,
	onPlay,
}: PlaylistCardProps) => {
	const { isLiked, toggle, isLoading } = useTogglePlaylistLike(playlist.id, {
		title: playlist.title,
		description: playlist.description,
		coverUrl: playlist.coverUrl,
		owner: playlist.owner,
		tracksCount: playlist.tracksCount,
		source: "spotify",
	});

	return (
		<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 p-4 transition group">
			<div className="relative mb-3 aspect-square bg-gray-900 overflow-hidden">
				<Image
					src={playlist.coverUrl}
					alt={playlist.title}
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
					className="object-cover"
				/>

				<button
					onClick={(event) => {
						event.stopPropagation();
						void onPlay(playlist.id);
					}}
					className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer z-10"
					aria-label={`Play ${playlist.title}`}
				>
					<div className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center transition">
						<svg
							className="w-5 h-5 text-black ml-0.5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				</button>

				<button
					onClick={(event) => {
						event.stopPropagation();
						void toggle();
					}}
					disabled={isLoading}
					className={`absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full transition ${
						isLiked
							? "bg-purple-600 text-white"
							: "bg-black/60 text-white"
					} disabled:opacity-60 disabled:cursor-wait`}
					aria-label={
						isLiked
							? "Remove playlist from your library"
							: "Save playlist to your library"
					}
					aria-pressed={isLiked}
				>
					<svg
						className={`w-4 h-4 ${
							isLiked ? "text-white" : "text-purple-300"
						}`}
						fill={isLiked ? "currentColor" : "none"}
						stroke="currentColor"
						strokeWidth={1.5}
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				</button>
			</div>

			<button
				onClick={() => onOpen(playlist.id)}
				className="w-full text-left cursor-pointer"
			>
				<h3 className="font-semibold text-white mb-1 truncate hover:underline">
					{playlist.title}
				</h3>
				<p className="text-xs text-gray-400 truncate">
					{playlist.description || `${playlist.tracksCount} tracks`}
				</p>
			</button>
		</div>
	);
};

export const MainContent = () => {
	const t = useTranslations("main");
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;
	const {
		state: { playlists, topPlaylists, isLoading, error },
		handlers: { playPlaylist },
	} = useMainContent();

	const handleOpenPlaylist = (playlistId: string) => {
		router.push(`/${locale}/playlist/${playlistId}`);
	};

	return (
		<div className="p-4 md:p-8">
			{error ? (
				<div className="mb-6 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
					{error}.{" "}
					<span className="font-medium">
						Configure Spotify credentials to load live playlists.
					</span>
				</div>
			) : null}

			<section className="mb-10">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Featured Playlists</h2>
				</div>
				{isLoading ? (
					<div
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse"
						role="status"
						aria-label={t("loadingFeaturedPlaylists")}
					>
						{Array.from({ length: 5 }).map((_, index) => (
							<PlaylistCardSkeleton
								key={`featured-skeleton-${index}`}
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{topPlaylists.map((playlist) => (
							<SpotifyPlaylistCard
								key={playlist.id}
								playlist={playlist}
								onOpen={handleOpenPlaylist}
								onPlay={playPlaylist}
							/>
						))}
					</div>
				)}
			</section>

			<section>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">
						{t("playlistsForYou")}
					</h2>
					<button className="text-sm font-semibold text-gray-400 hover:text-white transition">
						Show all
					</button>
				</div>
				{isLoading ? (
					<div
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse"
						role="status"
						aria-label={t("loadingPersonalizedPlaylists")}
					>
						{Array.from({ length: 10 }).map((_, index) => (
							<PlaylistCardSkeleton
								key={`personalized-skeleton-${index}`}
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{playlists.map((playlist) => (
							<SpotifyPlaylistCard
								key={playlist.id}
								playlist={playlist}
								onOpen={handleOpenPlaylist}
								onPlay={playPlaylist}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
};
