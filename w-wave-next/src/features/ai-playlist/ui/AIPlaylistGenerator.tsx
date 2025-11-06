"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiPlaylistRequestSchema, AIPlaylistFormData } from "../model/types";
import { useAIPlaylist } from "../model/hooks";

type Track = {
	id: string;
	title: string;
	artist: string;
	album: string;
	coverUrl: string;
	previewUrl: string | null;
	duration: number;
};

export const AIPlaylistGenerator = () => {
	const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
	const [reasoning, setReasoning] = useState<string>("");
	const { generatePlaylist, isLoading, error } = useAIPlaylist();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AIPlaylistFormData>({
		resolver: zodResolver(aiPlaylistRequestSchema),
		defaultValues: {
			useMyLikes: true,
		},
	});

	const onSubmit = async (data: AIPlaylistFormData) => {
		const result = await generatePlaylist(data.prompt, data.useMyLikes);

		if (result?.success && result.tracks) {
			setGeneratedTracks(result.tracks);
			setReasoning(result.reasoning || "");
		}
	};

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

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

			{/* ai reasoning */}
			{reasoning && (
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
					<h3 className="text-lg font-semibold text-white mb-2">
						🤖 AI Reasoning
					</h3>
					<p className="text-gray-300 leading-relaxed">{reasoning}</p>
				</div>
			)}

			{/* generated tracks */}
			{generatedTracks.length > 0 && (
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
					<h3 className="text-lg font-semibold text-white">
						Generated Playlist ({generatedTracks.length} tracks)
					</h3>

					<div className="h-3"></div>

					<div className="space-y-3">
						{generatedTracks.map((track, index) => (
							<div
								key={track.id}
								className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition group"
							>
								<span className="text-gray-500 text-sm font-medium w-6">
									{index + 1}
								</span>
								<Image
									src={track.coverUrl}
									alt={track.title}
									width={48}
									height={48}
									className="object-cover"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-white font-medium truncate">
										{track.title}
									</p>
									<p className="text-gray-400 text-sm truncate">
										{track.artist}
									</p>
								</div>
								<div className="text-gray-400 text-sm">
									{formatDuration(track.duration)}
								</div>
								{track.previewUrl && (
									<button
										onClick={() => {
											const audio = new Audio(
												track.previewUrl!
											);
											audio.play();
										}}
										className="opacity-0 group-hover:opacity-100 transition text-purple-400 hover:text-purple-300"
									>
										▶
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* empty state */}
			{generatedTracks.length === 0 && !isLoading && (
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center">
					<div className="text-6xl mb-4">🎵</div>
					<h3 className="text-xl font-semibold text-white mb-2">
						No playlist generated yet
					</h3>
					<p className="text-gray-400">
						Describe your perfect playlist above and let AI create
						it for you
					</p>
				</div>
			)}
		</div>
	);
};
