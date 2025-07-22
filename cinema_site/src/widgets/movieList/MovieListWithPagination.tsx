"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard from "@/entities/movie/ui/MovieCard";
import { getMovieByGenre } from "@/shared/lib/api/genresApi/api";
import { IMovie } from "@/entities/movie/model/types";
import { AnimatePresence, motion } from "framer-motion";
import { itemVariants, listVariants } from "@/shared/lib/animations/animation";

interface Props {
	slug: string;
}

export default function MovieListWithPagination({ slug }: Props) {
	const [movies, setMovies] = useState<IMovie[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const observerRef = useRef(null);
	const [lastBatchStart, setLastBatchStart] = useState(0);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);
			try {
				const res = await getMovieByGenre(slug, page);
				if (res.length === 0) {
					setHasMore(false);
				} else {
					setLastBatchStart((prevMovies) => {
						return movies.length;
					});
					setMovies((prev) => [...prev, ...res]);
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchMovies();
	}, [slug, page]);

	useEffect(() => {
		if (isLoading) return;
		if (!hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage((prev) => prev + 1);
				}
			},
			{ threshold: 1 }
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [isLoading, hasMore]);

	return (
		<>
			<motion.ul className="flex gap-6 flex-wrap justify-center mb-10">
				<AnimatePresence>
					{movies.map((movie, index) => {
						const localIndex =
							index >= lastBatchStart
								? index - lastBatchStart
								: -1;

						const delay = localIndex >= 0 ? localIndex * 0.6 : 0;

						return (
							<motion.li
								key={movie.id}
								custom={delay}
								variants={itemVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								<MovieCard movie={movie} index={index} />
							</motion.li>
						);
					})}
				</AnimatePresence>
			</motion.ul>
			{isLoading && <p className="pl-20">Loading...</p>}
			<div ref={observerRef} className="h-10"></div>
			{!hasMore && <p>No more movies</p>}
		</>
	);
}
