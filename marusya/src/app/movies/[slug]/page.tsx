import { MovieDetails } from "@/entities/movie/ui/MovieDetails";
import { getMovieBySlug } from "@/shared/lib/api/moviesApi";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
	params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	try {
		const movie = await getMovieBySlug(params.slug);

		if (!movie) return { title: "Movie Not Found" };

		return {
			title: `${movie.title} (${movie.releaseYear}) - MARUSYA`,
			description:
				movie.plot?.substring(0, 160) || "Watch this amazing movie",
			keywords: [
				movie.title,
				...movie.genres,
				`${movie.releaseYear}`,
				"watch online",
			],
			openGraph: {
				title: movie.title,
				description: movie.plot?.substring(0, 160) || "",
				images: movie.backdropUrl ? [movie.backdropUrl] : [],
				type: "video.movie",
			},
			twitter: {
				card: "summary_large_image",
				title: movie.title,
				description: movie.plot?.substring(0, 160) || "",
				images: movie.backdropUrl ? [movie.backdropUrl] : [],
			},
		};
	} catch (error) {
		return { title: "Movie Not Found" };
	}
}

export default async function MoviePage({ params }: Props) {
	try {
		const movie = await getMovieBySlug(params.slug);

		if (!movie) return notFound();

		return (
			<div className="page-wrapper pt-2 pb-8">
				<MovieDetails {...movie} />
			</div>
		);
	} catch (error) {
		console.error("Failed to load movie page:", error);
		return notFound();
	}
}
