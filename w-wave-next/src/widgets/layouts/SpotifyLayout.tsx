"use client";

import { Sidebar } from "@/widgets/spotify/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const SpotifyLayout = ({ children }: { children: React.ReactNode }) => {
	const { currentTrack } = useSelector((state: RootState) => state.player);

	return (
		<div className="h-screen flex bg-black text-white">
			{/* sidebar */}
			<Sidebar />

			{/* right side: content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* main content */}
				<main
					className={`flex-1 bg-linear-to-b from-purple-900 to-black overflow-y-auto ${
						currentTrack ? "pb-14" : "pb-0"
					}`}
				>
					{children}
				</main>
			</div>
		</div>
	);
};
