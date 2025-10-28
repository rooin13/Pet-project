"use client";

import { useState } from "react";
import { Modal } from "@/features/modal/modal";
import { Button } from "@/shared/ui/Button/Button";
import {
	updateProfile,
	isUsernameAvailable,
} from "@/shared/lib/api/supabase-profile";
import Link from "next/link";
import Image from "next/image";

interface UsernameSetupFormProps {
	onClose: () => void;
	onSuccess: () => void;
}

export const UsernameSetupForm = ({
	onClose,
	onSuccess,
}: UsernameSetupFormProps) => {
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Validate username (2-10 characters)
		if (username.length < 2) {
			setError("Username must be at least 2 characters");
			setIsLoading(false);
			return;
		}
		if (username.length > 10) {
			setError("Username must be max 10 characters");
			setIsLoading(false);
			return;
		}

		// Validate name (2-10 characters if provided)
		if (name && (name.length < 2 || name.length > 10)) {
			setError("Name must be 2-10 characters");
			setIsLoading(false);
			return;
		}

		// Validate surname (2-10 characters if provided)
		if (surname && (surname.length < 2 || surname.length > 10)) {
			setError("Surname must be 2-10 characters");
			setIsLoading(false);
			return;
		}

		// Check if username available
		const available = await isUsernameAvailable(username);
		if (!available) {
			setError("Username already taken");
			setIsLoading(false);
			return;
		}

		// Update profile
		const result = await updateProfile(username, name, surname);

		if (result.error) {
			setError("Failed to update profile");
			setIsLoading(false);
		} else {
			onSuccess();
		}
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<form
				onSubmit={handleSubmit}
				className="space-y-4 flex flex-col items-center p-6"
			>
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2"
					aria-label="Go to homepage"
				>
					<Image
						src="/images/logo.svg"
						alt="MARUSYA logo"
						width={24}
						height={24}
					/>
					<p className="font-normal text-black text-3xl">marusya</p>
				</Link>

				<h2 className="text-2xl font-bold text-black mb-2">
					Complete Your Profile
				</h2>
				<p className="text-gray-600 text-sm text-center mb-4">
					Choose a username and tell us your name
				</p>

				{error && (
					<p className="text-red-500 text-sm w-full text-center">
						{error}
					</p>
				)}

				<div className="w-full">
					<label
						htmlFor="username"
						className="block text-black mb-2 text-sm"
					>
						Username *
					</label>
					<input
						id="username"
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
						placeholder="johndoe"
						className="border p-2 w-full rounded-lg text-black"
						required
						minLength={2}
						maxLength={10}
					/>
				</div>

				<div className="w-full">
					<label
						htmlFor="name"
						className="block text-black mb-2 text-sm"
					>
						First Name (optional)
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value.slice(0, 10))}
						placeholder="John"
						className="border p-2 w-full rounded-lg text-black"
						minLength={2}
						maxLength={10}
					/>
				</div>

				<div className="w-full">
					<label
						htmlFor="surname"
						className="block text-black mb-2 text-sm"
					>
						Last Name (optional)
					</label>
					<input
						id="surname"
						type="text"
						value={surname}
						onChange={(e) =>
							setSurname(e.target.value.slice(0, 10))
						}
						placeholder="Doe"
						className="border p-2 w-full rounded-lg text-black"
						minLength={2}
						maxLength={10}
					/>
				</div>

				<Button
					type="submit"
					variant="primary"
					disabled={isLoading || username.length < 2}
					className="w-full"
				>
					{isLoading ? "Saving..." : "Continue"}
				</Button>
			</form>
		</Modal>
	);
};
