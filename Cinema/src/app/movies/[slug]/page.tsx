import { getMovieBySlug } from "@/shared/lib/api/moviesApi/api";
import { notFound } from "next/navigation";
import { MovieDetails } from "@/entities/movie/ui/MovieDetails";

interface Props {
	params: { slug: string };
}

export default async function MoviePage({ params }: Props) {
	const movie = await getMovieBySlug(params.slug);

	if (!movie) return notFound();

	return (
		<div className="page-wrapper p-8">
			<MovieDetails {...movie} />
		</div>
	);
}
