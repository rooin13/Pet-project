import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { IMovie } from "../model/types";

interface MovieCardProps {
	movie: IMovie;
	index: number;
}

export const MovieCard: FC<MovieCardProps> = ({ movie, index }) => {
	return (
		<div>
			<li
				style={{ boxShadow: "0px 0px 60px 0 rgba(255,255,255,0.33)" }}
				key={movie.id}
				className="flex 1/2 rounded-2xl  h-99 relative flex-shrink-0"
			>
				{movie.posterUrl && (
					<Link
						className="h-full overflow-hidden rounded-2xl"
						href={`/movies/${movie.title}`}
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
		</div>
	);
};

export default MovieCard;
