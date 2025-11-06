"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { UniversalSearch } from "@/features/search";

export default function SearchPage() {
	return (
		<SpotifyLayout>
			<div className="p-8">
				<h1 className="text-3xl font-bold text-white">Search</h1>
				<div className="h-3"></div>
				<UniversalSearch />
			</div>
		</SpotifyLayout>
	);
}
