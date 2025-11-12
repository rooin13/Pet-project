"use client";

import { useMemo, useState } from "react";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { KebabMenu, PlaylistCardSkeleton } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	useCreatePlaylistMutation,
	useDeletePlaylistMutation,
	useGetMyPlaylistsQuery,
	useUpdatePlaylistMutation,
	type Playlist,
} from "@/shared/lib/api/musicApi";

type PlaylistSection = "public" | "private";

export default function CreatePlaylistPage() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("createPlaylist");

	const { data: playlists = [], isLoading } = useGetMyPlaylistsQuery();
	const [name, setName] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	const [createPlaylist, { isLoading: creating }] =
		useCreatePlaylistMutation();
	const [updatePlaylist] = useUpdatePlaylistMutation();
	const [deletePlaylist] = useDeletePlaylistMutation();

	const onCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		await createPlaylist({ name: name.trim(), isPublic }).unwrap();
		setName("");
	};

	const filteredPlaylists = useMemo(() => {
		if (!playlists.length) {
			return {
				public: [] as Playlist[],
				private: [] as Playlist[],
			};
		}
		return playlists.reduce(
			(acc, playlist) => {
				if (playlist.is_public) {
					acc.public.push(playlist);
				} else {
					acc.private.push(playlist);
				}
				return acc;
			},
			{ public: [] as Playlist[], private: [] as Playlist[] }
		);
	}, [playlists]);

	const getSectionLabel = (section: PlaylistSection) =>
		section === "public"
			? t("sections.public.title")
			: t("sections.private.title");

	return (
		<SpotifyLayout>
			<div className="px-4 pt-8 pb-6 sm:px-6 lg:px-8">
				<form
					onSubmit={onCreate}
					className="mb-12 max-w-sm"
					aria-labelledby="create-playlist-heading"
				>
					<h1
						id="create-playlist-heading"
						className="text-2xl font-bold text-white mb-4"
					>
						{t("title")}
					</h1>
					<div className="flex gap-3 mb-3">
						<div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								maxLength={20}
								className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
								placeholder={t("form.namePlaceholder")}
								aria-label={t("form.nameFieldLabel")}
							/>
						</div>
						<button
							type="submit"
							disabled={creating}
							className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white text-sm font-medium"
							aria-label={
								creating ? t("form.creating") : t("form.submit")
							}
						>
							{creating ? t("form.creating") : t("form.submit")}
						</button>
					</div>
					<label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
						<input
							type="checkbox"
							checked={isPublic}
							onChange={(e) => setIsPublic(e.target.checked)}
							className="accent-purple-500 w-4 h-4"
							aria-label={t("form.visibilityFieldLabel")}
						/>
						{t("form.visibilityFieldLabel")}
					</label>
				</form>

				<div>
					{isLoading ? (
						<div
							className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse"
							role="status"
							aria-label={t("loading")}
						>
							{Array.from({ length: 6 }).map((_, index) => (
								<PlaylistCardSkeleton
									key={`playlist-skeleton-${index}`}
								/>
							))}
						</div>
					) : playlists.length === 0 ? (
						<p className="text-gray-400">{t("empty")}</p>
					) : (
						<div className="space-y-8">
							{(["public", "private"] as PlaylistSection[])
								.map((section) => ({
									id: section,
									items: filteredPlaylists[section],
								}))
								.filter(({ items }) => items.length > 0)
								.map(({ id, items }) => (
									<section
										key={id}
										aria-labelledby={`playlist-section-${id}`}
									>
										<h2
											id={`playlist-section-${id}`}
											className="text-lg font-semibold text-white mb-4"
										>
											{getSectionLabel(id)}
										</h2>
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
											{items.map((playlist) => (
												<div
													key={playlist.id}
													onClick={() =>
														router.push(
															`/${locale}/playlist/${playlist.id}`
														)
													}
													className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 p-4 transition group cursor-pointer relative"
													role="article"
													aria-label={t(
														"cards.ariaLabel",
														{
															name: playlist.name,
														}
													)}
												>
													<div className="absolute -top-1 -right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
														<KebabMenu
															items={[
																{
																	label: playlist.is_public
																		? t(
																				"cards.makePrivate"
																		  )
																		: t(
																				"cards.makePublic"
																		  ),
																	onClick:
																		() =>
																			updatePlaylist(
																				{
																					playlistId:
																						playlist.id,
																					isPublic:
																						!playlist.is_public,
																				}
																			),
																},
																{
																	label: t(
																		"cards.delete"
																	),
																	onClick:
																		() =>
																			deletePlaylist(
																				{
																					playlistId:
																						playlist.id,
																				}
																			),
																	danger: true,
																},
															]}
															aria-label={t(
																"cards.menuAriaLabel",
																{
																	name: playlist.name,
																}
															)}
														/>
													</div>
													<div className="relative aspect-square bg-gray-800 mb-3 flex items-center justify-center border border-gray-700">
														<svg
															className="w-12 h-12 text-gray-600"
															fill="currentColor"
															viewBox="0 0 24 24"
															aria-hidden="true"
														>
															<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
														</svg>
														<button
															onClick={(
																event
															) => {
																event.stopPropagation();
																router.push(
																	`/${locale}/playlist/${playlist.id}`
																);
															}}
															className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
															aria-label={t(
																"cards.open",
																{
																	name: playlist.name,
																}
															)}
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
													</div>
													<h3 className="text-white font-medium truncate mb-1">
														{playlist.name}
													</h3>
													<p className="text-xs text-gray-500">
														{playlist.is_public
															? t("cards.public")
															: t(
																	"cards.private"
															  )}
													</p>
												</div>
											))}
										</div>
									</section>
								))}
						</div>
					)}
				</div>
			</div>
		</SpotifyLayout>
	);
}
