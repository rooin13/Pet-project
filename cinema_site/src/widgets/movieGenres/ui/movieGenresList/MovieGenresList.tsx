import Image from "next/image";
import Link from "next/link";

interface MovieGenresListProps {
	genres: string[];
}

const MovieGenresList = async ({ genres }: MovieGenresListProps) => {
	return (
		<div>
			<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{genres.map((genre) => (
					<li key={genre}>
						<Link
							href={`/genres/${genre}`}
							className="block h-full"
							aria-label={`Browse ${genre} movies`}
						>
							<div className="bg-violet-900 rounded-2xl h-60 overflow-hidden flex flex-col justify-end relative hover:scale-105 transition-transform duration-200">
								<div className="absolute inset-0 rounded-2xl overflow-hidden">
									<Image
										className="w-full h-full object-cover"
										alt={`${genre} genre movies`}
										src={`/images/genresImgs/${genre}.jpg`}
										width={300}
										height={240}
										style={{ objectFit: "cover" }}
									/>
								</div>
								<div className="bg-black/80 backdrop-blur-sm w-full py-4 relative z-10">
									<p className="text-xl font-bold text-center text-white">
										{genre}
									</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MovieGenresList;
