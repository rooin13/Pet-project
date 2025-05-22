"use client";
import { registerThunk } from "@/features/auth/model/slice";
import { Modal } from "@/features/modal/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/model/shema";
import { useAppDispatch } from "@/store/index";
import { RegisterDataType } from "@/features/auth/model/types";

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
		formState: { errors },
	} = useForm<RegisterDataType>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data: RegisterDataType) => {
		dispatch(registerThunk(data));
		onClose();
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<h2 className=" text-xl font-semibold">Register</h2>
				<input
					type="text"
					{...register("name")}
					required
					placeholder="First name"
					className="border p-2 w-full"
				/>
				{errors.name && (
					<p className="text-red-500 text-sm">
						{errors.name.message}
					</p>
				)}
				<input
					{...register("surname")}
					type="text"
					required
					placeholder="Last name"
					className="border p-2 w-full"
				/>
				{errors.surname && (
					<p className="text-red-500 text-sm">
						{errors.surname.message}
					</p>
				)}

				<input
					{...register("email")}
					type="email"
					required
					placeholder="Email"
					className="border p-2 w-full"
				/>
				{errors.email && (
					<p className="text-red-500 text-sm">
						{errors.email.message}
					</p>
				)}
				<input
					{...register("password")}
					type="password"
					required
					placeholder="Password"
					className="border p-2 w-full"
				/>
				{errors.password && (
					<p className="text-red-500 text-sm">
						{errors.password.message}
					</p>
				)}
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded"
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
