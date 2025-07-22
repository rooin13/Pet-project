"use client";

import { registerThunk } from "@/features/auth/model/slice";
import { Modal } from "@/features/modal/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/model/shema";
import { useAppDispatch } from "@/store/index";
import { RegisterDataType } from "@/features/auth/model/types";
import Link from "next/link";
import Image from "next/image";

export const RegisterForm = ({
	onSwitch,
	onClose,
}: {
	onSwitch: () => void;
	onClose: () => void;
}) => {
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		setError,
	} = useForm<RegisterDataType>({
		resolver: zodResolver(registerSchema),
		mode: "onSubmit",
	});

	const onSubmit = async (data: RegisterDataType) => {
		const action = await dispatch(registerThunk(data));
		if (registerThunk.rejected.match(action) && action.payload === 409) {
			setError("repeatPassword", {
				type: "manual",
				message: "This email already been used",
			});
			setError("email", {
				type: "manual",
				message: "",
			});
			return;
		} else {
			onClose();
		}
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4 flex flex-col items-center"
			>
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2"
				>
					<Image
						src="/images/logo.svg"
						alt="Поиск"
						width={24}
						height={24}
					/>
					<p className="font-normal text-black text-3xl">marusya</p>
				</Link>

				{/* Name Field */}
				<div className="w-full relative">
					<svg
						fill={errors.name ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#user`} />
					</svg>
					<input
						type="text"
						placeholder="Name"
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.name ? "border-red-500" : ""
						}`}
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Surname Field */}
				<div className="w-full relative">
					<svg
						fill={errors.surname ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#user`} />
					</svg>
					<input
						type="text"
						placeholder="Surname"
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.surname ? "border-red-500" : ""
						}`}
						{...register("surname")}
					/>
					{errors.surname && (
						<p className="text-red-500 text-sm">
							{errors.surname.message}
						</p>
					)}
				</div>

				{/* Email Field */}
				<div className="w-full relative">
					<svg
						fill={errors.email ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#mail`} />
					</svg>
					<input
						type="text"
						placeholder="Email"
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.email ? "border-red-500" : ""
						}`}
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password Field */}
				<div className="w-full relative">
					<svg
						fill={errors.password ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#key`} />
					</svg>
					<input
						type="password"
						placeholder="Password"
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.password ? "border-red-500" : ""
						}`}
						{...register("password")}
					/>
					{errors.password && (
						<p className="text-red-500 text-sm">
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Repeat Password Field */}
				<div className="w-full relative">
					<svg
						fill={errors.repeatPassword ? "red" : "gray"}
						width={20}
						height={20}
						className="absolute top-3 left-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#key`} />
					</svg>
					<input
						type="password"
						placeholder="Repeat your password"
						className={`border p-2 pl-8 w-full rounded-lg text-black ${
							errors.repeatPassword ? "border-red-500" : ""
						}`}
						{...register("repeatPassword")}
					/>
					{errors.repeatPassword && (
						<p className="text-red-500 text-sm">
							{errors.repeatPassword.message}
						</p>
					)}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={!isDirty}
					className={`w-full py-2 rounded-xl ${
						!isDirty
							? "bg-gray-400 cursor-not-allowed"
							: "bg-primary text-white"
					}`}
				>
					Register
				</button>

				<p className="text-sm text-center">
					Already have an account?{" "}
					<span
						className="text-blue-600 cursor-pointer"
						onClick={onSwitch}
					>
						Login
					</span>
				</p>
			</form>
		</Modal>
	);
};
