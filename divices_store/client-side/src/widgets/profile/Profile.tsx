"use client";

import { useAuthUser, useLogout } from "@/features/auth/model/hooks";
import Button from "@/shared/ui/button/Button";
import React, { useState } from "react";

const Profile = () => {
	const logoutMutation = useLogout();
	const { data: user, isPending, error } = useAuthUser();
	const [activeTab, setActiveTab] = useState<"favorites" | "settings">(
		"favorites"
	);

	const handleLogout = async () => {
		await logoutMutation.mutate();
	};

	return (
		<div className="pt-20 pb-100 min-h-200">
			<h3 className="self-stretch mb-10 text-2xl sm:text-2xl md:text-4xl font-bold text-left text-black">
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
					<p className="pl-6 text-2xl text-left text-black">
						Favorites
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
					<p className="pl-7 text-2xl text-left text-black">
						Account settings
					</p>
				</button>
			</div>

			{user ? (
				<div>
					{activeTab === "favorites" && (
						<div className="text-black">
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
						<div className="text-black">
							<p className="flex-grow-0 flex-shrink-0 text-lg text-left text-black">
								<strong>Full name:</strong>
							</p>
							<p className="flex-grow-0 flex-shrink-0 text-2xl font-bold text-left text-black mb-8">
								{user.fullName}
							</p>
							<p className="flex-grow-0 flex-shrink-0 text-lg text-left text-black mb">
								<strong>Email:</strong>
							</p>
							<p className="flex-grow-0 flex-shrink-0 text-2xl font-bold text-left text-black mb-15">
								{user.email}
							</p>
							<Button
								type="primary"
								onClick={() => handleLogout()}
							>
								Logout
							</Button>
						</div>
					)}
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default Profile;
