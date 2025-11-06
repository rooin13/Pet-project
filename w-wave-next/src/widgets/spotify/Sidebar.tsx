"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Modal } from "@/shared/ui/Modal";
import { useGetProfileQuery } from "@/shared/lib/api/profileApi";
import { useGetMyPlaylistsQuery } from "@/shared/lib/api/musicApi";

// lazy load auth components (не загружаются пока не нужны)
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
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");

	// get profile from redux (cached!)
	const { data, isLoading } = useGetProfileQuery();
	const { data: playlists = [] } = useGetMyPlaylistsQuery(undefined, {
		refetchOnMountOrArgChange: false,
	});

	const user = data?.user;
	const profile = data?.profile;
	const showUsernameSetup = !!(user && !profile?.username);

	return (
		<aside className="w-56 bg-gray-950 flex flex-col border-r border-gray-800">
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
			<nav className="flex-1 px-2 py-3">
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
							<span className="text-sm">{t("nav.search")}</span>
						</button>
					</li>
				</ul>

				{/* divider */}
				<div className="my-2 border-t border-gray-800"></div>

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
							onClick={() =>
								router.push(`/${locale}/create-playlist`)
							}
							className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-900 transition text-gray-400 hover:text-white"
						>
							<svg
								className="w-5 h-5 shrink-0"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
							</svg>
							<span className="text-sm">Playlists</span>
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
							<span className="text-sm">Liked Songs</span>
						</button>
					</li>
				</ul>

				{/* playlists */}
				{playlists.length > 0 && (
					<>
						<div className="my-2 border-t border-gray-800"></div>
						<ul className="space-y-px max-h-[200px] overflow-y-auto">
							{playlists.slice(0, 10).map((playlist) => (
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
					</>
				)}
			</nav>

			{/* auth section */}
			<div className="h-14 px-2 border-t border-white/10 bg-black/80 backdrop-blur-md flex items-center">
				{isLoading ? (
					<div className="px-0.5 text-xs text-gray-500">
						Loading...
					</div>
				) : user ? (
					<button
						onClick={() => router.push(`/${locale}/profile`)}
						className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-gray-900 transition group"
						aria-label="Open profile"
					>
						<div className="w-8 h-8 bg-gray-800 shrink-0 overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition relative">
							{profile?.avatar_url ? (
								<Image
									src={profile.avatar_url}
									alt="User avatar"
									fill
									sizes="32px"
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-white text-xs font-medium bg-gray-800">
									{profile?.username?.[0]?.toUpperCase() ||
										user.email?.[0]?.toUpperCase() ||
										"U"}
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs text-white truncate">
								{profile?.username || "Set username"}
							</p>
						</div>
					</button>
				) : (
					<button
						onClick={() => {
							setAuthMode("login");
							setShowAuthModal(true);
						}}
						className="w-full h-10 bg-white hover:bg-gray-100 text-black text-sm font-medium transition"
					>
						Log in
					</button>
				)}
			</div>

			{/* auth modal */}
			<Modal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			>
				{authMode === "login" ? (
					<LoginForm
						onClose={() => setShowAuthModal(false)}
						onSwitchToSignup={() => setAuthMode("signup")}
					/>
				) : (
					<SignupForm
						onClose={() => setShowAuthModal(false)}
						onSwitchToLogin={() => setAuthMode("login")}
					/>
				)}
			</Modal>

			{/* username setup modal */}
			<UsernameSetupModal isOpen={showUsernameSetup} />
		</aside>
	);
};
