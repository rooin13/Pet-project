"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { AIPlaylistGenerator } from "@/features/ai-playlist";
import { Container } from "@/shared/ui";

export default function AIPlaylistPage() {
	return (
		<SpotifyLayout>
			<div className="pt-8 pb-24">
				<Container>
					<AIPlaylistGenerator />
				</Container>
			</div>
		</SpotifyLayout>
	);
}
