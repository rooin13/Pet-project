import React from "react";
import { getTopMovies } from "@/shared/lib/api/movies-api/api";
import Image from "next/image";
import Link from "next/link";

export const TopMovies = async () => {
	const topMoviesData = await getTopMovies();
	return (
		<div className="mb-30">
			<h2 className="self-stretch flex-grow-0 flex-shrink-0  text-[40px] font-bold text-left text-white mb-10">
				Топ 10 фильмов
			</h2>
			<ul className="flex pt-10  lg:pl-0 pl-5 lg:gap-15 gap-5 space-y-2 w-full lg:justify-center  align-middle overflow-x-auto lg:flex-wrap  lg:overflow-x-visible">
				{topMoviesData.map((movie, index) => (
					<li
						key={movie.id}
						className="flex rounded-2xl  h-99 relative flex-shrink-0"
					>
						<div className="absolute shrink-0 right-55 bottom-93 text-xl font-bold  bg-white px-5 py-2 rounded-3xl text-[#6a5dc2]">
							{index + 1}
						</div>
						{movie.posterUrl && (
							<Link
								style={{
									boxShadow:
										"0px 0px 60px 0 rgba(255,255,255,0.33)",
								}}
								className="h-full overflow-hidden rounded-2xl "
								href={`movies/${movie.title}`}
							>
								<Image
									className="h-full"
									width={258}
									height={379}
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
