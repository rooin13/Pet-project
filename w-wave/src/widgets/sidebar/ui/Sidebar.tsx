"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Modal } from "@/shared/ui/Modal";
import { useSidebar } from "../model";

// lazy load auth components
const LoginForm = dynamic(
	() =>
		import("@/features/auth/LoginForm").then((mod) => ({
			default: mod.LoginForm,
		})),
	{
		ssr: false,
	}
);
const SignupForm = dynamic(
	() =>
		import("@/features/auth/SignupForm").then((mod) => ({
			default: mod.SignupForm,
		})),
	{
		ssr: false,
	}
);
const UsernameSetupModal = dynamic(
	() =>
		import("@/features/auth/UsernameSetupModal").then((mod) => ({
			default: mod.UsernameSetupModal,
		})),
	{
		ssr: false,
	}
);

export const Sidebar = () => {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const {
		state: {
			user,
			profile,
			visiblePlaylists,
			isLoadingProfile,
			showAuthModal,
			authMode,
			showUsernameSetup,
		},
		handlers: { openAuth, closeAuth, switchAuthMode },
	} = useSidebar();

	const profileDisplayName = useMemo(() => {
		const safe = (value: unknown) =>
			typeof value === "string" ? value.trim() : "";
		const username = safe(profile?.username);
		const profileName = safe(
			profile && "display_name" in profile
				? (profile as Record<string, unknown>).display_name
				: undefined
		);

		return username || profileName || t("nav.profile");
	}, [profile, t]);

	return (
		<aside className="w-56 h-full bg-gray-950 flex flex-col border-r border-gray-800">
			{/* logo */}
			<div className="h-14 pl-5 flex items-center border-b border-gray-800">
				<Image
					src="/img/hedaer-logo.svg"
					alt="W-Wave"
					width={90}
					height={20}
					className="brightness-0 invert"
				/>
			</div>

			{/* navigation */}
			<nav className="flex-1 px-3 py-4 flex flex-col overflow-hidden">
				<div className="space-y-3">
					<ul className="space-y-px">
						<li>
							<button
								onClick={() => router.push(`/${locale}`)}
								className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
							>
								<svg
									className="w-5 h-5 shrink-0"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 3l9 7-1.5 1.875L18 10.5V19h-5v-5h-2v5H6v-8.5l-1.5 1.375L3 10l9-7z" />
								</svg>
								<span className="text-sm">{t("nav.home")}</span>
							</button>
						</li>
						<li>
							<button
								onClick={() => router.push(`/${locale}/search`)}
								className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
							>
								<svg
									className="w-5 h-5 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
								>
									<circle cx="11" cy="11" r="8" />
									<path
										d="m21 21-4.35-4.35"
										strokeLinecap="round"
									/>
								</svg>
								<span className="text-sm">
									{t("nav.search")}
								</span>
							</button>
						</li>
						<li>
							<button
								onClick={() =>
									router.push(`/${locale}/library`)
								}
								className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
							>
								<svg
									className="w-5 h-5 shrink-0"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M4 4h9a3 3 0 0 1 3 3v9h4v2h-5a2 2 0 0 1-2-2V7H6v11H4z" />
								</svg>
								<span className="text-sm">
									{t("nav.library")}
								</span>
							</button>
						</li>
					</ul>

					<div className="border-t border-gray-800"></div>

					<ul className="space-y-px">
						<li>
							<button
								onClick={() =>
									router.push(`/${locale}/ai-playlist`)
								}
								className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
							>
								<span className="text-sm shrink-0 w-5 flex items-center justify-center">
									✨
								</span>
								<span className="text-sm">
									{t("nav.aiPlaylist")}
								</span>
							</button>
						</li>
						<li>
							<button
								onClick={() => router.push(`/${locale}/liked`)}
								className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
							>
								<svg
									className="w-5 h-5 shrink-0"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
								</svg>
								<span className="text-sm">
									{t("nav.likedSongs")}
								</span>
							</button>
						</li>
					</ul>
				</div>

				<div className="mt-4 border-t border-gray-800 pt-3 flex-1 overflow-y-auto pr-1">
					{isLoadingProfile ? (
						<ul
							className="space-y-px animate-pulse"
							role="status"
							aria-label={t("nav.loadingPlaylists")}
						>
							{Array.from({ length: 8 }).map((_, index) => (
								<li key={`sidebar-playlist-skeleton-${index}`}>
									<div className="flex items-center gap-2.5 px-2.5 py-2">
										<div className="w-5 h-5 bg-white/10 rounded" />
										<div className="h-3 w-32 bg-white/10 rounded" />
									</div>
								</li>
							))}
						</ul>
					) : visiblePlaylists.length > 0 ? (
						<ul className="space-y-px">
							{visiblePlaylists.map((playlist) => (
								<li key={playlist.id}>
									<button
										onClick={() =>
											router.push(
												`/${locale}/playlist/${playlist.id}`
											)
										}
										className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
										title={playlist.name}
									>
										<svg
											className="w-5 h-5 shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
										</svg>
										<span className="text-sm truncate">
											{playlist.name}
										</span>
									</button>
								</li>
							))}
						</ul>
					) : (
						<p className="px-2.5 py-2 text-xs text-gray-500">
							{t("nav.noPlaylists")}
						</p>
					)}
				</div>
			</nav>

			{/* auth section */}
			<div className="mt-auto border-t border-gray-800">
				{user ? (
					<button
						onClick={() => router.push(`/${locale}/profile`)}
						className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition"
					>
						<div className="w-10 h-10 bg-white/10 overflow-hidden">
							{profile?.avatar_url ? (
								<Image
									src={profile.avatar_url}
									alt={profileDisplayName}
									width={40}
									height={40}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-sm font-semibold">
									{profile?.username
										?.slice(0, 1)
										.toUpperCase() || "?"}
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold truncate">
								{profileDisplayName}
							</p>
						</div>
						<svg
							className="w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
						>
							<path
								d="m9 5 7 7-7 7"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				) : (
					<button
						onClick={() => openAuth("login")}
						className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
						>
							<path
								d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM4.5 20a7.5 7.5 0 0 1 15 0"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span className="text-sm font-semibold truncate">
							{t("nav.loadingProfile")}
						</span>
						<svg
							className="w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
						>
							<path
								d="m9 5 7 7-7 7"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				)}
			</div>

			{/* auth modal */}
			<Modal isOpen={showAuthModal} onClose={closeAuth}>
				{authMode === "login" ? (
					<LoginForm
						onClose={closeAuth}
						onSwitchToSignup={() => switchAuthMode("signup")}
					/>
				) : (
					<SignupForm
						onClose={closeAuth}
						onSwitchToLogin={() => switchAuthMode("login")}
					/>
				)}
			</Modal>

			{/* username setup modal */}
			<UsernameSetupModal isOpen={showUsernameSetup} />
		</aside>
	);
};
