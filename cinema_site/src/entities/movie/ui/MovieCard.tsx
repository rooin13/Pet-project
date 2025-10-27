import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { IMovie } from "../model/types";

interface MovieCardProps {
	movie: IMovie;
	index: number;
	fromGenre?: string;
}

export const MovieCard: FC<MovieCardProps> = ({ movie, fromGenre }) => {
	const movieUrl = fromGenre
		? `/movies/${movie.title}?from=${fromGenre}`
		: `/movies/${movie.title}`;

	return (
		<li
			className="flex rounded-2xl relative group overflow-hidden"
			style={{ aspectRatio: "2/3" }}
		>
			{movie.posterUrl && (
				<Link
					className="w-full h-full overflow-hidden rounded-2xl block"
					href={movieUrl}
					aria-label={`View details for ${movie.title}`}
					style={{
						boxShadow: "0px 0px 60px 0 rgba(255,255,255,0.33)",
					}}
				>
					<Image
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						width={300}
						height={450}
						alt={`${movie.title} poster`}
						src={movie.posterUrl}
					/>

					{/* Hover Overlay with movie title */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
						<p className="text-white font-bold text-base line-clamp-2">
							{movie.title}
						</p>
					</div>
				</Link>
			)}
		</li>
	);
};

export default MovieCard;
