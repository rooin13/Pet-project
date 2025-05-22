"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
	getUserThunk,
	logoutThunk,
	selectIsAuthenticated,
} from "@/features/auth/model/slice";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegistrationForm";

export const AuthBtn = () => {
	const dispatch = useAppDispatch();
	const isAuth = useAppSelector(selectIsAuthenticated);

	const [isOpen, setIsOpen] = useState(false);
	const [isRegister, setIsRegister] = useState(false);

	useEffect(() => {
		dispatch(getUserThunk());
	}, [dispatch]);

	useEffect(() => {
		if (isAuth) {
			setIsOpen(false);
		}
	}, [isAuth]);

	const openForm = () => setIsOpen(true);
	const closeForm = () => setIsOpen(false);
	const toggleForm = () => setIsRegister((prev) => !prev);

	return (
		<>
			{isAuth ? (
				<button
					onClick={() => dispatch(logoutThunk())}
					className="bg-red-600 text-white py-2 px-4 rounded cursor-pointer"
				>
					Logout
				</button>
			) : (
				<button
					onClick={() => {
						setIsRegister(false);
						openForm();
					}}
					className="bg-blue-600 text-white py-2 px-4 rounded w-40 cursor-pointer"
				>
					Sign Up
				</button>
			)}

			{isOpen &&
				(isRegister ? (
					<RegisterForm onSwitch={toggleForm} onClose={closeForm} />
				) : (
					<LoginForm onSwitch={toggleForm} onClose={closeForm} />
				))}
		</>
	);
};
