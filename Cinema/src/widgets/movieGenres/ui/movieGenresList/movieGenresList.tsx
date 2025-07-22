import { getMovieByGenre } from "@/shared/lib/api/genresApi/api";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MovieGenresListProps {
	genres: string[];
}

const MovieGenresList: React.FC<MovieGenresListProps> = async ({ genres }) => {
	return (
		<div>
			<ul className="flex  flex-wrap gap-8 space-y-3">
				{genres.map((genre, idx) => (
					<Link
						href={`genres/${genre}`}
						className="flex-1/5 shrink-0"
					>
						<li className="bg-violet-900 rounded-3xl min-w-70 h-85 overflow-hidden flex align-bottom justify-center items-end relative shrink-0">
							<div className="absolute w-full h-full">
								<Image
									className="w-full h-65"
									alt="Genre image"
									src={`/images/genresImgs/${genre}.jpg`}
									width={300}
									height={200}
								></Image>
							</div>
							<div className="bg-black w-full pt-7 pb-7">
								<p
									className="text-2xl font-bold text-center text-white"
									key={idx}
								>
									{genre}
								</p>
							</div>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};

export default MovieGenresList;
