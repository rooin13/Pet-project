"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/Button/Button";
import { useFavorites } from "@/shared/lib/hooks/useFavorites";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegistrationForm";
import { convertMinutes } from "@/shared/lib/utils/convertMinutes";
import { getRatingBgColor } from "@/shared/lib/utils/getRatingBgColor";
import {
	useRandomMovie,
	useMovieFavorite,
	useMovieMedia,
	getYouTubeId,
} from "../model/hooks";
import { useCurrentUser } from "@/features/auth/model/supabase-hooks";
import { useAuthModal } from "@/features/auth-button/model/supabase-hooks";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	bounceButton,
	listVariants,
	infoItemVariants,
	imageVariants,
} from "@/shared/lib/animations/animation";

export const RandomMovie = () => {
	const { movie, isLoading, error } = useRandomMovie();
	const router = useRouter();

	const { handleFavoriteToggle, isFavorite } = useFavorites();

	const { data: userData } = useCurrentUser();
	const user = userData?.user;
	const profile = userData?.profile;

	const { isOpen, isRegister, openLoginForm, closeForm, toggleForm } =
		useAuthModal();

	const { isFav, updateFavoriteStatus } = useMovieFavorite(
		movie?.id,
		isFavorite
	);
	const {
		imageLoading,
		setImageLoading,
		showTrailer,
		setShowTrailer,
		trailerLoading,
		setTrailerLoading,
	} = useMovieMedia(movie?.id);

	if (isLoading) {
		return <div className="mb-20" style={{ minHeight: "400px" }} />;
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-100 text-white">
				<p className="text-xl">
					Failed to load movie. Please try again later.
				</p>
			</div>
		);
	}

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
		plot.length > 160 ? plot.slice(0, 160).trimEnd() + "…" : plot;

	const youtubeId = getYouTubeId(trailerUrl);

	const onToggleFavorite = async () => {
		if (!user) {
			openLoginForm();
			return;
		}
		const newStatus = await handleFavoriteToggle(id, title);
		if (newStatus !== undefined) {
			updateFavoriteStatus(newStatus);
		}
	};

	return (
		<div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-2 lg:mb-5 min-h-[280px] lg:min-h-[280px] lg:items-stretch">
			{isOpen &&
				(isRegister ? (
					<RegisterForm onSwitch={toggleForm} onClose={closeForm} />
				) : (
					<LoginForm onSwitch={toggleForm} onClose={closeForm} />
				))}

			<div className="flex-1 flex flex-col justify-between order-1">
				<div className="space-y-1 lg:space-y-2">
					<motion.ul
						className="flex items-center flex-wrap gap-2 lg:gap-4"
						variants={listVariants}
						initial="hidden"
						animate="visible"
					>
						<li
							className="text-white font-bold text-sm md:text-base px-2 md:px-3 py-1 rounded-2xl flex items-center gap-1 md:gap-2"
							style={{ backgroundColor: ratingBgColor }}
						>
							<svg
								width={14}
								height={14}
								className="md:w-4 md:h-4"
							>
								<use
									xlinkHref={`/images/icons/icons.xml#star`}
								/>
							</svg>
							<span>{tmdbRating.toFixed(1)}</span>
						</li>
						<motion.li
							variants={infoItemVariants}
							className="text-white"
						>
							{releaseYear}
						</motion.li>
						{genres.map((genre) => (
							<motion.li key={genre} variants={infoItemVariants}>
								<Link
									href={`/genres/${genre.toLowerCase()}`}
									className="text-white hover:text-purple-400 transition-colors duration-200 hover:underline"
								>
									{genre}
								</Link>
							</motion.li>
						))}
						<motion.li
							variants={infoItemVariants}
							className="text-white"
						>
							{convertMinutes(runtime)}
						</motion.li>
					</motion.ul>

					<Link
						href={`/movies/${encodeURIComponent(title)}`}
						className="block"
					>
						<motion.h2
							className="w-full max-w-xl text-2xl sm:text-3xl lg:text-5xl font-bold text-left text-white cursor-pointer hover:text-purple-400 transition-colors duration-200"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.8,
								delay: 0.4,
								ease: "easeOut",
							}}
							style={{
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								textOverflow: "ellipsis",
								lineHeight: "1.2",
								paddingBottom: "0.5rem",
							}}
						>
							{title}
						</motion.h2>
					</Link>

					<Link
						href={`/movies/${encodeURIComponent(title)}`}
						className="hidden sm:block"
					>
						<motion.p
							className="w-full max-w-xl text-sm sm:text-base lg:text-xl text-left text-white/70 leading-relaxed overflow-hidden cursor-pointer hover:text-white/90 transition-colors duration-200"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.8,
								delay: 0.6,
								ease: "easeOut",
							}}
							style={{ maxHeight: "100px" }}
						>
							{zipedPlot}
						</motion.p>
					</Link>
				</div>

				<motion.div
					className="hidden lg:flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-4"
					variants={bounceButton}
					initial="hidden"
					animate="visible"
				>
					<Link
						href={trailerUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex-1 sm:flex-none"
					>
						<Button
							variant="secondary"
							className="w-full sm:w-auto"
						>
							Trailer
						</Button>
					</Link>

					<Button
						variant="primary"
						onClick={() => {
							if (!user) {
								openLoginForm();
							} else if (profile?.has_subscription) {
								router.push(
									`/watch/${encodeURIComponent(title)}`
								);
							} else {
								router.push("/subscription");
							}
						}}
						className="flex-1 sm:flex-none w-full sm:w-auto"
					>
						Watch
					</Button>

					<button
						onClick={onToggleFavorite}
						aria-label={
							isFav ? "Remove from favorites" : "Add to favorites"
						}
						className={`flex justify-center items-center gap-3 rounded-[28px] cursor-pointer transition-colors duration-300 text-white font-light px-6 py-2 text-base ${
							isFav
								? "bg-blue-500 hover:bg-blue-600"
								: "bg-secondary hover:bg-gray-700"
						}`}
					>
						<svg
							width={18}
							height={18}
							fill={isFav ? "#ff0000" : "gray"}
							aria-hidden="true"
						>
							<use xlinkHref={`/images/icons/icons.xml#like`} />
						</svg>
					</button>
				</motion.div>
			</div>

			<motion.div
				className="flex-1 relative overflow-hidden rounded-xl order-2"
				variants={imageVariants}
				initial="hidden"
				animate="visible"
				onMouseEnter={() => youtubeId && setShowTrailer(true)}
				onMouseLeave={() => setShowTrailer(false)}
			>
				{backdropUrl ? (
					<>
						{imageLoading && !showTrailer && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl z-10">
								<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						)}

						<Link
							href={`/movies/${encodeURIComponent(title)}`}
							className="block h-full"
						>
							<Image
								onLoad={() => setImageLoading(false)}
								src={backdropUrl}
								alt={title}
								width={800}
								height={450}
								priority
								quality={85}
								sizes="(max-width: 768px) 100vw, 50vw"
								className="w-full h-full object-cover rounded-xl"
							/>
						</Link>

						{showTrailer && youtubeId && (
							<div className="absolute inset-0 z-20 rounded-xl overflow-hidden">
								<iframe
									src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${youtubeId}&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0`}
									className="w-[102%] h-[102%] border-0 -m-[1%]"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									title={`${title} trailer preview`}
								/>
							</div>
						)}
					</>
				) : (
					<div className="w-full h-full min-h-[184px] lg:min-h-[232px] bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl">
						No poster
					</div>
				)}
			</motion.div>

			<motion.div
				className="flex lg:hidden flex-wrap gap-2 order-3"
				variants={bounceButton}
				initial="hidden"
				animate="visible"
			>
				<Link
					href={trailerUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1"
				>
					<Button variant="secondary" className="w-full">
						Trailer
					</Button>
				</Link>

				<Button
					variant="primary"
					onClick={() => {
						if (!user) {
							openLoginForm();
						} else if (profile?.has_subscription) {
							router.push(`/watch/${encodeURIComponent(title)}`);
						} else {
							router.push("/subscription");
						}
					}}
					className="flex-1"
				>
					Watch
				</Button>

				<button
					onClick={onToggleFavorite}
					aria-label={
						isFav ? "Remove from favorites" : "Add to favorites"
					}
					className={`flex justify-center items-center gap-3 rounded-[28px] cursor-pointer transition-colors duration-300 text-white font-light px-6 py-2 text-base ${
						isFav
							? "bg-blue-500 hover:bg-blue-600"
							: "bg-secondary hover:bg-gray-700"
					}`}
				>
					<svg
						width={18}
						height={18}
						fill={isFav ? "#ff0000" : "gray"}
						aria-hidden="true"
					>
						<use xlinkHref={`/images/icons/icons.xml#like`} />
					</svg>
				</button>
			</motion.div>
		</div>
	);
};
