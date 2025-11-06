"use client";

import { useState } from "react";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { KebabMenu } from "@/shared/ui";
import { useRouter, usePathname } from "next/navigation";
import {
	useCreatePlaylistMutation,
	useDeletePlaylistMutation,
	useGetMyPlaylistsQuery,
	useUpdatePlaylistMutation,
	type Playlist,
} from "@/shared/lib/api/musicApi";

export default function CreatePlaylistPage() {
	const router = useRouter();
	const pathname = usePathname();
	const locale = pathname?.split("/")[1] || "en";

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

	return (
		<SpotifyLayout>
			<div className="p-8">
				<h1 className="text-3xl font-bold text-white">
					Create Playlist
				</h1>

				<div className="h-3"></div>

				<form onSubmit={onCreate} className="mb-12 max-w-sm">
					<div className="flex gap-3 mb-3">
						<div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								maxLength={20}
								className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
								placeholder="Playlist name"
							/>
						</div>
						<button
							type="submit"
							disabled={creating}
							className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white text-sm font-medium"
						>
							{creating ? "..." : "Create"}
						</button>
					</div>
					<label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
						<input
							type="checkbox"
							checked={isPublic}
							onChange={(e) => setIsPublic(e.target.checked)}
							className="accent-purple-500 w-4 h-4"
						/>
						Make public
					</label>
				</form>

				<div>
					<h2 className="text-lg font-semibold text-white">
						Your Playlists
					</h2>

					<div className="h-3"></div>

					{isLoading ? (
						<p className="text-gray-400">Loading...</p>
					) : playlists.length === 0 ? (
						<p className="text-gray-400">No playlists yet</p>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{playlists.map((p: Playlist) => (
								<div
									key={p.id}
									onClick={() =>
										router.push(
											`/${locale}/playlist/${p.id}`
										)
									}
									className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 p-4 transition group cursor-pointer relative"
								>
									<div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
										<KebabMenu
											items={[
												{
													label: p.is_public
														? "Make Private"
														: "Make Public",
													onClick: () =>
														updatePlaylist({
															playlistId: p.id,
															isPublic:
																!p.is_public,
														}),
												},
												{
													label: "Delete",
													onClick: () =>
														deletePlaylist({
															playlistId: p.id,
														}),
													danger: true,
												},
											]}
										/>
									</div>
									<div className="relative aspect-square bg-gray-800 mb-3 flex items-center justify-center border border-gray-700">
										<svg
											className="w-12 h-12 text-gray-600"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
										</svg>
										<button
											onClick={(e) => {
												e.stopPropagation();
												router.push(
													`/${locale}/playlist/${p.id}`
												);
											}}
											className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
										>
											<div className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center transition">
												<svg
													className="w-5 h-5 text-black ml-0.5"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</button>
									</div>
									<h3 className="text-white font-medium truncate mb-1">
										{p.name}
									</h3>
									<p className="text-xs text-gray-500">
										{p.is_public ? "Public" : "Private"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</SpotifyLayout>
	);
}
