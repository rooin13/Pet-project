"use client";

import { useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
	id: string;
	label: string;
	icon: ReactNode;
	path: string;
};

type BottomNavState = {
	items: NavItem[];
	isActive: (path: string) => boolean;
};

type BottomNavHandlers = {
	navigate: (path: string) => void;
};

export const useBottomNav = (): {
	state: BottomNavState;
	handlers: BottomNavHandlers;
} => {
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	const items = useMemo<NavItem[]>(() => {
		const base = `/${locale}`;

		return [
			{
				id: "home",
				label: "Home",
				icon: (
					<svg
						className="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M12 3l9 7-1.5 1.875L18 10.5V19h-5v-5h-2v5H6v-8.5l-1.5 1.375L3 10l9-7z" />
					</svg>
				),
				path: base,
			},
			{
				id: "ai",
				label: "AI",
				icon: <span className="text-xl">✨</span>,
				path: `${base}/ai-playlist`,
			},
			{
				id: "library",
				label: "Library",
				icon: (
					<svg
						className="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
					</svg>
				),
				path: `${base}/library`,
			},
			{
				id: "liked",
				label: "Liked",
				icon: (
					<svg
						className="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				),
				path: `${base}/liked`,
			},
		];
	}, [locale]);

	const isActive = useCallback(
		(path: string) => {
			if (!pathname) {
				return false;
			}

			if (path === `/${locale}`) {
				return pathname === path || pathname === `/${locale}/`;
			}

			return pathname.startsWith(path);
		},
		[locale, pathname]
	);

	const navigate = useCallback(
		(path: string) => {
			router.push(path);
		},
		[router]
	);

	return {
		state: {
			items,
			isActive,
		},
		handlers: {
			navigate,
		},
	};
};
