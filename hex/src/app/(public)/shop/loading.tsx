export default function Loading() {
	return (
		<section className="bg-white pt-10">
			<h2 className="text-black font-semibold text-6xl mb-15 animate-pulse bg-gray-300 rounded w-48 h-12" />

			<div className="w-full relative mb-40">
				<div className="grid grid-cols-4 gap-8">
					{[...Array(4)].map((_, idx) => (
						<div
							key={idx}
							className="rounded-3xl bg-gray-300 h-71  flex flex-col items-center justify-center"
						></div>
					))}
				</div>
			</div>

			<div>
				<h3 className="text-black font-semibold text-2xl mb-10 animate-pulse bg-gray-300 rounded w-64 h-8" />

				<ul className="flex flex-wrap gap-8 space-y-3">
					{[...Array(8)].map((_, idx) => (
						<li
							key={idx}
							className="rounded-3xl bg-gray-300 h-48 w-44 animate-pulse flex flex-col items-center justify-center"
						>
							<div className="w-36 h-28 bg-gray-400 rounded-xl mb-3" />
							<div className="w-20 h-5 bg-gray-400 rounded" />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
