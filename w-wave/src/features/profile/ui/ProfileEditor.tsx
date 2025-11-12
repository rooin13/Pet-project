"use client";

import { ConnectSpotifyButton } from "@/features/spotify/ui/ConnectSpotifyButton";
import { ImportLikesButton } from "@/features/spotify/ui/ImportLikesButton";
import { useProfileEditor } from "../model";
import { useTranslations } from "next-intl";

export const ProfileEditor = () => {
	const t = useTranslations("profile");
	const {
		state: {
			userEmail,
			displayName,
			initial,
			isProfileLoading,
			isUpdating,
			status,
		},
		form,
		handlers,
	} = useProfileEditor();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	if (isProfileLoading) {
		return (
			<div
				className="max-w-2xl mx-auto px-4 lg:px-0 space-y-4 animate-pulse"
				role="status"
				aria-label={t("loadingProfile")}
			>
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 lg:p-6 space-y-4">
					<div className="flex items-center gap-4 lg:gap-6">
						<div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white/10" />
						<div className="space-y-2 flex-1">
							<div className="h-4 bg-white/10 rounded w-1/2" />
							<div className="h-3 bg-white/10 rounded w-1/3" />
						</div>
					</div>
					<div className="h-10 bg-white/10 rounded" />
				</div>
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 lg:p-6 h-24" />
				<div className="grid grid-cols-3 gap-2 lg:gap-4">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={`profile-stat-skeleton-${index}`}
							className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 lg:p-4"
						>
							<div className="h-5 bg-white/10 rounded w-1/2 mx-auto" />
							<div className="h-3 bg-white/10 rounded w-3/4 mx-auto mt-2" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!userEmail) {
		return (
			<div className="text-center py-12" role="status" aria-live="polite">
				<p className="text-gray-400">{t("loginPrompt")}</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto px-4 lg:px-0">
			<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 lg:p-6 mb-4 lg:mb-6">
				<div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
					{/* avatar */}
					<div
						className="w-16 h-16 lg:w-24 lg:h-24 bg-gray-800 border-2 border-white/20 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shrink-0"
						aria-label={t("avatarLabel", { initial })}
					>
						{initial}
					</div>

					<div className="min-w-0">
						<h2
							className="text-lg lg:text-xl font-bold text-white truncate"
							title={displayName || t("noUsername")}
							aria-live="polite"
						>
							{displayName || t("noUsername")}
						</h2>
						<p
							className="text-xs lg:text-sm text-gray-400 truncate"
							title={userEmail}
						>
							{userEmail}
						</p>
					</div>
				</div>

				{/* edit username */}
				<form
					onSubmit={handleSubmit(handlers.submit)}
					className="space-y-4"
					aria-labelledby="profile-username-heading"
				>
					<h3 id="profile-username-heading" className="sr-only">
						{t("usernameSectionTitle")}
					</h3>

					{status.error && (
						<div
							className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 text-sm"
							role="alert"
						>
							{status.error}
						</div>
					)}

					{status.isSuccess && (
						<div
							className="bg-green-500/10 border border-green-500 text-green-400 px-3 py-2 text-sm"
							role="status"
							aria-live="polite"
						>
							{t("updateSuccess")}
						</div>
					)}

					<div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-start">
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition flex-1 lg:flex-none lg:w-[220px]">
							<input
								type="text"
								id="username"
								{...register("username")}
								maxLength={20}
								className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
								placeholder={t("usernamePlaceholder")}
								aria-label={t("usernameFieldLabel")}
							/>
						</div>
						<button
							type="submit"
							disabled={isUpdating}
							className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium transition"
							aria-label={
								isUpdating ? t("saving") : t("saveChanges")
							}
						>
							{isUpdating ? t("saving") : t("saveChanges")}
						</button>
					</div>
					{errors.username && (
						<p className="text-red-400 text-xs" role="alert">
							{errors.username.message}
						</p>
					)}
				</form>
			</div>

			{/* spotify connection */}
			<div
				className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 lg:p-6 mb-4 lg:mb-6"
				aria-label={t("spotifySectionLabel")}
			>
				<div className="space-y-3 lg:space-y-4">
					<ConnectSpotifyButton />
					<ImportLikesButton />
				</div>
			</div>

			{/* stats */}
			<div
				className="grid grid-cols-3 gap-2 lg:gap-4"
				aria-label={t("statsSectionLabel")}
			>
				{(
					[
						{ value: 0, label: t("stats.playlists") },
						{ value: 0, label: t("stats.followers") },
						{ value: 0, label: t("stats.following") },
					] as const
				).map((stat) => (
					<div
						key={stat.label}
						className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 lg:p-4 text-center rounded"
						role="group"
						aria-label={stat.label}
					>
						<p
							className="text-xl lg:text-2xl font-bold text-white"
							aria-live="polite"
						>
							{stat.value}
						</p>
						<p className="text-[10px] lg:text-xs text-gray-400 mt-1">
							{stat.label}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
