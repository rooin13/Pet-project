"use client";

import { useEffect } from "react";
import { useAddTrackDialog } from "../model";

type AddTrackToPlaylistProps = {
	trackId: string;
	onClose?: () => void;
};

export const AddTrackToPlaylist = ({
	trackId,
	onClose,
}: AddTrackToPlaylistProps) => {
	const {
		state: { playlists, isLoading, isSuccess },
		handlers: { select, resetSuccess },
	} = useAddTrackDialog(trackId);

	useEffect(() => {
		if (!isSuccess) return;

		const timer = setTimeout(() => {
			resetSuccess();
			onClose?.();
		}, 1500);

		return () => clearTimeout(timer);
	}, [isSuccess, onClose, resetSuccess]);

	return (
		<div className="bg-gray-900 border border-gray-800 p-6 max-w-md">
			<h3 className="text-lg font-semibold text-white mb-4">
				add to playlist
			</h3>

			{isSuccess ? (
				<div className="text-center py-8">
					<div className="text-4xl mb-3">✓</div>
					<p className="text-green-400">added to playlist</p>
				</div>
			) : isLoading ? (
				<div className="text-center py-8 text-gray-400">
					loading playlists...
				</div>
			) : playlists.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-400 mb-3">no playlists yet</p>
					<p className="text-sm text-gray-500">
						create a playlist first
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{playlists.map((playlist) => (
						<button
							key={playlist.id}
							onClick={() => void select(playlist.id)}
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
