"use client";

import { useAddToPlaylistMenu } from "../model";

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
	const {
		state: { isOpen, playlists, isLoading },
		refs: { menuRef },
		handlers: { toggle, select },
	} = useAddToPlaylistMenu(trackId, trackData);

	return (
		<div className="relative" ref={menuRef}>
			<button
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

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 shadow-lg z-60 min-w-[200px] max-h-[300px] overflow-y-auto">
					{isLoading ? (
						<div className="px-4 py-3 text-sm text-gray-400">
							loading playlists...
						</div>
					) : playlists.length === 0 ? (
						<div className="px-4 py-3 text-sm text-gray-400">
							no playlists yet
						</div>
					) : (
						playlists.map((playlist) => (
							<button
								key={playlist.id}
								onClick={(event) => {
									event.stopPropagation();
									void select(playlist.id);
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
