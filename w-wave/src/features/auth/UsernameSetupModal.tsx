"use client";

import { useUsernameSetup } from "./model/hooks";
import { Modal } from "@/shared/ui/Modal";

type UsernameSetupModalProps = {
	isOpen: boolean;
};

export const UsernameSetupModal = ({ isOpen }: UsernameSetupModalProps) => {
	const {
		form: {
			register,
			handleSubmit,
			formState: { errors },
		},
		state: { error, step, isCheckingSpotify, isSubmitting },
		handlers: { submit, connectSpotify, skipSpotify },
	} = useUsernameSetup(isOpen);

	return (
		<Modal isOpen={isOpen} onClose={() => {}}>
			<div>
				{step === "username" ? (
					<>
						<h2 className="text-xl font-bold text-white mb-2">
							choose your username
						</h2>
						<p className="text-sm text-gray-400 mb-6">
							this will be visible to other users
						</p>

						<form
							onSubmit={handleSubmit(submit)}
							className="space-y-4"
						>
							{error && (
								<div className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 text-sm">
									{error}
								</div>
							)}

							<div>
								<label
									htmlFor="username"
									className="block text-xs font-medium mb-1.5 text-gray-400"
								>
									username
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
								disabled={isSubmitting || isCheckingSpotify}
								className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium transition"
							>
								{isSubmitting ? "saving..." : "continue"}
							</button>
						</form>
					</>
				) : (
					<>
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-green-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							</div>
							<h2 className="text-xl font-bold text-white mb-2">
								connect spotify
							</h2>
							<p className="text-sm text-gray-400">
								connect your spotify account to listen to full
								tracks and sync your music
							</p>
						</div>

						<div className="space-y-3">
							<button
								onClick={connectSpotify}
								className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition flex items-center justify-center gap-2"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
								</svg>
								connect spotify
							</button>

							<button
								onClick={skipSpotify}
								className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium transition"
							>
								skip for now
							</button>
						</div>

						<p className="text-xs text-gray-500 text-center mt-4">
							you can connect spotify later from your profile
							settings
						</p>
					</>
				)}
			</div>
		</Modal>
	);
};
