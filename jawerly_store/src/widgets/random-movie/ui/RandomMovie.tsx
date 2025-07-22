"use client";

import { useEffect, useState } from "react";
import { getRandomMovie } from "@/shared/lib/api/movies-api/api";
import { IMovie } from "@/entities/movie/model/types";
import Image from "next/image";
import { Btn } from "@/shared/ui/button/Btn";
import Link from "next/link";
import { convertMinutes } from "@/shared/lib/utils/convertMinutes";
import { getRatingBgColor } from "@/shared/lib/utils/getRatingBgColor";
import { useFavorites } from "@/shared/lib/hooks/useFavorites";
import { LoginForm } from "@/features/auth/ui/LoginForm";

import { motion } from "framer-motion";
import {
	typewriterContainer,
	typewriterLetter,
	bounceButton,
	listVariants,
	infoItemVariants,
} from "@/shared/lib/animations/animation";

export const RandomMovie = () => {
	const [movie, setMovie] = useState<IMovie | null>(null);
	const [isFav, setIsFav] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const {
		isOpen,
		isRegister,
		closeForm,
		toggleForm,
		handleFavoriteToggle,
		isFavorite,
	} = useFavorites();

	useEffect(() => {
		if (!movie?.id) return;
		isFavorite(movie.id).then((fav) => setIsFav(fav));
	}, [movie?.id, isFavorite]);

	useEffect(() => {
		getRandomMovie().then(setMovie);
	}, []);

	if (!movie) return null;

	const {
		tmdbRating,
		genres,
		title,
		releaseYear,
		plot,
		posterUrl,
		runtime,
		backdropUrl,
		trailerUrl,
		id,
	} = movie;

	const ratingBgColor = getRatingBgColor(tmdbRating);
	const zipedPlot =
		plot.length > 200 ? plot.slice(0, 200).trimEnd() + "…" : plot;

	const titleLetters = Array.from(title);
	const plotLetters = Array.from(zipedPlot);

	return (
		<div className="flex flex-col-reverse lg:flex-row items-center justify-center pt-10 pb-20 min-h-100">
			{isOpen && <LoginForm onSwitch={toggleForm} onClose={closeForm} />}

			<div className="flex-1/2 pr-10 flex flex-col space-y-4">
				<motion.ul
					className="flex items-center space-x-4 lg:space-x-10"
					variants={listVariants}
					initial="hidden"
					animate="visible"
				>
					<li
						className="text-white font-bold text-lg px-3 py-1 rounded-2xl flex items-center gap-2"
						style={{ backgroundColor: ratingBgColor }}
					>
						<svg width={18} height={18}>
							<use xlinkHref={`/images/icons/icons.xml#star`} />
						</svg>
						<span>{tmdbRating.toFixed(1)}</span>
					</li>
					<motion.li
						variants={infoItemVariants}
						className="text-white"
					>
						{releaseYear}
					</motion.li>
					<motion.li
						variants={infoItemVariants}
						className="text-white"
					>
						{genres.join(", ")}
					</motion.li>
					<motion.li
						variants={infoItemVariants}
						className="text-white"
					>
						{convertMinutes(runtime)}
					</motion.li>
				</motion.ul>

				<motion.h2
					className="w-full max-w-xl text-2xl sm:text-3xl md:text-5xl font-bold text-left text-white mb-5 flex flex-wrap overflow-hidden"
					variants={typewriterContainer}
					initial="hidden"
					animate="visible"
					style={{ whiteSpace: "pre-wrap" }}
				>
					{titleLetters.map((char, i) => (
						<motion.span key={i} variants={typewriterLetter}>
							{char}
						</motion.span>
					))}
				</motion.h2>

				<motion.p
					className="w-full max-w-xl text-base sm:text-lg md:text-xl text-left text-white/70 flex flex-wrap overflow-hidden"
					variants={typewriterContainer}
					initial="hidden"
					animate="visible"
					style={{ whiteSpace: "pre-wrap" }}
				>
					{plotLetters.map((char, i) => (
						<motion.span key={i} variants={typewriterLetter}>
							{char}
						</motion.span>
					))}
				</motion.p>
				<motion.div
					className="flex space-x-4 mt-6"
					variants={bounceButton}
					initial="hidden"
					animate="visible"
				>
					<Link
						href={trailerUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="basis-full lg:basis-auto"
					>
						<Btn style="primary" onclick={() => console.log()}>
							Trailer
						</Btn>
					</Link>
					<Link href={`/movies/${encodeURIComponent(title)}`}>
						<Btn style="secondary" onclick={() => {}}>
							About
						</Btn>
					</Link>

					<Btn
						style="secondary"
						onclick={() => handleFavoriteToggle(id)}
					>
						<svg
							width={18}
							height={18}
							fill={isFav ? "#67A5EB" : "gray"}
						>
							<use xlinkHref={`/images/icons/icons.xml#like`} />
						</svg>
					</Btn>
				</motion.div>
			</div>

			<div className="flex-1/2 mb-5 lg:mb-0 lg:min-h-110 min-h-60 relative">
				{backdropUrl && (
					<>
						{isLoading && (
							<div className="absolute  inset-0 flex items-center justify-center bg-black/20">
								<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						)}

						<Link href={`/movies/${encodeURIComponent(title)}`}>
							<Image
								onLoadingComplete={() => setIsLoading(false)}
								src={backdropUrl}
								alt={title}
								width={1080}
								height={1920}
								className="w-full rounded-xl lg:h-110 h-60"
							/>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};
