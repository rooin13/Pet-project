export function ArtistCardSkeleton() {
	return (
		<div className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
			{/* avatar skeleton */}
			<div className="w-full aspect-square bg-gray-700 rounded-full mb-3" />

			{/* name skeleton */}
			<div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2" />

			{/* label skeleton */}
			<div className="h-3 bg-gray-700 rounded w-1/2 mx-auto" />
		</div>
	);
}
