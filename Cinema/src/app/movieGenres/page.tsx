import MovieGenresList from "@/widgets/movieGenres/ui/movieGenresList/movieGenresList";
import { getGenres } from "@/shared/lib/api/genresApi/genre.server";

export const metadata = {
	title: "Genres",
	description: "MovieGenres",
};

const MovieGenresPage = async () => {
	const genres = await getGenres();
	return (
		<div className="page-wrapper">
			<h1>Genres</h1>
			<MovieGenresList genres={genres} />
		</div>
	);
};

export default MovieGenresPage;
