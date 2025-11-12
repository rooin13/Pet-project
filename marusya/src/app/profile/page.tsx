"use client";

import { Button } from "@/shared/ui/Button/Button";
import { useState } from "react";
import { useCurrentUser, useSignOut } from "@/features/auth";
import { updateProfile } from "@/shared/lib/api/supabase-profile";

const Profile = () => {
	const { data: userData, isLoading, refetch } = useCurrentUser();
	const logoutMutation = useSignOut();
	const [isEditing, setIsEditing] = useState(false);
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [saveError, setSaveError] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const user = userData?.user;
	const profile = userData?.profile;

	// Initialize form fields from profile
	useState(() => {
		if (profile) {
			setUsername(profile.username || "");
			setName(profile.name || "");
			setSurname(profile.surname || "");
		}
	});

	const handleSave = async () => {
		setSaveError("");
		setIsSaving(true);

		// Validate username (2-10 characters)
		if (username && (username.length < 2 || username.length > 10)) {
			setSaveError("Username must be 2-10 characters");
			setIsSaving(false);
			return;
		}

		// Validate name (2-10 characters if provided)
		if (name && (name.length < 2 || name.length > 10)) {
			setSaveError("Name must be 2-10 characters");
			setIsSaving(false);
			return;
		}

		// Validate surname (2-10 characters if provided)
		if (surname && (surname.length < 2 || surname.length > 10)) {
			setSaveError("Surname must be 2-10 characters");
			setIsSaving(false);
			return;
		}

		const result = await updateProfile(username, name, surname);

		if (result.error) {
			setSaveError("Failed to update profile");
		} else {
			setIsEditing(false);
			refetch();
		}

		setIsSaving(false);
	};

	if (isLoading) {
		return (
			<div className="page-wrapper pb-20 min-h-screen text-center">
				<p className="text-white text-xl">Loading...</p>
			</div>
		);
	}

	if (!user || !user.email) {
		return (
			<div className="page-wrapper pb-20 min-h-screen text-center">
				<p className="text-white text-xl">
					Please log in to view your profile
				</p>
			</div>
		);
	}

	return (
		<div className="page-wrapper pb-20 min-h-screen">
			<h3 className="self-stretch mb-10 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white uppercase">
				Profile
			</h3>

			{isEditing ? (
				<div className="text-white space-y-6 max-w-2xl">
					<h4 className="text-2xl font-bold mb-6">Edit Profile</h4>

					{saveError && <p className="text-red-500">{saveError}</p>}

					{/* Username */}
					<div>
						<label className="block text-white/70 mb-2">
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) =>
								setUsername(
									e.target.value
										.toLowerCase()
										.replace(/[^a-z0-9_]/g, "")
										.slice(0, 10)
								)
							}
							className="w-full p-3 rounded-lg bg-gray-700 text-white"
							placeholder="johndoe"
							minLength={2}
							maxLength={10}
						/>
					</div>

					{/* Name */}
					<div>
						<label className="block text-white/70 mb-2">
							First Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) =>
								setName(e.target.value.slice(0, 10))
							}
							className="w-full p-3 rounded-lg bg-gray-700 text-white"
							placeholder="John"
							minLength={2}
							maxLength={10}
						/>
					</div>

					{/* Surname */}
					<div>
						<label className="block text-white/70 mb-2">
							Last Name
						</label>
						<input
							type="text"
							value={surname}
							onChange={(e) =>
								setSurname(e.target.value.slice(0, 10))
							}
							className="w-full p-3 rounded-lg bg-gray-700 text-white"
							placeholder="Doe"
							minLength={2}
							maxLength={10}
						/>
					</div>

					<div className="flex gap-4">
						<Button
							variant="primary"
							onClick={handleSave}
							disabled={isSaving}
						>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
						<Button
							variant="secondary"
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			) : (
				<div className="text-white space-y-6">
					{(profile?.username ||
						profile?.name ||
						profile?.surname) && (
						<div>
							{profile?.username && (
								<div className="mb-4">
									<p className="text-lg text-white/70 mb-2">
										<strong>Username:</strong>
									</p>
									<p className="text-2xl font-bold text-white">
										@{profile.username}
									</p>
								</div>
							)}

							{(profile?.name || profile?.surname) && (
								<div className="mb-4">
									<p className="text-lg text-white/70 mb-2">
										<strong>Full name:</strong>
									</p>
									<p className="text-2xl font-bold text-white">
										{profile?.name} {profile?.surname}
									</p>
								</div>
							)}
						</div>
					)}

					<div>
						<p className="text-lg text-white/70 mb-2">
							<strong>Email:</strong>
						</p>
						<p className="text-2xl font-bold text-white">
							{user.email}
						</p>
					</div>

					<div>
						<p className="text-lg text-white/70 mb-2">
							<strong>Subscription:</strong>
						</p>
						<p className="text-xl text-white">
							{profile?.has_subscription ? (
								<span className="text-green-400">
									Active until{" "}
									{new Date(
										profile.subscription_end
									).toLocaleDateString()}
								</span>
							) : (
								<span className="text-yellow-400">
									No active subscription
								</span>
							)}
						</p>
					</div>

					<div className="flex gap-4">
						<Button
							variant="primary"
							onClick={() => setIsEditing(true)}
						>
							Edit Profile
						</Button>
						<Button
							variant="secondary"
							onClick={() => logoutMutation.mutate()}
						>
							Logout
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
