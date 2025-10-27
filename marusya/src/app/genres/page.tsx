import { getGenres } from "@/shared/lib/api/genresApi";
import MovieGenresList from "@/widgets/movieGenres/ui/movieGenresList/MovieGenresList";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Movie Genres - MARUSYA",
	description:
		"Browse movies by genre: Action, Drama, Comedy, Horror, Sci-Fi and more. Find your favorite movie genre.",
	keywords: [
		"movie genres",
		"film categories",
		"action movies",
		"drama films",
		"comedy",
	],
	openGraph: {
		title: "Movie Genres - MARUSYA",
		description: "Browse movies by genre and discover new films",
		type: "website",
	},
};

const MovieGenresPage = async () => {
	const genres = await getGenres();
	return (
		<div className="page-wrapper">
			<Link href="/" className="group inline-flex mb-10 items-center">
				<svg
					width={44}
					height={44}
					className="transition-transform duration-300 group-hover:-translate-x-2"
				>
					<use xlinkHref="/images/icons/icons.xml#backarrow" />
				</svg>
				<h3 className="pl-2 flex-grow-0 flex-shrink-0 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white uppercase">
					Genres
				</h3>
			</Link>
			<MovieGenresList genres={genres} />
		</div>
	);
};

export default MovieGenresPage;
