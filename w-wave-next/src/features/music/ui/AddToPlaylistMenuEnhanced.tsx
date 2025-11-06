"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
	useGetMyPlaylistsQuery,
	useAddTrackToPlaylistMutation,
} from "@/shared/lib/api/musicApi";
import { useIsTrackInPlaylistQuery } from "@/shared/lib/api/playlistTracksApi";

type AddToPlaylistMenuProps = {
	trackId: string;
	trackData?: {
		title?: string;
		artist?: string;
		coverUrl?: string;
		duration?: number;
		album?: string;
		previewUrl?: string | null;
	} | null;
};

export const AddToPlaylistMenuEnhanced = ({
	trackId,
	trackData,
}: AddToPlaylistMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
		null
	);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuPosition, setMenuPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const { data: playlists = [] } = useGetMyPlaylistsQuery();
	const [addTrack] = useAddTrackToPlaylistMutation();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
				setShowConfirm(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setMenuPosition({
				top: rect.bottom + window.scrollY,
				left: rect.right + window.scrollX - 200, // 200px - ширина меню
			});
		}
	}, [isOpen]);

	const handleAddToPlaylist = async (
		playlistId: string,
		alreadyAdded: boolean
	) => {
		if (alreadyAdded) {
			setSelectedPlaylist(playlistId);
			setShowConfirm(true);
			return;
		}

		await addTrack({ playlistId, trackId, trackData });
		setIsOpen(false);
	};

	const confirmAdd = async () => {
		if (selectedPlaylist) {
			await addTrack({
				playlistId: selectedPlaylist,
				trackId,
				trackData,
			});
		}
		setShowConfirm(false);
		setIsOpen(false);
		setSelectedPlaylist(null);
	};

	return (
		<>
			<button
				ref={buttonRef}
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

			{isOpen &&
				menuPosition &&
				typeof window !== "undefined" &&
				createPortal(
					<div
						ref={menuRef}
						style={{
							position: "fixed",
							top: `${menuPosition.top}px`,
							left: `${menuPosition.left}px`,
							zIndex: 10000,
						}}
						className="bg-gray-800 border border-gray-700 shadow-lg min-w-[200px] max-h-[300px] overflow-y-auto"
					>
						{!showConfirm ? (
							playlists.length === 0 ? (
								<div className="px-4 py-3 text-sm text-gray-400">
									No playlists yet
								</div>
							) : (
								playlists.map((playlist) => (
									<PlaylistItem
										key={playlist.id}
										playlistId={playlist.id}
										playlistName={playlist.name}
										trackId={trackId}
										onAdd={handleAddToPlaylist}
									/>
								))
							)
						) : (
							<div className="p-4 min-w-[240px]">
								<p className="text-sm text-white mb-3">
									Track already in playlist. Add again?
								</p>
								<div className="flex gap-2">
									<button
										onClick={confirmAdd}
										className="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm"
									>
										Yes
									</button>
									<button
										onClick={() => {
											setShowConfirm(false);
											setSelectedPlaylist(null);
										}}
										className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm"
									>
										No
									</button>
								</div>
							</div>
						)}
					</div>,
					document.body
				)}
		</>
	);
};

const PlaylistItem = ({
	playlistId,
	playlistName,
	trackId,
	onAdd,
}: {
	playlistId: string;
	playlistName: string;
	trackId: string;
	onAdd: (playlistId: string, alreadyAdded: boolean) => void;
}) => {
	const { data: isAdded = false } = useIsTrackInPlaylistQuery({
		playlistId,
		trackId,
	});

	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onAdd(playlistId, isAdded);
			}}
			className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition truncate flex items-center justify-between"
		>
			<span className="truncate">{playlistName}</span>
			{isAdded && (
				<svg
					className="w-4 h-4 text-green-400 shrink-0 ml-2"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
				</svg>
			)}
		</button>
	);
};
