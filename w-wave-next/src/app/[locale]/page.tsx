"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { MainContent } from "@/widgets/spotify/MainContent";

export default function HomePage() {
	return (
		<SpotifyLayout>
			<MainContent />
		</SpotifyLayout>
	);
}
