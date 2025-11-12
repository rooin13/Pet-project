"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../model/schema";
import { LoginDataType } from "../model/types";
import { Modal } from "@/features/modal";
import Link from "next/link";
import Image from "next/image";
import { useSignIn, useGoogleSignIn } from "../model/supabase-hooks";
import { Button } from "@/shared/ui/Button/Button";

export const LoginForm = ({
	onSwitch,
	onClose,
}: {
	onSwitch: () => void;
	onClose: () => void;
}) => {
	const [generalError, setGeneralError] = useState("");
	const signInMutation = useSignIn();
	const googleSignInMutation = useGoogleSignIn();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginDataType>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (formData: LoginDataType) => {
		setGeneralError("");

		const result = await signInMutation.mutateAsync({
			email: formData.email,
			password: formData.password,
		});

		if (result.error) {
			setGeneralError("Invalid email or password");
		} else {
			onClose();
		}
	};

	const handleGoogleSignIn = async () => {
		await googleSignInMutation.mutateAsync();
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-2 flex flex-col items-center"
			>
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2 mb-1"
					aria-label="Go to homepage"
				>
					<Image
						src="/images/logo.svg"
						alt="MARUSYA logo"
						width={20}
						height={20}
					/>
					<p className="font-normal text-black text-2xl">marusya</p>
				</Link>

				{generalError && (
					<p className="text-red-500 text-sm w-full text-center">
						{generalError}
					</p>
				)}

				<div className="w-full relative">
					<svg
						fill={errors.email ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
						aria-hidden="true"
					>
						<use xlinkHref={`/images/icons/icons.xml#mail`} />
					</svg>
					<input
						id="email"
						type="email"
						placeholder="Email"
						aria-label="Email address"
						aria-invalid={!!errors.email}
						aria-describedby={
							errors.email ? "email-error" : undefined
						}
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.email ? "border-red-500" : ""
						}`}
						{...register("email")}
					/>
					{errors.email && (
						<p
							id="email-error"
							role="alert"
							className="text-red-500 text-sm"
						>
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="w-full relative">
					<svg
						fill={errors.password ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
						aria-hidden="true"
					>
						<use xlinkHref={`/images/icons/icons.xml#key`} />
					</svg>
					<input
						id="password"
						type="password"
						placeholder="Password"
						aria-label="Password"
						aria-invalid={!!errors.password}
						aria-describedby={
							errors.password ? "password-error" : undefined
						}
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.password ? "border-red-500" : ""
						}`}
						{...register("password")}
					/>
					{errors.password && (
						<p
							id="password-error"
							role="alert"
							className="text-red-500 text-sm"
						>
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={signInMutation.isPending}
					className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
					aria-label="Login to account"
				>
					{signInMutation.isPending ? "Signing in..." : "Login"}
				</button>

				<button
					type="button"
					onClick={handleGoogleSignIn}
					disabled={googleSignInMutation.isPending}
					className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
				>
					Continue with Google
					<svg width={20} height={20}>
						<use xlinkHref="/images/icons/icons.xml#google" />
					</svg>
				</button>

				<p className="text-sm text-center text-black">
					Don't have an account?{" "}
					<span
						className="text-blue-600 cursor-pointer hover:underline"
						onClick={onSwitch}
					>
						Register
					</span>
				</p>
			</form>
		</Modal>
	);
};
