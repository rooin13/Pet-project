import { RandomMovie } from "@/widgets/randomMovie/ui/RandomMovie";
import { TopMovies } from "@/widgets/topMovies/TopMovies";
import Link from "next/link";
export const metadata = {
	title: "MARUSYA",
	description: "A millions shows and movies to watch",
};

export default function Home() {
	return (
		<div>
			{/* <Link href="/movieGenres">Go to Movie Genres</Link> */}
			<RandomMovie />
			<TopMovies></TopMovies>
		</div>
	);
}
