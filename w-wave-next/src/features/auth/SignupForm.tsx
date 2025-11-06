"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";
import { signupSchema } from "./model/schema";
import { SignupFormData } from "./model/types";

type SignupFormProps = {
	onClose?: () => void;
	onSwitchToLogin?: () => void;
};

export const SignupForm = ({
	onClose,
	onSwitchToLogin,
}: SignupFormProps = {}) => {
	const [generalError, setGeneralError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupFormData) => {
		setLoading(true);
		setGeneralError("");
		setSuccessMessage("");

		const supabase = createClient();

		const { data: authData, error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		setLoading(false);

		if (error) {
			// Обрабатываем разные типы ошибок
			if (
				error.message.toLowerCase().includes("already registered") ||
				error.message.toLowerCase().includes("already exists") ||
				error.message.toLowerCase().includes("duplicate")
			) {
				setGeneralError(
					"❌ This email is already registered. Try logging in instead."
				);
			} else {
				setGeneralError(error.message);
			}
		} else if (!authData.user && authData.session === null) {
			// Supabase иногда возвращает пустой ответ если email уже существует
			setGeneralError(
				"❌ This email is already registered. Try logging in instead."
			);
		} else {
			// Показываем сообщение об отправке письма
			setSuccessMessage(
				"✅ Account created! Check your email to confirm your account."
			);
			// Через 3 секунды закрываем форму
			setTimeout(() => {
				onClose?.();
				router.refresh();
			}, 3000);
		}
	};

	const handleGoogleSignup = async () => {
		const supabase = createClient();
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	return (
		<div>
			<h2 className="text-xl font-bold text-white mb-6">Sign Up</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{generalError && (
					<div className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 text-sm">
						{generalError}
					</div>
				)}

				{successMessage && (
					<div className="bg-green-500/10 border border-green-500 text-green-400 px-3 py-2 text-sm">
						{successMessage}
					</div>
				)}

				<div>
					<label
						htmlFor="email"
						className="block text-xs font-medium mb-1.5 text-gray-400"
					>
						Email
					</label>
					<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
						<input
							type="email"
							id="email"
							{...register("email")}
							className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
							placeholder="your@email.com"
						/>
					</div>
					{errors.email && (
						<p className="text-red-400 text-xs mt-1">
							{errors.email.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-xs font-medium mb-1.5 text-gray-400"
					>
						Password
					</label>
					<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
						<input
							type="password"
							id="password"
							{...register("password")}
							className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
							placeholder="••••••••"
						/>
					</div>
					{errors.password && (
						<p className="text-red-400 text-xs mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-xs font-medium mb-1.5 text-gray-400"
					>
						Confirm Password
					</label>
					<div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition">
						<input
							type="password"
							id="confirmPassword"
							{...register("confirmPassword")}
							className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
							placeholder="••••••••"
						/>
					</div>
					{errors.confirmPassword && (
						<p className="text-red-400 text-xs mt-1">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium transition"
				>
					{loading ? "Creating account..." : "Sign Up"}
				</button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-800"></div>
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="bg-gray-900 px-2 text-gray-500">
							or
						</span>
					</div>
				</div>

				<button
					type="button"
					onClick={handleGoogleSignup}
					className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium transition flex items-center justify-center gap-2"
				>
					<svg className="w-4 h-4" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</button>

				{onSwitchToLogin && (
					<p className="text-center text-sm text-gray-400">
						Already have an account?{" "}
						<button
							type="button"
							onClick={onSwitchToLogin}
							className="text-purple-400 hover:text-purple-300 transition"
						>
							Sign in
						</button>
					</p>
				)}
			</form>
		</div>
	);
};
