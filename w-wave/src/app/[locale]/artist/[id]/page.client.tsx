"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import {
	AddToPlaylistMenuEnhanced,
	usePlayTrack,
	useToggleLike,
	type LikePayload,
} from "@/features/music";
import { useArtistDetails } from "@/features/artist-details";
import { formatTime } from "@/widgets/player";

export default function ArtistPageClient({ artistId }: { artistId: string }) {
	const router = useRouter();
	const params = useParams<{ locale: string }>();
	const locale = params?.locale ?? "en";
	const { playTrack } = usePlayTrack();
	const {
		state: { artist, topTracks, similarArtists, isLoading },
	} = useArtistDetails(artistId, locale);

	if (isLoading) {
		return (
			<SpotifyLayout>
				<div className="flex items-center justify-center h-96">
					<div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
				</div>
			</SpotifyLayout>
		);
	}

	if (!artist) {
		return (
			<SpotifyLayout>
				<div className="flex items-center justify-center h-96">
					<p className="text-white">artist not found</p>
				</div>
			</SpotifyLayout>
		);
	}

	const handleTrackClick = (index: number) => {
		if (!topTracks.length || index < 0 || index >= topTracks.length) {
			return;
		}

		playTrack(topTracks[index], topTracks.slice(index + 1));
	};

	return (
		<SpotifyLayout>
			<div className="relative h-[260px]">
				<div className="absolute inset-0 overflow-hidden">
					{artist.imageUrl ? (
						<div className="absolute inset-0">
							<Image
								src={artist.imageUrl}
								alt=""
								fill
								sizes="100vw"
								className="object-cover blur-3xl opacity-40 scale-110"
								priority
							/>
							<div className="absolute inset-0 bg-linear-to-b from-purple-900/60 via-black/80 to-black" />
						</div>
					) : (
						<div className="absolute inset-0 bg-linear-to-b from-purple-900/60 via-black/80 to-black" />
					)}
				</div>

				<div className="relative z-10 flex items-end gap-6 px-8 py-4">
					<div className="w-52 h-52 shrink-0 rounded-full overflow-hidden bg-gray-800 shadow-2xl">
						{artist.imageUrl ? (
							<Image
								src={artist.imageUrl}
								alt={artist.name}
								width={208}
								height={208}
								className="w-full h-full object-cover"
								priority
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-6xl text-gray-600">
								🎤
							</div>
						)}
					</div>

					<div className="flex-1 min-w-0 pb-3">
						<p className="text-sm font-semibold mb-2 text-white/90">
							artist
						</p>
						<h1
							className="text-6xl font-black mb-6 text-white truncate cursor-pointer hover:underline"
							onClick={() =>
								router.push(`/${locale}/artist/${artist.id}`)
							}
							title={artist.name}
						>
							{artist.name}
						</h1>
						<div className="flex items-center gap-3 text-sm text-white/90 flex-wrap">
							<span className="font-semibold">
								{artist.followers.toLocaleString()} followers
							</span>
							{artist.genres.length > 0 && (
								<span className="text-white/70 truncate max-w-full">
									{artist.genres.slice(0, 3).join(" • ")}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="bg-linear-to-b from-black/40 to-black min-h-screen">
				{topTracks.length > 0 && (
					<section aria-label="top tracks">
						<div>
							{topTracks.map((track, index) => (
								<div
									key={track.id}
									onClick={() => handleTrackClick(index)}
									className="group flex items-center gap-4 px-8 py-3 hover:bg-white/10 transition cursor-pointer"
								>
									<span className="text-gray-400 text-sm font-medium w-6 text-right">
										{index + 1}
									</span>

									<div className="w-12 h-12 bg-gray-800 shrink-0 relative overflow-hidden rounded">
										{track.coverUrl ? (
											<Image
												src={track.coverUrl}
												alt={track.title}
												fill
												sizes="48px"
												className="object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-gray-500 text-lg">
												♪
											</div>
										)}
									</div>

									<div className="flex-1 min-w-0">
										<p
											className="text-white font-medium truncate"
											title={track.title}
										>
											{track.title}
										</p>
										<p className="text-sm text-gray-400 truncate">
											{track.artist}
										</p>
									</div>

									<span className="text-sm text-gray-400 tabular-nums">
										{formatTime(track.duration / 1000)}
									</span>

									<div
										onClick={(event) =>
											event.stopPropagation()
										}
										className="opacity-0 group-hover:opacity-100 transition flex items-center gap-2"
									>
										<AddToPlaylistMenuEnhanced
											trackId={track.id}
											trackData={track}
										/>
										<LikeButton
											trackId={track.id}
											trackData={track}
										/>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{similarArtists.length > 0 && (
					<section
						aria-label="similar artists"
						className="px-8 py-10 space-y-6"
					>
						<h2 className="text-2xl font-semibold text-white">
							similar artists
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{similarArtists.map((similarArtist) => (
								<button
									key={similarArtist.id}
									onClick={() =>
										router.push(
											`/${locale}/artist/${similarArtist.id}`
										)
									}
									className="group flex items-center gap-4 rounded-lg bg-white/5 p-4 text-left hover:bg-white/10 transition"
								>
									<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-800">
										{similarArtist.imageUrl ? (
											<Image
												src={similarArtist.imageUrl}
												alt={similarArtist.name}
												fill
												sizes="64px"
												className="object-cover transition duration-300 group-hover:scale-105"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-2xl text-gray-500">
												🎵
											</div>
										)}
									</div>
									<div className="min-w-0">
										<p className="text-white font-semibold truncate">
											{similarArtist.name}
										</p>
										<p className="text-sm text-white/60">
											view artist
										</p>
									</div>
								</button>
							))}
						</div>
					</section>
				)}
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
	const { isLiked, toggle, isLoading } = useToggleLike(trackId, trackData);

	return (
		<button
			onClick={(event) => {
				event.stopPropagation();
				toggle();
			}}
			disabled={isLoading}
			className="rounded-full p-2 hover:bg-white/20 transition disabled:opacity-50"
		>
			<svg
				className={`h-5 w-5 ${
					isLiked ? "text-purple-500" : "text-gray-300"
				}`}
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z" />
			</svg>
		</button>
	);
};
