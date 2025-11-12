"use client";

import { createPortal } from "react-dom";
import { useEnhancedPlaylistMenu, usePlaylistItemStatus } from "../model";

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
	const {
		state: { isOpen, playlists, menuPosition, isConfirmVisible, isLoading },
		refs: { menuRef, buttonRef },
		handlers: { toggle, select, confirm, cancelConfirm },
	} = useEnhancedPlaylistMenu(trackId, trackData ?? undefined);

	return (
		<>
			<button
				ref={buttonRef}
				onClick={(event) => {
					event.stopPropagation();
					toggle();
				}}
				className="p-2 hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
				aria-label="Add to playlist"
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
						{isLoading ? (
							<div
								className="px-4 py-3 space-y-3"
								role="status"
								aria-label="loading playlists"
							>
								{Array.from({ length: 4 }).map((_, index) => (
									<div
										key={`playlist-skeleton-${index}`}
										className="h-4 bg-gray-700 rounded animate-pulse"
									/>
								))}
							</div>
						) : !isConfirmVisible ? (
							playlists.length === 0 ? (
								<div className="px-4 py-3 text-sm text-gray-400">
									no playlists yet
								</div>
							) : (
								playlists.map((playlist) => (
									<PlaylistItem
										key={playlist.id}
										playlistId={playlist.id}
										playlistName={playlist.name}
										trackId={trackId}
										onAdd={select}
									/>
								))
							)
						) : (
							<div className="p-4 min-w-[240px]">
								<p className="text-sm text-white mb-3">
									track already in playlist. add again?
								</p>
								<div className="flex gap-2">
									<button
										onClick={() => void confirm()}
										className="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm"
									>
										yes
									</button>
									<button
										onClick={cancelConfirm}
										className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm"
									>
										no
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
	const isAdded = usePlaylistItemStatus(playlistId, trackId);

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
