"use client";

import { useState, useEffect } from "react";
import { useUser, useLogout, useAuthModal } from "../model/supabase-hooks";
import {
	LoginForm,
	RegisterForm,
	UsernameSetupForm,
} from "@/features/auth";
import Link from "next/link";

export const AuthButton = () => {
	const { data: userData, isLoading, refetch } = useUser();
	const logoutMutation = useLogout();
	const [showUsernameSetup, setShowUsernameSetup] = useState(false);

	const { isOpen, isRegister, openLoginForm, closeForm, toggleForm } =
		useAuthModal();

	// Extract user from Supabase response
	const user = userData?.user;
	const profile = userData?.profile;

	// Check if user needs to setup username
	useEffect(() => {
		if (user && profile && !profile.username) {
			setShowUsernameSetup(true);
		}
	}, [user, profile]);

	if (isLoading) {
		return <div className="w-40 h-10 bg-gray-700 animate-pulse rounded" />;
	}

	const fullName = profile?.username || user?.email?.split("@")[0] || "User";
	const displayName =
		fullName.length > 6 ? fullName.substring(0, 6) + "..." : fullName;

	return (
		<>
			{user ? (
				<Link
					href="/profile"
					className="group relative cursor-pointer"
					title={fullName}
				>
					<p className="text-white py-2 px-4">{displayName}</p>
					<span className="absolute left-0 bottom-0 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
				</Link>
			) : (
				<div
					className="group relative cursor-pointer inline-block"
					onClick={openLoginForm}
				>
					<button className="text-white py-2 px-4">Sign Up</button>
					<span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-[80%]"></span>
				</div>
			)}

			{showUsernameSetup && (
				<UsernameSetupForm
					onClose={() => setShowUsernameSetup(false)}
					onSuccess={() => {
						setShowUsernameSetup(false);
						refetch();
					}}
				/>
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
