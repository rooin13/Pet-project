export default function Loading() {
	return (
		<div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10 pt-20 animate-pulse">
			{/* LEFT SIDE */}
			<div className="lg:col-span-2 flex flex-col space-y-6">
				<div className="h-12 w-1/3 ml-6 bg-gray-200 rounded"></div>

				<div className="relative w-1/2">
					<div className="rounded-xl w-full h-96 bg-gray-200"></div>

					{/* Heart placeholder */}
					<div className="absolute top-2 right-2 w-10 h-10 bg-gray-300 rounded-full"></div>
				</div>

				<div className="ml-6 space-y-2">
					<div className="h-4 w-5/6 bg-gray-200 rounded"></div>
					<div className="h-4 w-4/6 bg-gray-200 rounded"></div>
					<div className="h-4 w-3/6 bg-gray-200 rounded"></div>
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="flex flex-col space-y-6">
				<div className="bg-white p-6 pt-0 rounded-2xl space-y-6">
					<div className="h-8 w-1/3 mb-6 bg-gray-200 rounded"></div>

					<div className="border-b border-gray-400 pb-10 mb-8">
						<div className="h-6 w-1/4 mb-4 bg-gray-200 rounded"></div>
						<div className="flex space-x-3 mb-10">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="w-8 h-8 rounded-full bg-gray-300"
								></div>
							))}
						</div>
					</div>

					<div className="h-12 w-full bg-gray-200 rounded"></div>
				</div>

				{/* Info Boxes */}
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-start space-x-3 p-4 bg-secondery rounded-xl"
						>
							<div className="w-8 h-8 bg-gray-300 rounded"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 w-2/3 bg-gray-300 rounded"></div>
								<div className="h-3 w-4/5 bg-gray-300 rounded"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
