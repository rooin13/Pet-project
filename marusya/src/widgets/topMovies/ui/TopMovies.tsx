"use client";

import Image from "next/image";
import Link from "next/link";
import { useTopMovies } from "../model/hooks";
import { useParallaxScroll } from "../lib/useParallaxScroll";
import { getParallaxOffset } from "../lib/getParallaxOffset";

export const TopMovies = () => {
	const { movies, isLoading } = useTopMovies();
	const { scrollProgress, sectionRef } = useParallaxScroll();

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

	const columns = [
		movies.filter((_, i) => i % 4 === 0),
		movies.filter((_, i) => i % 4 === 1),
		movies.filter((_, i) => i % 4 === 2),
		movies.filter((_, i) => i % 4 === 3),
	];

	return (
		<section ref={sectionRef} className="mb-10 overflow-hidden py-20">
			<h2 className="text-3xl md:text-5xl font-bold text-white pt-4 md:pt-8 pb-6 md:pb-10 text-center">
				Top Movies
			</h2>
			<div className="px-2 md:px-4 max-w-7xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
					{columns.map((column, colIndex) => (
						<div
							key={colIndex}
							className="flex flex-col gap-2 md:gap-6"
							style={{
								transform: `translateY(${getParallaxOffset(
									colIndex,
									scrollProgress
								)}px)`,
								willChange: "transform",
							}}
						>
							{column.map((movie, index) => {
								const originalIndex = movies.findIndex(
									(m) => m.id === movie.id
								);
								return (
									<Link
										key={movie.id}
										href={`/movies/${movie.title}`}
										className="block group"
										aria-label={`View ${movie.title} details`}
									>
										<div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/50">
											<div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-white text-purple-600 font-bold text-sm md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-full shadow-lg">
												{originalIndex + 1}
											</div>
											{movie.posterUrl && (
												<Image
													src={movie.posterUrl}
													alt={`${movie.title} poster`}
													width={300}
													height={450}
													loading="lazy"
													quality={75}
													sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
													className="w-full h-auto object-cover"
													style={{
														boxShadow:
															"0 0 40px rgba(255,255,255,0.2)",
													}}
												/>
											)}
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
		</section>
	);
};
