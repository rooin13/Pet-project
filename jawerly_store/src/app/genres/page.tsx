import MovieGenresList from "@/widgets/movie-genres/ui/movieGenresList/MovieGenresList";
import { getGenres } from "@/shared/lib/api/genres-api/api";

export const metadata = {
	title: "Genres",
	description: "",
};

const MovieGenresPage = async () => {
	const genres = await getGenres();
	return (
		<div className="page-wrapper">
			<h3 className="self-stretch mb-10 flex-grow-0 flex-shrink-0 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white">
				Genres
			</h3>
			<MovieGenresList genres={genres} />
		</div>
	);
};

export default MovieGenresPage;
