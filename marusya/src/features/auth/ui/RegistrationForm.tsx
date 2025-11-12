"use client";

import { useState } from "react";
import { Modal } from "@/features/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../model/schema";
import { RegisterDataType } from "../model/types";
import Link from "next/link";
import Image from "next/image";
import { useSignUp, useGoogleSignIn } from "../model/supabase-hooks";
import { Button } from "@/shared/ui/Button/Button";

export const RegisterForm = ({
	onSwitch,
	onClose,
}: {
	onSwitch: () => void;
	onClose: () => void;
}) => {
	const [generalError, setGeneralError] = useState("");
	const [success, setSuccess] = useState(false);
	const signUpMutation = useSignUp();
	const googleSignInMutation = useGoogleSignIn();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<RegisterDataType>({
		resolver: zodResolver(registerSchema),
		mode: "onSubmit",
	});

	const onSubmit = async (formData: RegisterDataType) => {
		setGeneralError("");
		setSuccess(false);

		const result = await signUpMutation.mutateAsync({
			email: formData.email,
			password: formData.password,
			name: formData.name,
			surname: formData.surname,
		});

		if (result.error) {
			setGeneralError(
				result.error instanceof Error
					? result.error.message
					: "Registration failed"
			);
		} else {
			setSuccess(true);
		}
	};

	const handleGoogleSignIn = async () => {
		await googleSignInMutation.mutateAsync();
	};

	if (success) {
		return (
			<Modal isOpen={true} onClose={onClose}>
				<div className="text-center space-y-4 p-6">
					<Link
						href="/"
						className="cursor-pointer flex items-center gap-2 justify-center"
						aria-label="Go to homepage"
					>
						<Image
							src="/images/logo.svg"
							alt="MARUSYA logo"
							width={24}
							height={24}
						/>
						<p className="font-normal text-black text-3xl">
							marusya
						</p>
					</Link>

					<h2 className="text-2xl font-bold text-black">
						Check your email!
					</h2>
					<p className="text-gray-700">
						We sent you a verification link. Click it to activate
						your account.
					</p>
					<Button
						variant="primary"
						onClick={onClose}
						className="w-full"
					>
						Close
					</Button>
				</div>
			</Modal>
		);
	}

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
						fill={errors.name ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
						aria-hidden="true"
					>
						<use xlinkHref={`/images/icons/icons.xml#user`} />
					</svg>
					<input
						id="name"
						type="text"
						placeholder="Name"
						aria-label="First name"
						aria-invalid={!!errors.name}
						aria-describedby={
							errors.name ? "name-error" : undefined
						}
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.name ? "border-red-500" : ""
						}`}
						{...register("name")}
					/>
					{errors.name && (
						<p
							id="name-error"
							role="alert"
							className="text-red-500 text-sm"
						>
							{errors.name.message}
						</p>
					)}
				</div>

				<div className="w-full relative">
					<svg
						fill={errors.surname ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
						aria-hidden="true"
					>
						<use xlinkHref={`/images/icons/icons.xml#user`} />
					</svg>
					<input
						id="surname"
						type="text"
						placeholder="Surname"
						aria-label="Last name"
						aria-invalid={!!errors.surname}
						aria-describedby={
							errors.surname ? "surname-error" : undefined
						}
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.surname ? "border-red-500" : ""
						}`}
						{...register("surname")}
					/>
					{errors.surname && (
						<p
							id="surname-error"
							role="alert"
							className="text-red-500 text-sm"
						>
							{errors.surname.message}
						</p>
					)}
				</div>

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

				<div className="w-full relative">
					<svg
						fill={errors.repeatPassword ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
						aria-hidden="true"
					>
						<use xlinkHref={`/images/icons/icons.xml#key`} />
					</svg>
					<input
						id="repeatPassword"
						type="password"
						placeholder="Repeat password"
						aria-label="Confirm password"
						aria-invalid={!!errors.repeatPassword}
						aria-describedby={
							errors.repeatPassword
								? "repeat-password-error"
								: undefined
						}
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.repeatPassword ? "border-red-500" : ""
						}`}
						{...register("repeatPassword")}
					/>
					{errors.repeatPassword && (
						<p
							id="repeat-password-error"
							role="alert"
							className="text-red-500 text-sm"
						>
							{errors.repeatPassword.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={!isDirty || signUpMutation.isPending}
					aria-label="Create account"
					className={`w-full py-2 rounded-xl transition-colors ${
						!isDirty || signUpMutation.isPending
							? "bg-gray-400 cursor-not-allowed"
							: "bg-primary text-white hover:bg-primary-hover"
					}`}
				>
					{signUpMutation.isPending
						? "Creating account..."
						: "Register"}
				</button>

				{/* Google Sign In */}
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
					Already have an account?{" "}
					<span
						className="text-blue-600 cursor-pointer hover:underline"
						onClick={onSwitch}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								onSwitch();
							}
						}}
					>
						Login
					</span>
				</p>
			</form>
		</Modal>
	);
};
