import { Movie } from "@/"
const mockMovies: Movie[] = [
    {
        slug: "inception",
        title: "Inception",
        description: "A mind-bending thriller.",
        coverUrl: "/images/inception.jpg"
    },
    {
        slug: "interstellar",
        title: "Interstellar",
        description: "Journey through space and time.",
        coverUrl: "/images/interstellar.jpg"
    },
];

export async function getMovieBySlug(slug: string) {
    return mockMovies.find((movie) => movie.slug === slug) || null;
}
