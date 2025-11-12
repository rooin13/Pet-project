"use client";

import { Sidebar } from "@/widgets/sidebar";
import { MobileHeader } from "@/widgets/mobile-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { usePlayerState } from "@/widgets/player";

export const SpotifyLayout = ({ children }: { children: React.ReactNode }) => {
	const { currentTrack } = usePlayerState();

	return (
		<div className="h-screen flex bg-black text-white">
			{/* desktop sidebar - only on desktop */}
			<div className="hidden lg:block">
				<Sidebar />
			</div>

			{/* mobile header - only on mobile */}
			<div className="lg:hidden">
				<MobileHeader />
			</div>

			{/* right side: content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* main content */}
				<main
					className={`flex-1 bg-linear-to-b from-purple-900 to-black overflow-y-auto
						pt-14 lg:pt-0
						${currentTrack ? "pb-32" : "pb-16"}
						${currentTrack ? "lg:pb-14" : "lg:pb-0"}
					`}
				>
					{children}
				</main>
			</div>

			{/* mobile bottom navigation - only on mobile */}
			<div className="lg:hidden">
				<BottomNav />
			</div>
		</div>
	);
};
