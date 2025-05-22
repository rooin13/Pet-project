"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useMovieSearch } from "../model/hooks";
import { getMovieByTitle } from "@/shared/lib/api/moviesApi/api";
import { IMovie } from "@/entities/movie/model/types";
import useFocus from "@/shared/lib/hooks/onFocus";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MovieSearchInput = () => {
	const { updateQuery, query } = useMovieSearch();
	const [filteredMovies, setfilteredMovies] = useState<IMovie[]>([]);
	const { ref, isFocused, onFocus, onBlur } = useFocus();
	const pathname = usePathname();

	const update = useCallback(
		(value: string) => {
			updateQuery(value);
			console.log(filteredMovies);
		},
		[updateQuery]
	);

	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const movie = await getMovieByTitle(query);

		setfilteredMovies(movie ? [movie] : []);
		update(e.target.value);
	};

	let showList =
		filteredMovies && filteredMovies.length > 0 && query != "" && isFocused;

	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	return (
		<div className="max-w-200 relative">
			<input
				ref={ref}
				onFocus={onFocus}
				onBlur={onBlur}
				type="text"
				placeholder="Search "
				onChange={handleChange}
				className="w-full p-2.5 placeholder:text-gray-500 text-white rounded-md bg-secondary  focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<ul
				ref={listRef}
				className={showList ? "absolute w-full z-10" : "hidden z-0"}
			>
				{showList
					? filteredMovies.flat().map((movie) => (
							<Link
								href={
									pathname.startsWith("/movies")
										? `/movies/${movie.title}`
										: `/movies/${movie.title}`
								}
							>
								<li
									className="bg-white pt-1 pb-1  border-blue-500 border-1 w-full"
									key={movie.id}
								>
									{movie.title}
								</li>
							</Link>
					  ))
					: ""}
			</ul>
		</div>
	);
};
