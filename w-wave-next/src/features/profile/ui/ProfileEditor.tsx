"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/features/auth/model/schema";
import { UsernameFormData } from "@/features/auth/model/types";
import {
	useGetProfileQuery,
	useUpdateUsernameMutation,
} from "@/shared/lib/api/profileApi";
import { ConnectSpotifyButton } from "@/features/spotify/ui/ConnectSpotifyButton";
import { ImportLikesButton } from "@/features/spotify/ui/ImportLikesButton";

export const ProfileEditor = () => {
	const { data, isLoading: profileLoading } = useGetProfileQuery();
	const [updateUsername, { isLoading: updating }] =
		useUpdateUsernameMutation();

	const [generalError, setGeneralError] = useState("");
	const [success, setSuccess] = useState(false);

	const user = data?.user;
	const profile = data?.profile;

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<UsernameFormData>({
		resolver: zodResolver(usernameSchema),
	});

	// load profile data into form
	useEffect(() => {
		if (profile?.username) {
			reset({ username: profile.username });
		}
	}, [profile, reset]);

	const onSubmit = async (formData: UsernameFormData) => {
		setGeneralError("");
		setSuccess(false);

		try {
			await updateUsername({ username: formData.username }).unwrap();
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (error: unknown) {
			setGeneralError(
				typeof error === "string" ? error : "Failed to update username"
			);
		}
	};

	if (profileLoading) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-400">Loading...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-400">Please log in to view profile</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold text-white">Profile</h1>

			<div className="h-3"></div>

			<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
				<div className="flex items-center gap-6 mb-6">
					{/* avatar */}
					<div className="w-24 h-24 bg-gray-800 border-2 border-white/20 flex items-center justify-center text-white text-3xl font-bold">
						{profile?.username?.[0]?.toUpperCase() ||
							user.email?.[0]?.toUpperCase() ||
							"U"}
					</div>

					<div>
						<h2 className="text-xl font-bold text-white">
							{profile?.username || "No username"}
						</h2>
						<p className="text-sm text-gray-400">{user.email}</p>
					</div>
				</div>

				{/* edit username */}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{generalError && (
						<div className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 text-sm">
							{generalError}
						</div>
					)}

					{success && (
						<div className="bg-green-500/10 border border-green-500 text-green-400 px-3 py-2 text-sm">
							Username updated successfully!
						</div>
					)}

					<div className="flex gap-3 items-start">
						<div
							className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition"
							style={{ width: "200px" }}
						>
							<input
								type="text"
								id="username"
								{...register("username")}
								maxLength={20}
								className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
								placeholder="johndoe"
							/>
						</div>
						<button
							type="submit"
							disabled={updating}
							className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium transition"
						>
							{updating ? "Saving..." : "Save Changes"}
						</button>
					</div>
					{errors.username && (
						<p className="text-red-400 text-xs">
							{errors.username.message}
						</p>
					)}
				</form>
			</div>

			{/* Spotify Connection */}
			<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
				<h2 className="text-lg font-semibold text-white mb-4">
					Spotify Integration
				</h2>
				<div className="space-y-4">
					<ConnectSpotifyButton />
					<ImportLikesButton />
				</div>
			</div>

			{/* stats */}
			<div className="grid grid-cols-3 gap-4">
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
					<p className="text-2xl font-bold text-white">0</p>
					<p className="text-xs text-gray-400 mt-1">Playlists</p>
				</div>
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
					<p className="text-2xl font-bold text-white">0</p>
					<p className="text-xs text-gray-400 mt-1">Followers</p>
				</div>
				<div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
					<p className="text-2xl font-bold text-white">0</p>
					<p className="text-xs text-gray-400 mt-1">Following</p>
				</div>
			</div>
		</div>
	);
};
