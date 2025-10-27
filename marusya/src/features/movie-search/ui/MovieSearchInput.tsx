"use client";

import { ChangeEvent, useRef } from "react";
import { useMovieSearchWithDebounce } from "../model/hooks";
import useFocus from "@/shared/lib/hooks/useFocus";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { convertMinutes } from "@/shared/lib/utils/convertMinutes";

export const MovieSearchInput = () => {
	const { query, movies, isLoading, updateQuery } =
		useMovieSearchWithDebounce(300);
	const { ref, isFocused, onFocus, onBlur } = useFocus();
	const pathname = usePathname();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		updateQuery(e.target.value);
	};

	const showList = movies.length > 0 && query.trim() !== "" && isFocused;

	return (
		<div className="w-full relative" ref={ref}>
			<FaSearch
				size={20}
				className="absolute left-3 top-3 text-gray-400"
			/>
			<input
				onFocus={onFocus}
				onBlur={onBlur}
				type="text"
				placeholder="Search"
				value={query}
				onChange={handleChange}
				className="w-full p-2.5 pl-10 placeholder:text-gray-400 text-white rounded-md bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			{isLoading && (
				<div className="absolute right-3 top-3">
					<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<ul
				className={
					showList
						? "absolute left-0 right-0 md:w-full z-50 rounded-xl overflow-hidden mt-4 max-h-96 overflow-y-auto scrollbar-hide"
						: "hidden"
				}
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				{movies
					.sort((a, b) => b.tmdbRating - a.tmdbRating)
					.map((movie) => (
						<Link key={movie.id} href={`/movies/${movie.title}`}>
							<li
								className="text-white flex bg-secondary pl-2 pb-2 pt-2 w-full hover:bg-gray-700 transition-colors"
								style={{ height: "70px" }}
							>
								<Image
									alt={movie.title}
									className="mr-2 md:mr-3 rounded-b-sm object-cover flex-shrink-0"
									width={40}
									height={60}
									src={movie.posterUrl}
								/>
								<div className="flex flex-col flex-1 overflow-hidden justify-center min-w-0">
									<ul className="flex text-gray-400 items-center space-x-1 md:space-x-2 text-xs overflow-hidden whitespace-nowrap mb-1">
										<li>{movie.tmdbRating.toFixed(1)}</li>
										<li className="hidden sm:block">
											{movie.releaseYear}
										</li>
										<li className="overflow-hidden text-ellipsis hidden md:block">
											{movie.genres
												.slice(0, 2)
												.join(", ")}
											{movie.genres.length > 2 && "..."}
										</li>
										<li className="hidden sm:block">
											{convertMinutes(movie.runtime)}
										</li>
									</ul>
									<p
										className="text-white text-xs md:text-sm font-bold overflow-hidden"
										style={{
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											textOverflow: "ellipsis",
											lineHeight: "1.3",
										}}
									>
										{movie.title}
									</p>
								</div>
							</li>
						</Link>
					))}
			</ul>
		</div>
	);
};
