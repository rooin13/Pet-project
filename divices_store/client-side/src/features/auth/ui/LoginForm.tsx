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
			style="bg-black/50 "
			isOpen={isOpen && modalType === "login"}
			onClose={() => dispatch(closeModal())}
		>
			<form
				onSubmit={handleSubmit}
				className="space-y-4 p-5 flex flex-col items-center"
			>
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2"
				>
					{/* <Image
						src="/images/logo.svg"
						alt="logo"
						width={24}
						height={24}
					/> */}
					<p className="font-normal text-black text-3xl">Hex</p>
				</Link>
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
				<button
					type="submit"
					className="w-full bg-primary text-white py-2 rounded-xl"
				>
					Login
				</button>
				<p className="text-black">Don’t have an account? </p>
				<span
					className="text-blue-600 text-center  cursor-pointer"
					onClick={() => dispatch(toggleModalType())}
				>
					Register
				</span>
			</form>
		</Modal>
	);
};
