"use client";

import { selectUser } from "@/entities/user/model/slice";
import { logoutThunk } from "@/features/auth/model/slice";
import { Btn } from "@/shared/ui/Button/Btn";
import { useAppDispatch, useAppSelector } from "@/store";
import React, { useState } from "react";

export const Profile = () => {
	const user = useAppSelector(selectUser);
	const [activeTab, setActiveTab] = useState<"favorites" | "settings">(
		"favorites"
	);
	const dispatch = useAppDispatch();
	console.log(user.favorites);

	return (
		<div className="pt-20 pb-100 min-h-200">
			<h3 className="self-stretch mb-10 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-white">
				My profile
			</h3>

			<div className="flex gap-8 relative mb-8 ">
				<button
					onClick={() => setActiveTab("favorites")}
					className="relative group cursor-pointer"
				>
					<svg
						width={18}
						height={18}
						fill="white"
						className="absolute top-2 transition-transform duration-300 group-hover:-translate-x-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#like`} />
					</svg>
					<p className="pl-6 text-2xl text-left text-white">
						Favorite movies
					</p>
				</button>

				<button
					onClick={() => setActiveTab("settings")}
					className="relative group cursor-pointer"
				>
					<svg
						fill="white"
						width={25}
						height={25}
						className="absolute top-1 transition-transform duration-300 group-hover:-translate-x-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#user`} />
					</svg>
					<p className="pl-7 text-2xl text-left text-white">
						Account settings
					</p>
				</button>
			</div>

			{activeTab === "favorites" && (
				<div className="text-white">
					<h4 className="text-xl mb-4">Your Favorites:</h4>
					<ul className="list-disc pl-6">
						{user.favorites?.length ? (
							user.favorites.map((movie, i) => (
								<li key={i} className="mb-2">
									{movie}
								</li>
							))
						) : (
							<p>No favorite movies found.</p>
						)}
					</ul>
				</div>
			)}

			{activeTab === "settings" && (
				<div className="text-white">
					<p className="flex-grow-0 flex-shrink-0 text-lg text-left text-white">
						<strong>Full name:</strong>
					</p>
					<p className="flex-grow-0 flex-shrink-0 text-2xl font-bold text-left text-white mb-8">
						{user.name} {user.surname}
					</p>
					<p className="flex-grow-0 flex-shrink-0 text-lg text-left text-white mb">
						<strong>Email:</strong>
					</p>
					<p className="flex-grow-0 flex-shrink-0 text-2xl font-bold text-left text-white mb-15">
						{user.email}
					</p>
					<Btn
						style="primary"
						onclick={() => dispatch(logoutThunk())}
					>
						Logout
					</Btn>
				</div>
			)}
		</div>
	);
};

export default Profile;
