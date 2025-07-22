import Link from "next/link";
import MovieListWithPagination from "@/widgets/movie-list/MovieList";

interface Props {
	params: { slug: string };
}
export async function generateMetadata({ params }: Props) {
	return {
		title: params.slug.toLocaleUpperCase(),
	};
}

export default async function MoviePage({ params }: Props) {
	return (
		<>
			<div className="page-wrapper p-8 relative min-h-300">
				<Link className="group inline-flex" href={"/genres"}>
					<svg
						width={44}
						height={44}
						className="absolute top-8 left-2 transition-transform duration-300 group-hover:-translate-x-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#backarrow`} />
					</svg>
					<h3 className="pl-5 self-stretch mb-10 flex-grow-0 flex-shrink-0 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white">
						{params.slug.toLocaleUpperCase()}
					</h3>
				</Link>
				<MovieListWithPagination
					slug={params.slug}
				></MovieListWithPagination>
			</div>
		</>
	);
}
