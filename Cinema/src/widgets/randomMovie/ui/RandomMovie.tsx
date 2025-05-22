"use client";
import { useEffect, useState } from "react";
import { getRandomMovie } from "@/shared/lib/api/moviesApi/api";
import { IMovie } from "@/entities/movie/model/types";
import Image from "next/image";
import { Btn } from "@/shared/ui/Button/Btn";
import Link from "next/link";

export const RandomMovie = () => {
	const [movie, setMovie] = useState<IMovie | null>(null);

	useEffect(() => {
		getRandomMovie().then(setMovie);
	}, []);

	if (!movie) {
		return <div>Loading...</div>;
	}

	const {
		tmdbRating,
		genres,
		title,
		releaseYear,
		plot,
		posterUrl,
		runtime,
		backdropUrl,
		trailerUrl,
	} = movie;

	return (
		<div className="flex  items-center justify-center pt-10 pb-20">
			<div className="flex-col space-y-4 flex-1/2  pr-10">
				<div>
					<ul className="flex items-center space-x-10 flex-row ">
						<li>{tmdbRating}</li>
						<li>{releaseYear}</li>

						<li>{genres.join(", ")}</li>

						<li>{runtime}</li>
					</ul>
				</div>
				<div className="mt-4 flex-wrap mb-15">
					<h2 className="w-full max-w-xl text-2xl sm:text-3xl md:text-4xl font-bold text-left text-white mb-5">
						{title}
					</h2>

					<p className="w-full max-w-xl text-base sm:text-lg md:text-xl text-left text-white/70">
						{plot}
					</p>
				</div>
				<div className="flex space-x-4 ">
					<Link
						target="_blank"
						rel="noopener noreferrer"
						href={trailerUrl}
					>
						{Btn("Trailer", "primary", () => console.log())}
					</Link>

					{Btn("About", "secondary", () =>
						console.log("Button clicked")
					)}
				</div>
			</div>
			<div className="flex-1/2 h-full">
				{backdropUrl && (
					<Link href={`movies/${movie.title}`}>
						<Image
							src={backdropUrl}
							alt={title}
							width={1080}
							height={1920}
							className="w-full rounded-xl h-100"
						></Image>
					</Link>
				)}
			</div>
		</div>
	);
};
