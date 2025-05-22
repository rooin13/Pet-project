import React from "react";
import { getTopMovies } from "@/shared/lib/api/moviesApi/api";
import Image from "next/image";
import Link from "next/link";

export const TopMovies = async () => {
	const topMoviesData = await getTopMovies();
	return (
		<div>
			<h2 className="self-stretch flex-grow-0 flex-shrink-0 w-[1280px] text-[40px] font-bold text-left text-white mb-10">
				Топ 10 фильмов
			</h2>
			<ul className="flex flex-wrap gap-15  space-y-2 w-full justify-center align-middle ">
				{topMoviesData.map((movie) => (
					<li
						key={movie.id}
						className="flex 1/5 rounded-2xl overflow-hidden"
					>
						{movie.posterUrl && (
							<Link href={`movies/${movie.title}`}>
								<Image
									width={258}
									height={336}
									alt={movie.title}
									src={movie.posterUrl}
								/>
							</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
