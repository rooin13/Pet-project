"use client";

import { Modal } from "@/features/modal/ui/Modal";
import { useLoginForm } from "@/features/auth/model/useLoginForm";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { closeModal, toggleModalType } from "@/features/modal/model/modalSlice";
import Link from "next/link";
import Image from "next/image";

export const LoginForm = () => {
	const dispatch = useAppDispatch();
	const { isOpen, modalType } = useAppSelector((state) => state.modal);

	const { form, handleSubmit } = useLoginForm(() => dispatch(closeModal()));
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<Modal
			style="bg-black/50"
			isOpen={isOpen && modalType === "login"}
			onClose={() => dispatch(closeModal())}
		>
			<form
				onSubmit={handleSubmit}
				className="space-y-6 p-8 flex flex-col items-center w-full max-w-md"
				aria-label="Login form"
			>
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2 mb-4"
					aria-label="HEX Store homepage"
				>
					<h2 className="font-semibold text-black text-4xl">Hex</h2>
				</Link>

				<div className="w-full space-y-7">
					// поле email
					<div className="w-full relative min-h-[52px]">
						<label htmlFor="login-email" className="sr-only">
							Email
						</label>
						<svg
							fill={errors.email ? "#ef4444" : "#9ca3af"}
							width={18}
							height={18}
							className="absolute top-3.5 left-3.5 z-10"
							aria-hidden="true"
						>
							<use xlinkHref={`/images/icons/icons.xml#mail`} />
						</svg>
						<input
							id="login-email"
							type="email"
							placeholder="Email"
							className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.email
									? "border-red-500 bg-red-50"
									: "border-gray-300"
							}`}
							{...register("email")}
							aria-invalid={!!errors.email}
							aria-describedby={
								errors.email ? "email-error" : undefined
							}
						/>
						{errors.email && (
							<p
								id="email-error"
								className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
								role="alert"
							>
								{errors.email.message}
							</p>
						)}
					</div>
					// поле пароля
					<div className="w-full relative min-h-[52px]">
						<label htmlFor="login-password" className="sr-only">
							Password
						</label>
						<svg
							fill={errors.password ? "#ef4444" : "#9ca3af"}
							width={18}
							height={18}
							className="absolute top-3.5 left-3.5 z-10"
							aria-hidden="true"
						>
							<use xlinkHref={`/images/icons/icons.xml#key`} />
						</svg>
						<input
							id="login-password"
							type="password"
							placeholder="Password"
							className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.password
									? "border-red-500 bg-red-50"
									: "border-gray-300"
							}`}
							{...register("password")}
							aria-invalid={!!errors.password}
							aria-describedby={
								errors.password ? "password-error" : undefined
							}
						/>
						{errors.password && (
							<p
								id="password-error"
								className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
								role="alert"
							>
								{errors.password.message}
							</p>
						)}
					</div>
				</div>

				<button
					type="submit"
					disabled={!form.formState.isDirty}
					className={`w-full py-3 rounded-xl font-medium transition-colors mt-2 ${
						!form.formState.isDirty
							? "bg-gray-400 text-gray-200 cursor-not-allowed"
							: "bg-black hover:bg-gray-800 text-white"
					}`}
					aria-label="Sign in to your account"
					aria-disabled={!form.formState.isDirty}
				>
					Login
				</button>

				<div className="text-center mt-4">
					<p className="text-gray-600 text-sm">
						Don't have an account?{" "}
						<button
							type="button"
							className="text-blue-600 font-medium hover:underline cursor-pointer"
							onClick={() => dispatch(toggleModalType())}
							aria-label="Switch to registration form"
						>
							Register
						</button>
					</p>
				</div>
			</form>
		</Modal>
	);
};
