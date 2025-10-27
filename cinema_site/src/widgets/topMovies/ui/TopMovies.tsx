"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	useTopMovies,
	useScrollToTop,
	useParallaxScroll,
} from "../model/hooks";

export const TopMovies = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { movies, isLoading } = useTopMovies();

	useScrollToTop(containerRef, isLoading);
	useParallaxScroll(containerRef, scrollContainerRef, movies);

	if (isLoading) {
		return (
			<div className="py-10">
				<h2 className="text-5xl font-bold text-white mb-10 text-center">
					Top Movies
				</h2>
				<p className="text-white text-center">Loading...</p>
			</div>
		);
	}

	if (movies.length === 0) {
		return (
			<div className="py-10">
				<h2 className="text-5xl font-bold text-white mb-10 text-center">
					Top Movies
				</h2>
				<p className="text-white text-center">No movies available</p>
			</div>
		);
	}

	// Split movies into 4 columns
	const columns = [
		movies.filter((_, i) => i % 4 === 0),
		movies.filter((_, i) => i % 4 === 1),
		movies.filter((_, i) => i % 4 === 2),
		movies.filter((_, i) => i % 4 === 3),
	];

	return (
		<div ref={containerRef} style={{ height: "800vh" }} className="mb-40">
			{/* 8x viewport height for full scroll */}
			<div className="sticky top-0 h-screen">
				<h2 className="text-3xl md:text-5xl font-bold text-white pt-4 md:pt-8 pb-8 md:pb-16 text-center">
					Top Movies
				</h2>

				{/* Scroll container */}
				<div ref={scrollContainerRef} className="h-full">
					{/* Flex Layout - masonry */}
					<div
						className="flex gap-2 md:gap-6 px-2 md:px-4 max-w-7xl mx-auto pb-60"
						style={{ minHeight: "100%" }}
					>
						{columns.map((columnMovies, columnIndex) => (
							<div
								key={columnIndex}
								className={`movie-column flex-1 flex flex-col gap-2 md:gap-6 ${
									columnIndex >= 2 ? "hidden md:flex" : ""
								}`}
								style={{
									willChange: "transform",
								}}
							>
								{columnMovies.map((movie, movieIndex) => {
									const globalIndex =
										columnIndex + movieIndex * 4;
									return (
										<Link
											key={movie.id}
											href={`/movies/${movie.title}`}
											className="block group"
											aria-label={`View ${movie.title} details`}
										>
											<div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/50">
												{/* Rank Badge */}
												<div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-white text-purple-600 font-bold text-sm md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-full shadow-lg">
													{globalIndex + 1}
												</div>

												{/* Movie Poster */}
												{movie.posterUrl && (
													<Image
														src={movie.posterUrl}
														alt={`${movie.title} poster`}
														width={300}
														height={450}
														className="w-full h-auto object-cover"
														style={{
															boxShadow:
																"0 0 40px rgba(255,255,255,0.2)",
														}}
													/>
												)}

												{/* Hover Overlay */}
												<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
													<p className="text-white font-bold text-sm line-clamp-2">
														{movie.title}
													</p>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
