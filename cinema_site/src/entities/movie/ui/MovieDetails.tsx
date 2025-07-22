"use client";
import { IMovie } from "@/entities/movie/model/types";
import { getUserProfileThunk, selectUser } from "@/entities/user/model/slice";
import { getUserThunk } from "@/features/auth/model/slice";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import {
	deleteFavorites,
	postFavorites,
} from "@/shared/lib/api/favoritesApi/api";
import { useFavorites } from "@/shared/lib/hooks/useFavorites";
import { convertMinutes } from "@/shared/lib/utils/convertMinutes";
import { getRatingBgColor } from "@/shared/lib/utils/getRatingBgColor";
import { Btn } from "@/shared/ui/Button/Btn";
import { useAppDispatch, useAppSelector } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const MovieDetails = (movie: IMovie) => {
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
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const [isFav, setIsFav] = useState(false);

	const {
		isOpen,
		isRegister,
		closeForm,
		toggleForm,
		handleFavoriteToggle,
		isFavorite,
	} = useFavorites();

	useEffect(() => {
		const checkFavorite = async () => {
			const fav = await isFavorite(id);
			setIsFav(fav);
		};
		checkFavorite();
	}, [id, isFavorite]);

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
			{isOpen && <LoginForm onSwitch={toggleForm} onClose={closeForm} />}
			<div className=" flex-col-reverse lg:flex-row flex items-center justify-center pt-10 pb-20  min-h-100">
				<div className="flex-col space-y-4 flex-1/2  pr-10  ">
					<div>
						<ul className="flex items-center space-x-4 lg:space-x-10 flex-row ">
							<li
								className="text-white font-bold text-lg pl-3 pr-3 rounded-2xl flex items-center justify-center gap-2"
								style={{ backgroundColor: ratingBgColor }}
							>
								<svg width={18} height={18}>
									<use
										xlinkHref={`/images/icons/icons.xml#star`}
									/>
								</svg>
								<p className="pt-0.3">
									{tmdbRating.toFixed(1)}
								</p>
							</li>
							<li>{releaseYear}</li>

							<li>{genres.join(", ")}</li>

							<li>{convertMinutes(runtime)}</li>
						</ul>
					</div>
					<div className="mt-4 flex-wrap mb-15">
						<h2 className="w-full max-w-xl text-2xl sm:text-3xl md:text-5xl font-bold text-left text-white mb-5">
							{title}
						</h2>

						<p className="w-full max-w-xl text-base sm:text-lg md:text-xl text-left text-white/70">
							{plot}
						</p>
					</div>
					<div className="flex-col lg:flex-row flex mb-3 space-x-4">
						<div className="mb-4 lg:mb-0 flex">
							<Link
								className="flex basis-full  lg:basis-0"
								target="_blank"
								rel="noopener noreferrer"
								href={trailerUrl}
							>
								<Btn
									style="primary"
									className="basis-full"
									onclick={() => console.log()}
								>
									Trailer
								</Btn>
							</Link>
						</div>
						<div className="flex space-x-4">
							<Btn
								style=""
								onclick={() => handleFavoriteToggle(id)}
							>
								<svg
									width={18}
									height={18}
									fill={isFav ? "#67A5EB" : "gray"}
								>
									<use
										xlinkHref={`/images/icons/icons.xml#like`}
									/>
								</svg>
							</Btn>
						</div>
					</div>
				</div>
				<div className="flex-1/2 h-full lg:mb-0 mb-5">
					{backdropUrl && (
						<Image
							src={backdropUrl}
							alt={title}
							width={1080}
							height={1920}
							className="w-full rounded-xl lg:h-100 h-60"
						></Image>
					)}
				</div>
			</div>
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
