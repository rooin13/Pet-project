"use client";

import { useAppDispatch } from "@/store/index";
import { useAuthUser } from "@/features/auth/model/hooks";
import { openModal } from "@/features/modal/model/modalSlice";
import Link from "next/link";
import { User } from "lucide-react";

export const AuthBtn = () => {
	const { data: user, isPending } = useAuthUser();
	const dispatch = useAppDispatch();

	return (
		<>
			{user ? (
				<Link href="/profile" className="group">
					<p className="text-black text-xl font-semibold cursor-pointer">
						<User size={23} className="group-hover:opacity-70" />
					</p>
				</Link>
			) : (
				<button
					onClick={() => dispatch(openModal("login"))}
					className="text-black text-xl font-semibold cursor-pointer group"
				>
					<User size={23} className="group-hover:opacity-70" />
				</button>
			)}
		</>
	);
};
