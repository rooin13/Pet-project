export function TrackRowSkeleton() {
	return (
		<div className="grid grid-cols-[40px_1fr_auto] gap-4 items-center p-2 animate-pulse">
			{/* index skeleton */}
			<div className="h-4 bg-gray-700 rounded w-6" />

			{/* track info skeleton */}
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 bg-gray-700 rounded shrink-0" />
				<div className="flex-1 space-y-2">
					<div className="h-4 bg-gray-700 rounded w-3/4" />
					<div className="h-3 bg-gray-700 rounded w-1/2" />
				</div>
			</div>

			{/* duration skeleton */}
			<div className="h-4 bg-gray-700 rounded w-12" />
		</div>
	);
}
