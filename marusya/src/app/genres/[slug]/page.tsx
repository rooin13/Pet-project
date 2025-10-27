import Link from "next/link";
import MovieListWithPagination from "@/widgets/movieList/MovieListWithPagination";

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
			<div className="page-wrapper relative min-h-300">
				<Link
					className="group inline-flex mb-10 items-center"
					href={"/genres"}
				>
					<svg
						width={44}
						height={44}
						className="transition-transform duration-300 group-hover:-translate-x-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#backarrow`} />
					</svg>
					<h3 className="pl-2 self-stretch flex-grow-0 flex-shrink-0 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white uppercase">
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
