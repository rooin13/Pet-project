"use client";
import { IMovie } from "@/entities/movie/model/types";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegistrationForm";
import { useFavorites } from "@/shared/lib/hooks/useFavorites";
import { convertMinutes } from "@/shared/lib/utils/convertMinutes";
import { getRatingBgColor } from "@/shared/lib/utils/getRatingBgColor";
import { Button } from "@/shared/ui/Button/Button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
	bounceButton,
	listVariants,
	infoItemVariants,
	imageVariants,
} from "@/shared/lib/animations/animation";
import {
	useUser,
	useAuthModal,
} from "@/features/auth-button/model/supabase-hooks";
import {
	useMovieFavorite,
	useMovieMedia,
	getYouTubeId,
} from "@/widgets/randomMovie/model/hooks";

export const MovieDetails = (movie: IMovie) => {
	const searchParams = useSearchParams();
	const fromGenre = searchParams.get("from");
	const router = useRouter();
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
		director,
		budget,
		revenue,
		language,
		production,
		awardsSummary,
		id,
	} = movie;

	const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
	const ratingBgColor = getRatingBgColor(tmdbRating);

	const { data: userData } = useUser();
	const { isOpen, isRegister, openLoginForm, closeForm, toggleForm } =
		useAuthModal();
	const user = userData?.user;
	const profile = userData?.profile;

	const { handleFavoriteToggle, isFavorite } = useFavorites();

	const { isFav, updateFavoriteStatus } = useMovieFavorite(id, isFavorite);
	const { imageLoading, setImageLoading, showTrailer, setShowTrailer } =
		useMovieMedia(id);

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

	const InfoRow = (label: string, value: string | number) => (
		<div className=" lg:flex-row flex flex-col items-start   text-lg  py-2">
			<span className="whitespace-nowrap lg:text-white lg:text-lg text-sm">
				{label}
			</span>
			<div className="flex-grow border-b pt-3 border-dashed border-gray-400 mx-4 lg:flex hidden" />
			<span className="lg:text-white text-white">{value}</span>
		</div>
	);

	return (
		<div>
			{isOpen &&
				(isRegister ? (
					<RegisterForm onSwitch={toggleForm} onClose={closeForm} />
				) : (
					<LoginForm onSwitch={toggleForm} onClose={closeForm} />
				))}

			{fromGenre && (
				<Link
					className="group inline-flex mb-6 items-center"
					href={`/genres/${fromGenre.toLowerCase()}`}
				>
					<svg
						width={44}
						height={44}
						className="transition-transform duration-300 group-hover:-translate-x-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#backarrow`} />
					</svg>
					<span className="pl-1 text-white text-lg font-semibold capitalize">
						Back to {fromGenre}
					</span>
				</Link>
			)}

			{/* hero section */}
			<div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-8 lg:mb-16 min-h-[280px] lg:min-h-[280px] lg:items-stretch">
				<div className="flex-1 flex flex-col justify-between overflow-hidden order-2 lg:order-1">
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
								<motion.li
									key={genre}
									variants={infoItemVariants}
								>
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

						<motion.h2
							className="w-full max-w-xl text-2xl sm:text-3xl lg:text-5xl font-bold text-left text-white"
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
								variant="primary"
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
							className="w-full sm:w-auto"
						>
							Watch
						</Button>

						<button
							onClick={onToggleFavorite}
							aria-label={
								isFav
									? "Remove from favorites"
									: "Add to favorites"
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
							>
								<use
									xlinkHref={`/images/icons/icons.xml#like`}
								/>
							</svg>
						</button>
					</motion.div>
				</div>

				<motion.div
					className="flex-1 relative overflow-hidden rounded-xl order-1 lg:order-2"
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
								href={trailerUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="h-full block"
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
						<Button variant="primary" className="w-full">
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
						>
							<use xlinkHref={`/images/icons/icons.xml#like`} />
						</svg>
					</button>
				</motion.div>
			</div>

			{/* description */}
			<div className="mb-6">
				<h3 className="text-3xl md:text-4xl font-bold text-left text-white mb-6">
					Description
				</h3>
				<p className="text-lg md:text-xl text-left text-white/80 leading-relaxed">
					{plot}
				</p>
			</div>

			{/* trailer */}
			{youtubeId && (
				<div className="mb-16">
					<div
						className="w-full rounded-2xl overflow-hidden shadow-2xl"
						style={{ aspectRatio: "16/9" }}
					>
						<iframe
							src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
							className="w-full h-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							title={`${title} trailer`}
						/>
					</div>
				</div>
			)}

			{/* about */}
			<h3 className="self-stretch mb-10 flex-grow-0 flex-shrink-0 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white">
				About the movie
			</h3>
			<div className="flex flex-col max-w-200">
				{language &&
					InfoRow(
						"Language",
						languageNames.of(language) ?? "Unknown"
					)}
				{director && InfoRow("Director", director)}
				{budget !== undefined &&
					budget !== null &&
					InfoRow(
						"Budget",
						`${new Intl.NumberFormat("fr-FR").format(
							Number(budget)
						)} $`
					)}
				{revenue !== undefined &&
					revenue !== null &&
					InfoRow(
						"Revenue",
						`${new Intl.NumberFormat("fr-FR").format(
							Number(revenue)
						)} $`
					)}
				{production && InfoRow("Production", production)}
				{awardsSummary && InfoRow("Awards", awardsSummary)}
			</div>
		</div>
	);
};
