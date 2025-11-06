"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";

export default function LibraryPage() {
	return (
		<SpotifyLayout>
			<div className="p-8">
				<h1 className="text-3xl font-bold text-white">Your Library</h1>

				<div className="h-3"></div>

				<div className="text-center py-12">
					<div className="text-6xl mb-4">📚</div>
					<h3 className="text-xl font-semibold text-white mb-2">
						Coming soon
					</h3>
					<p className="text-gray-400">
						Your playlists and saved content will appear here
					</p>
				</div>
			</div>
		</SpotifyLayout>
	);
}
