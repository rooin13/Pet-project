"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import { useMovieSearch } from "../model/hooks";
import useFocus from "@/shared/lib/hooks/useFocus";

import { getMovieByTitle } from "@/shared/lib/api/movies-api/api";

import { convertMinutes } from "@/shared/lib/utils/convertMinutes";

import { IMovie } from "@/entities/movie/model/types";

import { FaSearch } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";

export const MovieSearchInput = () => {
	const { updateQuery, query } = useMovieSearch();
	const [filteredMovies, setfilteredMovies] = useState<IMovie[]>([]);
	const { ref, isFocused, onFocus, onBlur } = useFocus();
	const pathname = usePathname();

	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		updateQuery(value);
		if (value.trim() === "") {
			setfilteredMovies([]);
			return;
		}
		try {
			const movies = await getMovieByTitle(value);
			setfilteredMovies(
				movies ? (Array.isArray(movies) ? movies : [movies]) : []
			);
		} catch (error) {
			setfilteredMovies([]);
		}
	};

	let showList =
		filteredMovies && filteredMovies.length > 0 && query != "" && isFocused;

	const listRef = useRef<HTMLUListElement>(null);

	return (
		<div className="max-w-200 relative" ref={ref}>
			<FaSearch size={20} className="absolute left-3 top-3" />
			<input
				onFocus={onFocus}
				onBlur={onBlur}
				type="text"
				placeholder="Search "
				onChange={handleChange}
				className="w-full p-2.5 pl-10 placeholder:text-shadow-white text-white rounded-md bg-secondary  focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<ul
				ref={listRef}
				className={
					showList
						? "absolute w-full z-10 rounded-xl overflow-hidden mt-4"
						: "hidden z-0"
				}
			>
				{showList
					? filteredMovies
							.flat()
							.sort((a, b) => b.tmdbRating - a.tmdbRating)
							.map((movie) => (
								<Link
									href={
										pathname.startsWith("/movies")
											? `/movies/${movie.title}`
											: `/movies/${movie.title}`
									}
								>
									<li
										className=" text-white flex   bg-secondary pl-2 pb-2 pt-2 w-full"
										key={movie.id}
									>
										<Image
											alt="poster"
											className="mr-3 rounded-b-sm"
											width={35}
											height={35}
											src={movie.posterUrl}
										/>
										<div className="flex flex-col flex-wrap">
											<ul>
												<ul className="flex text-foreground items-center space-x-2 text-xs flex-row ">
													<li>
														{movie.tmdbRating.toFixed(
															1
														)}
													</li>
													<li>{movie.releaseYear}</li>

													<li>
														{movie.genres.join(
															", "
														)}
													</li>

													<li>
														{convertMinutes(
															movie.runtime
														)}
													</li>
												</ul>
											</ul>
											<p className=" text-white text-base font-bold">
												{movie.title}
											</p>
										</div>
									</li>
								</Link>
							))
					: ""}
			</ul>
		</div>
	);
};
