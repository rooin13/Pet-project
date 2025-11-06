export function TrackCardSkeleton() {
	return (
		<div className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
			{/* cover skeleton */}
			<div className="w-full aspect-square bg-gray-700 rounded mb-3" />

			{/* title skeleton */}
			<div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />

			{/* artist skeleton */}
			<div className="h-3 bg-gray-700 rounded w-1/2" />
		</div>
	);
}
