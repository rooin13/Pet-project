"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { usernameSchema, UsernameFormData } from "./model";
import { Modal } from "@/shared/ui/Modal";
import { useUpdateUsernameMutation } from "@/shared/lib/api/profileApi";

type UsernameSetupModalProps = {
	isOpen: boolean;
};

export const UsernameSetupModal = ({ isOpen }: UsernameSetupModalProps) => {
	const [generalError, setGeneralError] = useState("");
	const router = useRouter();
	const [updateUsername, { isLoading }] = useUpdateUsernameMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UsernameFormData>({
		resolver: zodResolver(usernameSchema),
	});

	const onSubmit = async (data: UsernameFormData) => {
		setGeneralError("");

		try {
			await updateUsername({ username: data.username }).unwrap();
			router.refresh();
		} catch (error: unknown) {
			setGeneralError(
				typeof error === "string" ? error : "Failed to set username"
			);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={() => {}}>
			<div>
				<h2 className="text-xl font-bold text-white mb-2">
					Choose your username
				</h2>
				<p className="text-sm text-gray-400 mb-6">
					This will be visible to other users
				</p>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{generalError && (
						<div className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 text-sm">
							{generalError}
						</div>
					)}

					<div>
						<label
							htmlFor="username"
							className="block text-xs font-medium mb-1.5 text-gray-400"
						>
							Username
						</label>
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
							<input
								type="text"
								id="username"
								{...register("username")}
								className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
								placeholder="johndoe"
								autoFocus
							/>
						</div>
						{errors.username && (
							<p className="text-red-400 text-xs mt-1">
								{errors.username.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium transition"
					>
						{isLoading ? "Saving..." : "Continue"}
					</button>
				</form>
			</div>
		</Modal>
	);
};
