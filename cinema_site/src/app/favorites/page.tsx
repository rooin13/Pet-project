"use client";

import { useCurrentUser } from "@/features/auth/model/supabase-hooks";
import { useFavoritesList } from "@/shared/lib/hooks/useSupabaseFavorites";
import { getMovieByTitle } from "@/shared/lib/api/moviesApi";
import { useEffect, useState } from "react";
import { IMovie } from "@/entities/movie/model/types";
import Link from "next/link";
import Image from "next/image";
import { convertMinutes } from "@/shared/lib/utils/convertMinutes";
import { FaSearch } from "react-icons/fa";

export default function FavoritesPage() {
	const { data: userData, isLoading: userLoading } = useCurrentUser();
	const { data: favorites, isLoading: favoritesLoading } = useFavoritesList();
	const [movies, setMovies] = useState<IMovie[]>([]);
	const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);

	const user = userData?.user;

	// Fetch full movie data for favorites
	useEffect(() => {
		const fetchMovies = async () => {
			if (!favorites || favorites.length === 0) {
				setLoading(false);
				return;
			}

			setLoading(true);
			const moviePromises = favorites.map(async (fav) => {
				try {
					const results = await getMovieByTitle(fav.movie_title);
					return results[0] || null;
				} catch (error) {
					console.error(`Failed to fetch ${fav.movie_title}:`, error);
					return null;
				}
			});

			const fetchedMovies = await Promise.all(moviePromises);
			setMovies(fetchedMovies.filter((m): m is IMovie => m !== null));
			setLoading(false);
		};

		fetchMovies();
	}, [favorites]);

	// Filter movies based on search query
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredMovies(movies);
		} else {
			const filtered = movies.filter((movie) =>
				movie.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredMovies(filtered);
		}
	}, [searchQuery, movies]);

	if (userLoading) {
		return (
			<div className="page-wrapper pb-20 min-h-screen">
				<h3 className="self-stretch mb-10 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white uppercase">
					Favorites
				</h3>
				<p className="text-white text-center">Loading...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="page-wrapper pb-20 min-h-screen text-center">
				<h3 className="self-stretch mb-10 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white uppercase">
					Favorites
				</h3>
				<p className="text-white text-xl mb-6">
					Please log in to view your favorite movies
				</p>
				<Link
					href="/"
					className="text-purple-400 hover:underline text-lg"
				>
					Go to Home
				</Link>
			</div>
		);
	}

	return (
		<div className="page-wrapper pb-20 min-h-screen">
			<h3 className="self-stretch mb-10 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white uppercase">
				Favorites
			</h3>

			{loading || favoritesLoading ? (
				<p className="text-white text-center">Loading favorites...</p>
			) : movies.length === 0 ? (
				<div className="text-center text-white">
					<p className="text-xl mb-4">No favorite movies yet</p>
					<Link href="/" className="text-purple-400 hover:underline">
						Discover movies
					</Link>
				</div>
			) : (
				<div className="max-w-5xl mx-auto">
					{/* Search Bar */}
					<div className="relative mb-8">
						<FaSearch
							size={20}
							className="absolute left-3 top-3 text-gray-400"
						/>
						<input
							type="text"
							placeholder="Search favorites..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full p-2.5 pl-10 placeholder:text-gray-400 text-white rounded-md bg-secondary focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>
					</div>

					{/* Movies List */}
					{filteredMovies.length === 0 ? (
						<p className="text-white text-center">
							No movies found matching "{searchQuery}"
						</p>
					) : (
						<div className="space-y-4">
							{filteredMovies.map((movie) => (
								<Link
									key={movie.id}
									href={`/movies/${movie.title}`}
									className="block"
								>
									<div className="flex bg-secondary rounded-xl p-4 hover:bg-gray-700 transition-colors group">
										{/* Poster */}
										<div className="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden mr-6">
											<Image
												src={movie.posterUrl}
												alt={movie.title}
												width={128}
												height={192}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>

										{/* Info */}
										<div className="flex-1 flex flex-col justify-between">
											<div>
												{/* Title */}
												<h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
													{movie.title}
												</h3>

												{/* Meta */}
												<div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
													<span className="flex items-center gap-1">
														<svg
															width={16}
															height={16}
															className="fill-yellow-400"
														>
															<use xlinkHref="/images/icons/icons.xml#star" />
														</svg>
														{movie.tmdbRating.toFixed(
															1
														)}
													</span>
													<span>
														{movie.releaseYear}
													</span>
													<span>
														{movie.genres
															.slice(0, 3)
															.join(", ")}
													</span>
													<span>
														{convertMinutes(
															movie.runtime
														)}
													</span>
												</div>

												{/* Plot */}
												<p className="text-white/70 text-base leading-relaxed line-clamp-3">
													{movie.plot}
												</p>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
