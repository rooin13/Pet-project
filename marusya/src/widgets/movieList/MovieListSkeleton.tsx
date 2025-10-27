import { MovieCardSkeleton } from "@/entities/movie/ui/MovieCardSkeleton";

interface MovieListSkeletonProps {
	count?: number;
}

export const MovieListSkeleton = ({ count = 8 }: MovieListSkeletonProps) => {
	return (
		<ul className="flex gap-6 flex-wrap justify-center mb-10">
			{Array.from({ length: count }).map((_, index) => (
				<li key={index}>
					<MovieCardSkeleton />
				</li>
			))}
		</ul>
	);
};
