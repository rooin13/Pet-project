"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Track } from "@/entities/track";
import { TrackRow } from "@/entities/track";
import {
	usePlayTrack,
	AddToPlaylistMenuEnhanced,
	useToggleLike,
} from "@/features/music";
import { TrackRowSkeleton } from "@/shared/ui";
import {
	aiPlaylistRequestSchema,
	type AIPlaylistFormData,
	type AIPlaylistFormInput,
} from "../model/types";
import { useAIPlaylist } from "../model/hooks";

type GeneratedTrack = {
	id: string;
	title: string;
	artist: string;
	album: string;
	coverUrl: string;
	previewUrl: string | null;
	duration: number;
};

export const AIPlaylistGenerator = () => {
	const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>(
		[]
	);
	const [reasoning, setReasoning] = useState<string>("");
	const { generatePlaylist, isLoading, error } = useAIPlaylist();
	const { playTrack } = usePlayTrack();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AIPlaylistFormInput, undefined, AIPlaylistFormData>({
		resolver: zodResolver(aiPlaylistRequestSchema),
		defaultValues: {
			useMyLikes: true,
		},
	});

	const onSubmit = useCallback(
		async (data: AIPlaylistFormData) => {
			const result = await generatePlaylist(data.prompt, data.useMyLikes);

			if (result?.success && result.tracks) {
				setGeneratedTracks(result.tracks);
				setReasoning(result.reasoning || "");
			}
		},
		[generatePlaylist]
	);

	const mappedTracks = useMemo<Track[]>(() => {
		return generatedTracks.map((track) => ({
			id: track.id,
			title: track.title,
			artist: track.artist,
			artistId: undefined,
			album: track.album,
			albumId: undefined,
			coverUrl: track.coverUrl,
			previewUrl: track.previewUrl,
			duration: track.duration,
		}));
	}, [generatedTracks]);

	const handleTrackClick = useCallback(
		(track: Track, index: number) => {
			const nextQueue = mappedTracks.slice(index);
			playTrack(track, nextQueue);
		},
		[mappedTracks, playTrack]
	);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			{/* form */}
			<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition p-6">
				<h2 className="text-2xl font-bold text-white">
					AI Playlist Generator
				</h2>

				<div className="h-3"></div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label htmlFor="prompt" className="sr-only">
							Tell AI what kind of playlist to create
						</label>
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
							<textarea
								id="prompt"
								{...register("prompt")}
								placeholder="e.g., Create a workout playlist with high-energy electronic music"
								className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none resize-none"
								rows={3}
							/>
						</div>
						{errors.prompt && (
							<p className="text-red-400 text-sm mt-1">
								{errors.prompt.message}
							</p>
						)}
					</div>

					<label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
						<input
							type="checkbox"
							id="useMyLikes"
							{...register("useMyLikes")}
							className="w-4 h-4 accent-purple-500"
						/>
						Use my liked tracks as reference
					</label>

					{error && (
						<div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 text-sm">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition"
					>
						{isLoading ? "Generating..." : "✨ Generate Playlist"}
					</button>
				</form>
			</div>

			{/* loading state */}
			{isLoading && (
				<div
					className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 animate-pulse"
					aria-live="polite"
				>
					<div className="h-4 bg-white/10 rounded w-40 mb-4" />
					<div className="space-y-3">
						{Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className="bg-white/0">
								<TrackRowSkeleton />
							</div>
						))}
					</div>
				</div>
			)}

			{/* ai reasoning */}
			{!isLoading && reasoning && (
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
					<h3 className="text-lg font-semibold text-white mb-2">
						🤖 AI Reasoning
					</h3>
					<p className="text-gray-300 leading-relaxed">{reasoning}</p>
				</div>
			)}

			{/* generated tracks */}
			{!isLoading &&
				generatedTracks.length > 0 &&
				mappedTracks.length > 0 && (
					<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
						<h3 className="text-lg font-semibold text-white">
							Generated Playlist ({generatedTracks.length} tracks)
						</h3>

						<div className="h-3"></div>

						<div className="space-y-2">
							{mappedTracks.map((track, index) => (
								<GeneratedTrackRow
									key={track.id}
									index={index}
									track={track}
									source={generatedTracks[index]}
									onPlay={() =>
										handleTrackClick(track, index)
									}
								/>
							))}
						</div>
					</div>
				)}
		</div>
	);
};

type GeneratedTrackRowProps = {
	track: Track;
	source: GeneratedTrack;
	index: number;
	onPlay: () => void;
};

const GeneratedTrackRow = ({
	track,
	source,
	index,
	onPlay,
}: GeneratedTrackRowProps) => {
	const playlistPayload = {
		title: track.title,
		artist: track.artist,
		coverUrl: track.coverUrl,
		duration: track.duration,
		album: source.album,
		previewUrl: track.previewUrl,
	};

	const { isLiked, toggle } = useToggleLike(track.id, {
		title: track.title,
		artist: track.artist,
		coverUrl: track.coverUrl,
		duration: track.duration,
		album: source.album,
		previewUrl: track.previewUrl,
	});

	return (
		<TrackRow
			index={index}
			title={track.title}
			artist={track.artist}
			coverUrl={track.coverUrl || undefined}
			durationMs={track.duration}
			onClick={onPlay}
			onPlayOverlay={onPlay}
			actions={
				<>
					<div onClick={(event) => event.stopPropagation()}>
						<AddToPlaylistMenuEnhanced
							trackId={track.id}
							trackData={playlistPayload}
						/>
					</div>
					<button
						onClick={(event) => {
							event.stopPropagation();
							toggle();
						}}
						className="p-2 rounded-full text-gray-300 transition hover:bg-gray-700 hover:text-white"
						aria-label={
							isLiked ? "Remove from liked" : "Add to liked"
						}
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
