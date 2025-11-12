"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { UniversalSearch } from "@/features/search";

export default function SearchPage() {
	return (
		<SpotifyLayout>
			<div className="px-4 pt-8 pb-6 sm:px-6 lg:px-8">
				<UniversalSearch />
			</div>
		</SpotifyLayout>
	);
}
