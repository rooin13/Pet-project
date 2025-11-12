export function TrackRowSkeleton() {
	return (
		<div className="group flex items-center gap-3 rounded border border-white/10 bg-white/5 p-2 backdrop-blur-sm animate-pulse">
			<div className="hidden sm:block w-6 h-3 rounded bg-gray-700/80" />
			<div className="w-10 h-10 rounded bg-gray-800" />
			<div className="flex-1 min-w-0 space-y-2">
				<div className="h-4 rounded bg-gray-700/80 w-3/4" />
				<div className="h-3 rounded bg-gray-700/60 w-1/2" />
			</div>
			<div className="ml-auto flex items-center gap-2">
				<div className="h-3 w-10 rounded bg-gray-700/70" />
				<div className="w-8 h-8 rounded-full bg-gray-800/80" />
				<div className="w-8 h-8 rounded-full bg-gray-800/80" />
			</div>
		</div>
	);
}
