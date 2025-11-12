"use client";

import Image from "next/image";
import { User } from "../model";

interface UserAvatarProps {
	user: User;
	size?: "sm" | "md" | "lg";
}

const sizes = {
	sm: 32,
	md: 40,
	lg: 64,
};

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
	const pixelSize = sizes[size];

	return (
		<div
			className="relative rounded-full overflow-hidden bg-gray-700 flex items-center justify-center shrink-0"
			style={{ width: pixelSize, height: pixelSize }}
		>
			{user.avatarUrl ? (
				<Image
					src={user.avatarUrl}
					alt={user.name || user.email}
					fill
					className="object-cover"
					sizes={`${pixelSize}px`}
				/>
			) : (
				<span className="text-white font-medium uppercase">
					{user.name?.[0] || user.email[0]}
				</span>
			)}
		</div>
	);
}
