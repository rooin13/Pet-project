import { RandomMovie } from "@/widgets/randomMovie/ui/RandomMovie";
import { TopMovies } from "@/widgets/topMovies/ui/TopMovies";

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
