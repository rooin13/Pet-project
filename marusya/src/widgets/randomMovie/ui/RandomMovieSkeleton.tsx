export const RandomMovieSkeleton = () => {
	return (
		<div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-4 lg:mb-20 animate-pulse min-h-[350px] lg:h-[350px]">
			<div className="flex-1 flex flex-col justify-between overflow-hidden order-1">
				<div className="space-y-2 lg:space-y-4">
					<div className="flex items-center gap-2 lg:gap-4 flex-wrap">
						<div className="h-7 md:h-8 w-16 md:w-20 bg-gray-700 rounded-2xl" />
						<div className="h-5 md:h-6 w-12 md:w-16 bg-gray-700 rounded" />
						<div className="h-5 md:h-6 w-24 md:w-32 bg-gray-700 rounded hidden sm:block" />
						<div className="h-5 md:h-6 w-16 md:w-20 bg-gray-700 rounded hidden sm:block" />
					</div>

					<div className="space-y-2">
						<div className="h-10 sm:h-12 lg:h-14 w-3/4 bg-gray-700 rounded" />
					</div>

					<div className="space-y-2 hidden sm:block">
						<div className="h-4 sm:h-5 w-full bg-gray-700 rounded" />
						<div className="h-4 sm:h-5 w-full bg-gray-700 rounded" />
						<div className="h-4 sm:h-5 w-full bg-gray-700 rounded" />
					</div>
				</div>

				<div className="hidden lg:flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-4">
					<div className="h-12 flex-1 sm:flex-none sm:w-32 bg-gray-700 rounded-full" />
					<div className="h-12 flex-1 sm:flex-none sm:w-32 bg-gray-700 rounded-full" />
					<div className="h-12 w-12 bg-gray-700 rounded-full" />
				</div>
			</div>

			<div className="flex-1 relative h-full min-h-[200px] order-2">
				<div className="w-full h-full bg-gray-700 rounded-xl" />
			</div>

			<div className="flex lg:hidden flex-wrap gap-2 order-3">
				<div className="h-12 flex-1 bg-gray-700 rounded-full" />
				<div className="h-12 flex-1 bg-gray-700 rounded-full" />
				<div className="h-12 w-12 bg-gray-700 rounded-full" />
			</div>
		</div>
	);
};
