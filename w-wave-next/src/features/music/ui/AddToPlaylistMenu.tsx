"use client";

import { useState, useRef, useEffect } from "react";
import {
	useGetMyPlaylistsQuery,
	useAddTrackToPlaylistMutation,
} from "@/shared/lib/api/musicApi";

type AddToPlaylistMenuProps = {
	trackId: string;
	trackData?: {
		title: string;
		artist: string;
		coverUrl: string;
		duration: number;
		album?: string;
	};
};

export const AddToPlaylistMenu = ({
	trackId,
	trackData,
}: AddToPlaylistMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { data: playlists = [] } = useGetMyPlaylistsQuery();
	const [addTrack] = useAddTrackToPlaylistMutation();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleAddToPlaylist = async (playlistId: string) => {
		await addTrack({ playlistId, trackId, trackData });
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				className="p-2 hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
			>
				<svg
					className="w-5 h-5 text-gray-300"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					strokeWidth="2"
				>
					<path
						d="M12 5v14M5 12h14"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 shadow-lg z-[60] min-w-[200px] max-h-[300px] overflow-y-auto">
					{playlists.length === 0 ? (
						<div className="px-4 py-3 text-sm text-gray-400">
							No playlists yet
						</div>
					) : (
						playlists.map((playlist) => (
							<button
								key={playlist.id}
								onClick={(e) => {
									e.stopPropagation();
									handleAddToPlaylist(playlist.id);
								}}
								className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition truncate"
							>
								{playlist.name}
							</button>
						))
					)}
				</div>
			)}
		</div>
	);
};
