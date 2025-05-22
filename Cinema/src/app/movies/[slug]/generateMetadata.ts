
import { Metadata } from "next";
import { getMovieBySlug } from "@/shared/lib/api/moviesApi/api";


interface Props {
    params: { slug: string };
}
console.log("generateMetadata called")

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const movie = await getMovieBySlug(params.slug);


    return {
        title: movie.title,
        description: movie.plot,
        openGraph: {
            title: movie.title,
            description: movie.plot,
            images: [movie.posterUrl],
        },
    };
}
