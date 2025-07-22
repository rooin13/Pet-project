import { MovieDetails } from "@/entities/movie/ui/MovieDetails";
import { getMovieBySlug } from "@/shared/lib/api/movies-api/api";
import { notFound } from "next/navigation";

interface Props {
	params: { slug: string };
}
export async function generateMetadata({ params }: Props) {
	const movie = await getMovieBySlug(params.slug);

	if (!movie) return {};

	return {
		title: movie.title,
		description: movie.plot,
	};
}

export default async function MoviePage({ params }: Props) {
	const movie = await getMovieBySlug(params.slug);
	<div className="sr-only">
		<h2 className="sr-only">Title:{movie.title}</h2>
		<p className="sr-only">Genre: {movie.genres}</p>
		<p className="sr-only">Plot: {movie.plot}</p>
		<p className="sr-only">Director: {movie.director}</p>
	</div>;
	if (!movie) return notFound();
	return (
		<>
			<div className="page-wrapper p-8">
				<MovieDetails {...movie} />
			</div>
		</>
	);
}
