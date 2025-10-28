import { MovieCardSkeleton } from "@/entities/movie/ui/MovieCardSkeleton";

interface MovieListSkeletonProps {
	count?: number;
}

export const MovieListSkeleton = ({ count = 8 }: MovieListSkeletonProps) => {
	return (
		<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
			{Array.from({ length: count }).map((_, index) => (
				<li key={index}>
					<MovieCardSkeleton />
				</li>
			))}
		</ul>
	);
};
