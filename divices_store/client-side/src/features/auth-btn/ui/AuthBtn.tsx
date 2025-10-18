"use client";

import { useAppDispatch, useAppSelector } from "@/store/index";
import { useAuthUser } from "@/features/auth/model/hooks";
import { openModal } from "@/features/modal/model/modalSlice";
import Link from "next/link";
import { User } from "lucide-react";

export const AuthBtn = () => {
	const { data: user, isPending } = useAuthUser();
	const dispatch = useAppDispatch();
	const atTop = useAppSelector((state) => state.ui.atTop);

	return (
		<>
			{user ? (
				<Link
					href="/profile"
					className="group"
					aria-label={`Go to profile${
						user.name ? ` (${user.name})` : ""
					}`}
				>
					<User
						size={23}
						className={`${
							atTop ? " text-black" : " text-white"
						} group-hover:opacity-70`}
						aria-hidden="true"
					/>
				</Link>
			) : (
				<button
					className={`${
						atTop ? " text-black" : " text-white"
					}  text- text-xl font-semibold cursor-pointer group`}
					onClick={() => dispatch(openModal("login"))}
					aria-label="Sign in to your account"
				>
					<User
						size={23}
						className="group-hover:opacity-70"
						aria-hidden="true"
					/>
				</button>
			)}
		</>
	);
};
