"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	useGetMyPlaylistsQuery,
	useGetLikedPlaylistsQuery,
	useGetLikedAlbumsQuery,
} from "@/shared/lib/api/musicApi";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { PlaylistCardSkeleton } from "@/shared/ui";

type LibraryTab = "all" | "myPlaylists" | "savedPlaylists" | "savedAlbums";

type TabDefinition = {
	id: LibraryTab;
	label: string;
};

type LibraryItem = {
	key: string;
	title: string;
	subtitle?: string;
	coverUrl?: string;
	badge: string;
	kind: "localPlaylist" | "savedPlaylist" | "savedAlbum";
	onClick: () => void;
};

const GRID_CLASSES =
	"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";

const SKELETON_COUNT = 8;

export default function LibraryPage() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("library");

	const tabs: TabDefinition[] = useMemo(
		() => [
			{ id: "all", label: t("tabs.all") },
			{ id: "myPlaylists", label: t("tabs.myPlaylists") },
			{ id: "savedPlaylists", label: t("tabs.savedPlaylists") },
			{ id: "savedAlbums", label: t("tabs.savedAlbums") },
		],
		[t]
	);

	const [activeTab, setActiveTab] = useState<LibraryTab>("all");

	const { data: myPlaylists = [], isLoading: isMyPlaylistsLoading } =
		useGetMyPlaylistsQuery();

	const { data: likedPlaylists = [], isLoading: isLikedPlaylistsLoading } =
		useGetLikedPlaylistsQuery();

	const { data: likedAlbums = [], isLoading: isLikedAlbumsLoading } =
		useGetLikedAlbumsQuery();

	const handleCreatePlaylist = useCallback(() => {
		router.push(`/${locale}/create-playlist`);
	}, [locale, router]);

	const openLocalPlaylist = useCallback(
		(playlistId: string) => {
			router.push(`/${locale}/playlist/${playlistId}`);
		},
		[locale, router]
	);

	const openSpotifyPlaylist = useCallback((playlistId: string) => {
		if (typeof window !== "undefined") {
			window.open(
				`https://open.spotify.com/playlist/${playlistId}`,
				"_blank",
				"noopener"
			);
		}
	}, []);

	const openAlbum = useCallback(
		(albumId: string) => {
			router.push(`/${locale}/album/${albumId}`);
		},
		[locale, router]
	);

	const dateFormatter = useMemo(
		() => new Intl.DateTimeFormat(locale),
		[locale]
	);

	const libraryBadges = useMemo(
		() => ({
			myPlaylist: t("badges.myPlaylist"),
			savedPlaylist: t("badges.savedPlaylist"),
			savedAlbum: t("badges.savedAlbum"),
		}),
		[t]
	);

	const myPlaylistItems = useMemo<LibraryItem[]>(
		() =>
			myPlaylists.map((playlist) => ({
				key: `my-${playlist.id}`,
				title: playlist.name,
				subtitle: dateFormatter.format(new Date(playlist.created_at)),
				badge: libraryBadges.myPlaylist,
				kind: "localPlaylist" as const,
				onClick: () => openLocalPlaylist(playlist.id),
			})),
		[
			dateFormatter,
			libraryBadges.myPlaylist,
			myPlaylists,
			openLocalPlaylist,
		]
	);

	const savedPlaylistItems = useMemo<LibraryItem[]>(
		() =>
			likedPlaylists.map((playlist) => {
				const data = playlist.playlist_data;
				const title =
					data?.title?.trim() || playlist.spotify_playlist_id;
				const description = data?.description?.trim();
				const owner = data?.owner?.trim();
				const tracksInfo = data?.tracksCount
					? `${data.tracksCount} tracks`
					: undefined;
				const subtitle =
					description ||
					[owner, tracksInfo].filter(Boolean).join(" • ") ||
					"Spotify";

				const isLocalSource = data?.source === "local";

				return {
					key: `saved-playlist-${playlist.spotify_playlist_id}`,
					title,
					subtitle,
					coverUrl: data?.coverUrl || undefined,
					badge: libraryBadges.savedPlaylist,
					kind: "savedPlaylist" as const,
					onClick: () =>
						isLocalSource
							? openLocalPlaylist(playlist.spotify_playlist_id)
							: openSpotifyPlaylist(playlist.spotify_playlist_id),
				};
			}),
		[
			libraryBadges.savedPlaylist,
			likedPlaylists,
			openLocalPlaylist,
			openSpotifyPlaylist,
		]
	);

	const savedAlbumItems = useMemo<LibraryItem[]>(
		() =>
			likedAlbums.map((album) => {
				const data = album.album_data;
				const title = data?.title?.trim() || album.spotify_album_id;
				const artist = data?.artist?.trim() || t("unknownArtist");
				const year = data?.releaseYear
					? String(data.releaseYear)
					: undefined;
				const subtitle = [artist, year].filter(Boolean).join(" • ");

				return {
					key: `saved-album-${album.spotify_album_id}`,
					title,
					subtitle,
					coverUrl: data?.coverUrl || undefined,
					badge: libraryBadges.savedAlbum,
					kind: "savedAlbum" as const,
					onClick: () => openAlbum(album.spotify_album_id),
				};
			}),
		[libraryBadges.savedAlbum, likedAlbums, openAlbum, t]
	);

	const allItems = useMemo(
		() => [...myPlaylistItems, ...savedPlaylistItems, ...savedAlbumItems],
		[myPlaylistItems, savedAlbumItems, savedPlaylistItems]
	);

	const renderEmptyState = (description: string) => (
		<div className="text-center py-12">
			<div className="text-6xl mb-3">📚</div>
			<p className="text-gray-400 text-sm max-w-sm mx-auto">
				{description}
			</p>
		</div>
	);

	const renderSkeletons = () => (
		<div
			className={`${GRID_CLASSES} animate-pulse`}
			role="status"
			aria-label={t("loading")}
		>
			{Array.from({ length: SKELETON_COUNT }).map((_, index) => (
				<PlaylistCardSkeleton key={`library-skeleton-${index}`} />
			))}
		</div>
	);

	const renderLibraryCard = (item: LibraryItem) => (
		<button key={item.key} onClick={item.onClick} className="text-left">
			<div className="relative mb-3 aspect-square overflow-hidden bg-white/5">
				{item.coverUrl ? (
					<Image
						src={item.coverUrl}
						alt={item.title}
						fill
						sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-purple-200">
						{item.kind === "savedAlbum" ? (
							<svg
								className="w-7 h-7"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
							</svg>
						) : (
							<svg
								className="w-7 h-7"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M21 3v14h-4v4l-5-4H3V3h18zm-2 2H5v10h10.17L17 17.17V15h2V5z" />
							</svg>
						)}
					</div>
				)}
				<span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/70 text-[10px] font-semibold uppercase tracking-wide text-white">
					{item.badge}
				</span>
			</div>
			<h3 className="font-semibold text-white truncate mb-1">
				{item.title}
			</h3>
			{item.subtitle ? (
				<p className="text-xs text-gray-400 truncate">
					{item.subtitle}
				</p>
			) : null}
		</button>
	);

	const renderMyPlaylists = () => {
		if (isMyPlaylistsLoading) {
			return renderSkeletons();
		}

		if (myPlaylistItems.length === 0) {
			return renderEmptyState(t("empty.myPlaylists"));
		}

		return (
			<div className={GRID_CLASSES}>
				{myPlaylistItems.map(renderLibraryCard)}
			</div>
		);
	};

	const renderSavedPlaylists = () => {
		if (isLikedPlaylistsLoading) {
			return renderSkeletons();
		}

		if (savedPlaylistItems.length === 0) {
			return renderEmptyState(t("empty.savedPlaylists"));
		}

		return (
			<div className={GRID_CLASSES}>
				{savedPlaylistItems.map(renderLibraryCard)}
			</div>
		);
	};

	const renderSavedAlbums = () => {
		if (isLikedAlbumsLoading) {
			return renderSkeletons();
		}

		if (savedAlbumItems.length === 0) {
			return renderEmptyState(t("empty.savedAlbums"));
		}

		return (
			<div className={GRID_CLASSES}>
				{savedAlbumItems.map(renderLibraryCard)}
			</div>
		);
	};

	const renderAll = () => {
		if (
			isMyPlaylistsLoading ||
			isLikedPlaylistsLoading ||
			isLikedAlbumsLoading
		) {
			return renderSkeletons();
		}

		if (allItems.length === 0) {
			return renderEmptyState(t("empty.all"));
		}

		return (
			<div className={GRID_CLASSES}>
				{allItems.map(renderLibraryCard)}
			</div>
		);
	};

	let content: ReactNode;
	if (activeTab === "all") {
		content = renderAll();
	} else if (activeTab === "myPlaylists") {
		content = renderMyPlaylists();
	} else if (activeTab === "savedPlaylists") {
		content = renderSavedPlaylists();
	} else {
		content = renderSavedAlbums();
	}

	return (
		<SpotifyLayout>
			<div className="px-4 pt-8 pb-6 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
					<div>
						<h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
							{t("title")}
						</h1>
						<p className="text-gray-400 text-sm max-w-xl">
							{t("subtitle")}
						</p>
					</div>
					<button
						onClick={handleCreatePlaylist}
						className="self-start px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
					>
						{t("createPlaylistCTA")}
					</button>
				</div>

				<div
					role="tablist"
					aria-label={t("tabsLabel")}
					className="flex flex-wrap gap-2 mb-6"
				>
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								role="tab"
								aria-selected={isActive}
								className={`px-4 py-2 text-sm font-medium transition border ${
									isActive
										? "bg-purple-600 text-white border-purple-500"
										: "bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-transparent"
								}`}
							>
								{tab.label}
							</button>
						);
					})}
				</div>

				<div aria-live="polite">{content}</div>
			</div>
		</SpotifyLayout>
	);
}
