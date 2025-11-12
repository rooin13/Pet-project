"use client";

import { useBottomNav } from "../model";

export const BottomNav = () => {
	const {
		state: { items, isActive },
		handlers: { navigate },
	} = useBottomNav();

	return (
		<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-black/95 backdrop-blur-md border-t border-white/10">
			<div className="flex items-center justify-around h-full px-2">
				{items.map((item) => (
					<button
						key={item.id}
						onClick={() => navigate(item.path)}
						className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition ${
							isActive(item.path)
								? "text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						<div className="w-6 h-6 flex items-center justify-center">
							{item.icon}
						</div>
						<span className="text-xs font-medium">
							{item.label}
						</span>
					</button>
				))}
			</div>
		</nav>
	);
};
