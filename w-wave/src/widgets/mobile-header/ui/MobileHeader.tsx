"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Modal } from "@/shared/ui/Modal";
import { useMobileHeader } from "../model";

// lazy load auth components
const LoginForm = dynamic(
	() =>
		import("@/features/auth/LoginForm").then((mod) => ({
			default: mod.LoginForm,
		})),
	{ ssr: false }
);
const SignupForm = dynamic(
	() =>
		import("@/features/auth/SignupForm").then((mod) => ({
			default: mod.SignupForm,
		})),
	{ ssr: false }
);
const UsernameSetupModal = dynamic(
	() =>
		import("@/features/auth/UsernameSetupModal").then((mod) => ({
			default: mod.UsernameSetupModal,
		})),
	{ ssr: false }
);

export const MobileHeader = () => {
	const router = useRouter();
	const locale = useLocale();
	const {
		state: {
			user,
			profile,
			isLoadingProfile,
			showAuthModal,
			authMode,
			showUsernameSetup,
		},
		handlers: { openAuth, closeAuth, switchAuthMode },
	} = useMobileHeader();

	return (
		<>
			<header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between">
				{/* profile or login */}
				<div className="flex items-center gap-3">
					{isLoadingProfile ? (
						<div
							className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"
							role="status"
							aria-label="Loading profile"
						/>
					) : user ? (
						<button
							onClick={() => router.push(`/${locale}/profile`)}
							className="flex items-center gap-2"
						>
							<div className="w-8 h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-white/20">
								{profile?.avatar_url ? (
									<Image
										src={profile.avatar_url}
										alt="User"
										width={32}
										height={32}
										className="object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
										{profile?.username?.[0]?.toUpperCase() ||
											user.email?.[0]?.toUpperCase() ||
											"U"}
									</div>
								)}
							</div>
						</button>
					) : (
						<button
							onClick={() => {
								openAuth("login");
							}}
							className="px-4 py-1.5 bg-white text-black text-xs font-medium rounded-full"
						>
							Log in
						</button>
					)}
				</div>

				{/* search */}
				<button
					onClick={() => router.push(`/${locale}/search`)}
					className="p-2 hover:bg-white/10 rounded-full transition"
				>
					<svg
						className="w-6 h-6 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						strokeWidth="2"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.35-4.35" strokeLinecap="round" />
					</svg>
				</button>
			</header>

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
		</>
	);
};
