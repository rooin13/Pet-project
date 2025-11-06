"use client";

import { useState } from "react";
import {
	useGetMyPlaylistsQuery,
	useAddTrackToPlaylistMutation,
} from "@/shared/lib/api/musicApi";

type AddTrackToPlaylistProps = {
	trackId: string;
	onClose?: () => void;
};

export const AddTrackToPlaylist = ({
	trackId,
	onClose,
}: AddTrackToPlaylistProps) => {
	const { data: playlists = [] } = useGetMyPlaylistsQuery();
	const [addTrack] = useAddTrackToPlaylistMutation();
	const [success, setSuccess] = useState(false);

	const handleAddToPlaylist = async (playlistId: string) => {
		await addTrack({ playlistId, trackId });
		setSuccess(true);
		setTimeout(() => {
			setSuccess(false);
			onClose?.();
		}, 1500);
	};

	return (
		<div className="bg-gray-900 border border-gray-800 p-6 max-w-md">
			<h3 className="text-lg font-semibold text-white mb-4">
				Add to Playlist
			</h3>

			{success ? (
				<div className="text-center py-8">
					<div className="text-4xl mb-3">✓</div>
					<p className="text-green-400">Added to playlist!</p>
				</div>
			) : playlists.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-400 mb-3">No playlists yet</p>
					<p className="text-sm text-gray-500">
						Create a playlist first
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{playlists.map((playlist) => (
						<button
							key={playlist.id}
							onClick={() => handleAddToPlaylist(playlist.id)}
							className="w-full px-4 py-2 text-left bg-gray-800 hover:bg-gray-700 text-white text-sm transition"
						>
							{playlist.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
