import { loginThunk } from "@/features/auth/model/slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/model/shema";
import { useAppDispatch } from "@/store/index";
import { LoginDataType } from "@/features/auth/model/types";
import { Modal } from "@/features/modal/modal";

export const LoginForm = ({
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
	} = useForm<LoginDataType>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginDataType) => {
		dispatch(loginThunk(data));
		onClose(); // Закрыть форму после логина
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<h2 className="text-xl font-semibold">Login</h2>
				<input
					type="email"
					required
					placeholder="Email"
					className="border p-2 w-full"
					{...register("email")}
				/>
				<input
					type="password"
					required
					placeholder="Password"
					className="border p-2 w-full"
					{...register("password")}
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded"
				>
					Login
				</button>
				<p className="text-sm text-center">
					Don't have an account?{" "}
					<span
						className="text-blue-600 cursor-pointer"
						onClick={onSwitch}
					>
						Register
					</span>
				</p>
			</form>
		</Modal>
	);
};
