"use client";

import { Modal } from "@/features/modal/ui/Modal";
import { useRegisterForm } from "@/features/auth/model/useRegisterForm";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeModal, toggleModalType } from "@/features/modal/model/modalSlice";

export const RegisterForm = () => {
	const dispatch = useAppDispatch();
	const { isOpen, modalType } = useAppSelector((state) => state.modal);

	const { form, handleSubmit } = useRegisterForm(() =>
		dispatch(closeModal())
	);
	const {
		register,
		formState: { errors, isDirty },
	} = form;

	return (
		<Modal
			style="bg-black/50"
			isOpen={isOpen && modalType === "register"}
			onClose={() => dispatch(closeModal())}
		>
			<form
				onSubmit={handleSubmit}
				className="space-y-6 p-8 flex flex-col items-center w-full max-w-md"
				aria-label="Registration form"
			>
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2 mb-4"
					aria-label="HEX Store homepage"
				>
					<h2 className="font-semibold text-black text-4xl">Hex</h2>
				</Link>
				<div className="w-full space-y-6">
					// поля имени и фамилии
					<div className="grid grid-cols-2 gap-3 min-h-[52px]">
						<div className="relative">
							<label htmlFor="register-name" className="sr-only">
								First Name
							</label>
							<svg
								fill={errors.name ? "#ef4444" : "#9ca3af"}
								width={18}
								height={18}
								className="absolute top-3.5 left-3.5 z-10"
								aria-hidden="true"
							>
								<use
									xlinkHref={`/images/icons/icons.xml#user`}
								/>
							</svg>
							<input
								id="register-name"
								type="text"
								placeholder="First Name"
								className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.name
										? "border-red-500 bg-red-50"
										: "border-gray-300"
								}`}
								{...register("name")}
								aria-invalid={!!errors.name}
							/>
							{errors.name && (
								<p
									className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
									role="alert"
								>
									{errors.name.message}
								</p>
							)}
						</div>

						<div className="relative">
							<label
								htmlFor="register-surname"
								className="sr-only"
							>
								Last Name
							</label>
							<svg
								fill={errors.surname ? "#ef4444" : "#9ca3af"}
								width={18}
								height={18}
								className="absolute top-3.5 left-3.5 z-10"
								aria-hidden="true"
							>
								<use
									xlinkHref={`/images/icons/icons.xml#user`}
								/>
							</svg>
							<input
								id="register-surname"
								type="text"
								placeholder="Last Name"
								className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.surname
										? "border-red-500 bg-red-50"
										: "border-gray-300"
								}`}
								{...register("surname")}
								aria-invalid={!!errors.surname}
							/>
							{errors.surname && (
								<p
									className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
									role="alert"
								>
									{errors.surname.message}
								</p>
							)}
						</div>
					</div>
					// поле email
					<div className="w-full relative min-h-[52px]">
						<label htmlFor="register-email" className="sr-only">
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
							id="register-email"
							type="email"
							placeholder="Email"
							className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.email
									? "border-red-500 bg-red-50"
									: "border-gray-300"
							}`}
							{...register("email")}
							aria-invalid={!!errors.email}
						/>
						{errors.email && (
							<p
								className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
								role="alert"
							>
								{errors.email.message}
							</p>
						)}
					</div>
					// поле пароля
					<div className="w-full relative min-h-[52px]">
						<label htmlFor="register-password" className="sr-only">
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
							id="register-password"
							type="password"
							placeholder="Password"
							className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.password
									? "border-red-500 bg-red-50"
									: "border-gray-300"
							}`}
							{...register("password")}
							aria-invalid={!!errors.password}
						/>
						{errors.password && (
							<p
								className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
								role="alert"
							>
								{errors.password.message}
							</p>
						)}
					</div>
					// подтверждение пароля
					<div className="w-full relative min-h-[52px]">
						<label
							htmlFor="register-repeat-password"
							className="sr-only"
						>
							Confirm Password
						</label>
						<svg
							fill={errors.repeatPassword ? "#ef4444" : "#9ca3af"}
							width={18}
							height={18}
							className="absolute top-3.5 left-3.5 z-10"
							aria-hidden="true"
						>
							<use xlinkHref={`/images/icons/icons.xml#key`} />
						</svg>
						<input
							id="register-repeat-password"
							type="password"
							placeholder="Confirm password"
							className={`border p-3 pl-11 w-full rounded-xl text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.repeatPassword
									? "border-red-500 bg-red-50"
									: "border-gray-300"
							}`}
							{...register("repeatPassword")}
							aria-invalid={!!errors.repeatPassword}
						/>
						{errors.repeatPassword && (
							<p
								className="absolute left-0 top-full mt-1 text-red-500 text-xs whitespace-nowrap"
								role="alert"
							>
								{errors.repeatPassword.message}
							</p>
						)}
					</div>
				</div>
				// кнопка отправки
				<button
					type="submit"
					disabled={!isDirty}
					className={`w-full py-3 rounded-xl font-medium transition-colors mt-2 ${
						!isDirty
							? "bg-gray-400 text-gray-200 cursor-not-allowed"
							: "bg-black hover:bg-gray-800 text-white"
					}`}
					aria-label="Create new account"
					aria-disabled={!isDirty}
				>
					Register
				</button>
				<div className="text-center mt-4">
					<p className="text-gray-600 text-sm">
						Already have an account?{" "}
						<button
							type="button"
							className="text-blue-600 font-medium hover:underline cursor-pointer"
							onClick={() => dispatch(toggleModalType())}
							aria-label="Switch to login form"
						>
							Login
						</button>
					</p>
				</div>
			</form>
		</Modal>
	);
};
