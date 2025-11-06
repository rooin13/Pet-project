"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

type SpotifyPlaylist = {
	id: string;
	title: string;
	description: string;
	coverUrl: string;
	owner: string;
	tracksCount: number;
};

export const MainContent = () => {
	const t = useTranslations("main");
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;
	const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// загружаем реальные плейлисты из Spotify
		fetch("/api/spotify/featured-playlists")
			.then((res) => res.json())
			.then((data) => {
				if (data.playlists) {
					setPlaylists(data.playlists);
				}
			})
			.catch((err) => console.error("Failed to load playlists:", err))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="p-4 md:p-8">
			{/* featured playlists */}
			<section className="mb-10">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Featured Playlists</h2>
				</div>
				{loading ? (
					<div className="text-center py-12">
						<div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{playlists.slice(0, 5).map((playlist) => (
							<div
								key={playlist.id}
								onClick={() =>
									router.push(
										`/${locale}/playlist/${playlist.id}`
									)
								}
								className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 p-4 transition cursor-pointer group"
							>
								<div className="relative mb-3 aspect-square bg-gray-800 overflow-hidden">
									<Image
										src={playlist.coverUrl}
										alt={playlist.title}
										fill
										sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
										<button
											className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center transition"
											aria-label={`Play ${playlist.title}`}
										>
											<svg
												className="w-5 h-5 text-black ml-0.5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M8 5v14l11-7z" />
											</svg>
										</button>
									</div>
								</div>
								<h3 className="font-semibold text-white mb-1 truncate">
									{playlist.title}
								</h3>
								<p className="text-xs text-gray-400 truncate">
									{playlist.tracksCount} tracks
								</p>
							</div>
						))}
					</div>
				)}
			</section>

			{/* playlists for you */}
			<section>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">
						{t("playlistsForYou")}
					</h2>
					<button className="text-sm font-semibold text-gray-400 hover:text-white transition">
						Show all
					</button>
				</div>
				{loading ? (
					<div className="text-center py-12">
						<div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{playlists.map((playlist) => (
							<div
								key={playlist.id}
								onClick={() =>
									router.push(
										`/${locale}/playlist/${playlist.id}`
									)
								}
								className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 p-4 transition cursor-pointer group"
							>
								<div className="relative mb-3 aspect-square bg-gray-800 overflow-hidden">
									<Image
										src={playlist.coverUrl}
										alt={playlist.title}
										fill
										sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
										<button
											className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center transition"
											aria-label={`Play ${playlist.title}`}
										>
											<svg
												className="w-5 h-5 text-black ml-0.5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M8 5v14l11-7z" />
											</svg>
										</button>
									</div>
								</div>
								<h3 className="font-semibold text-white mb-1 truncate">
									{playlist.title}
								</h3>
								<p className="text-xs text-gray-400 line-clamp-2">
									{playlist.description ||
										`${playlist.tracksCount} tracks`}
								</p>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
};
