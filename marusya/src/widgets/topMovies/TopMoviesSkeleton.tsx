export const TopMoviesSkeleton = () => {
	return (
		<div className="mb-30 animate-pulse">
			{/* title skeleton */}
			<div className="h-10 w-64 bg-gray-700 rounded mb-10" />

			{/* movies grid skeleton */}
			<ul className="flex pt-10 lg:pl-0 pl-5 lg:gap-15 gap-5 space-y-2 w-full lg:justify-center align-middle overflow-x-auto lg:flex-wrap lg:overflow-x-visible">
				{Array.from({ length: 10 }).map((_, index) => (
					<li
						key={index}
						className="flex rounded-2xl h-99 relative flex-shrink-0"
					>
						{/* rank badge */}
						<div className="absolute right-55 bottom-93 w-12 h-12 bg-gray-600 rounded-3xl" />

						{/* poster */}
						<div className="w-64 h-full bg-gray-700 rounded-2xl" />
					</li>
				))}
			</ul>
		</div>
	);
};
