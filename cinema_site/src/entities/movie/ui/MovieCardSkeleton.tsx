export const MovieCardSkeleton = () => {
	return (
		<div className="flex rounded-2xl h-99 relative flex-shrink-0 animate-pulse">
			{/* poster skeleton */}
			<div className="w-64 h-full bg-gray-700 rounded-2xl" />
		</div>
	);
};

