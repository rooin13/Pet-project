export function ArtistCardSkeleton() {
	return (
		<div className="group relative bg-gray-800/50 border border-white/10 p-4 rounded-lg animate-pulse">
			<div className="relative w-full aspect-square mb-3 rounded-full overflow-hidden bg-gray-700/80" />

			<div className="h-4 bg-gray-700/80 rounded w-3/4 mx-auto mb-2" />
			<div className="h-3 bg-gray-700/70 rounded w-1/2 mx-auto" />
		</div>
	);
}
