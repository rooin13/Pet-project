"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard from "@/entities/movie/ui/MovieCard";
import { getMovieByGenre } from "@/shared/lib/api/genresApi/api";
import { IMovie } from "@/entities/movie/model/types";

interface Props {
	slug: string;
}

export default function MovieListWithPagination({ slug }: Props) {
	const [movies, setMovies] = useState<IMovie[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const searchParams = useSearchParams();
	const router = useRouter();

	const page = parseInt(searchParams.get("page") || "1");

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);
			try {
				const res = await getMovieByGenre(slug, page);
				setMovies(res);
			} catch (e) {
				console.error("Ошибка загрузки фильмов", e);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, [slug, page]);

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		router.push(`?${params.toString()}`);
	};

	return (
		<>
			<ul className="flex gap-11 flex-wrap justify-center mb-10">
				{movies.map((movie, index) => (
					<MovieCard movie={movie} index={index} />
				))}
			</ul>

			{/* Пагинация */}
			<div className=" gap-2 mt-6  justify-around">
				<button
					onClick={() => handlePageChange(Math.max(page - 1, 1))}
					className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 text-white"
				>
					← Назад
				</button>
				<button
					onClick={() => handlePageChange(Math.min(page + 1))}
					className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 text-white"
				>
					Вперёд →
				</button>
			</div>
		</>
	);
}
