"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUserThunk } from "@/features/auth/model/slice";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegistrationForm";

import { getUserProfileThunk, selectUser } from "@/entities/user/model/slice";
import Link from "next/link";
import useAuth from "@/shared/lib/hooks/useAuth";

export const AuthBtn = () => {
	const dispatch = useAppDispatch();
	const { isAuth } = useAuth();
	const user = useAppSelector(selectUser);

	const [isOpen, setIsOpen] = useState(false);
	const [isRegister, setIsRegister] = useState(false);

	useEffect(() => {}, [dispatch]);

	const openForm = () => setIsOpen(true);
	const closeForm = () => setIsOpen(false);
	const toggleForm = () => setIsRegister((prev) => !prev);

	return (
		<>
			{isAuth ? (
				<p className=" text-white py-2 px-4 rounded cursor-pointer">
					<Link href={"/profile"}>{user.email}</Link>
				</p>
			) : (
				<button
					onClick={() => {
						setIsRegister(false);
						openForm();
					}}
					className=" text-white py-2 px-4 rounded w-40 cursor-pointer"
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
