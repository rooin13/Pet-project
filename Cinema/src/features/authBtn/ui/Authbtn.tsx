import { useState } from "react";
import { useUser, useLogin, useRegister, useLogout } from ".";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegistrationForm";

export const AuthBtn = () => {
	const { data: user, isLoading, error } = useUser();
	const loginMutation = useLogin();
	const registerMutation = useRegister();
	const logoutMutation = useLogout();

	const [isOpen, setIsOpen] = useState(false);
	const [isRegister, setIsRegister] = useState(false);

	const openForm = () => setIsOpen(true);
	const closeForm = () => setIsOpen(false);
	const toggleForm = () => setIsRegister((prev) => !prev);

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			{user ? (
				<p
					className="text-white py-2 px-4 rounded cursor-pointer"
					onClick={() => logoutMutation.mutate()}
				>
					{user.email} (Logout)
				</p>
			) : (
				<button
					onClick={() => {
						setIsRegister(false);
						openForm();
					}}
					className="text-white py-2 px-4 rounded w-40 cursor-pointer"
				>
					Sign Up
				</button>
			)}

			{isOpen &&
				(isRegister ? (
					<RegisterForm
						onSwitch={toggleForm}
						onClose={closeForm}
						onSubmit={registerMutation.mutate}
						error={registerMutation.error}
					/>
				) : (
					<LoginForm
						onSwitch={toggleForm}
						onClose={closeForm}
						onSubmit={loginMutation.mutate}
						error={loginMutation.error}
					/>
				))}
		</>
	);
};
