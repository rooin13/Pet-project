import { IMovie } from "@/entities/movie/model/types";

export const MovieDetails = (movie: IMovie) => {
	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold">{movie.title}</h1>
			<p className="text-gray-600">{movie.plot}</p>
			<img
				src={movie.posterUrl}
				alt={movie.title}
				className="rounded-xl w-full max-w-md "
			/>
		</div>
	);
};
