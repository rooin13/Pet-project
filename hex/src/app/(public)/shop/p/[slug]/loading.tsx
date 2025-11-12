export default function Loading() {
	return (
		<div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12 py-6 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 animate-pulse">
			<div className="lg:col-span-12">
				<div className="flex items-center space-x-2">
					<div className="h-4 w-16 bg-gray-200 rounded"></div>
					<div className="h-4 w-4 bg-gray-200 rounded"></div>
					<div className="h-4 w-20 bg-gray-200 rounded"></div>
					<div className="h-4 w-4 bg-gray-200 rounded"></div>
					<div className="h-4 w-32 bg-gray-200 rounded"></div>
				</div>
			</div>

			<div className="lg:col-span-7 flex flex-col gap-5 lg:gap-8">
				<div className="h-12 w-3/4 bg-gray-200 rounded"></div>

				<div className="grid grid-cols-2 gap-5">
					<div className="bg-white rounded-2xl p-2 shadow-md">
						<div className="rounded-xl w-full h-full aspect-square bg-gray-200"></div>
					</div>
					<div className="bg-white rounded-2xl p-2 shadow-sm">
						<div className="rounded-xl w-full h-full aspect-square bg-gray-200"></div>
					</div>
					<div className="bg-white rounded-2xl p-2 shadow-sm">
						<div className="rounded-xl w-full h-full aspect-square bg-gray-200"></div>
					</div>
					<div className="bg-white rounded-2xl p-2 shadow-sm">
						<div className="rounded-xl w-full h-full aspect-square bg-gray-200"></div>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-6 shadow-md">
					<div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
					<div className="space-y-3">
						<div className="h-4 w-full bg-gray-200 rounded"></div>
						<div className="h-4 w-5/6 bg-gray-200 rounded"></div>
						<div className="h-4 w-4/6 bg-gray-200 rounded"></div>
						<div className="h-4 w-3/4 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>

			<div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-8 sm:gap-10">
				<div className="bg-white p-6 sm:p-7 lg:p-9 rounded-2xl space-y-6 sm:space-y-8 shadow-lg">
					<div className="flex items-baseline justify-between">
						<div className="h-8 w-24 bg-gray-200 rounded"></div>
						<div className="h-5 w-16 bg-gray-200 rounded"></div>
					</div>

					<div className="border-b border-gray-300 pb-6 mb-6">
						<div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
						<div className="flex flex-wrap gap-2 sm:gap-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-8 w-16 bg-gray-200 rounded-xl"
								></div>
							))}
						</div>
					</div>

					<div className="h-12 w-full bg-gray-200 rounded"></div>
				</div>

				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="rounded-lg border border-gray-200 p-3 flex items-center gap-2"
						>
							<div className="w-8 h-8 bg-gray-200 rounded"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 w-3/4 bg-gray-200 rounded"></div>
								<div className="h-3 w-5/6 bg-gray-200 rounded"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
