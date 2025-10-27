import { RandomMovie } from "@/widgets/randomMovie/ui/RandomMovie";
import { TopMovies } from "@/widgets/topMovies/ui/TopMovies";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "MARUSYA - Watch Movies & TV Shows Online",
	description:
		"Discover millions of movies and TV shows. Watch trailers, read reviews, and find your next favorite film.",
	keywords: [
		"movies",
		"tv shows",
		"cinema",
		"watch online",
		"film reviews",
		"movie trailers",
	],
	openGraph: {
		title: "MARUSYA - Watch Movies & TV Shows",
		description: "Discover millions of movies and TV shows online",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "MARUSYA - Movies & TV Shows",
		description: "Discover millions of movies and TV shows online",
	},
};

export default function Home() {
	return (
		<div>
			<div className="pt-4 md:pt-8">
				<RandomMovie />
			</div>
			<TopMovies />
		</div>
	);
}
