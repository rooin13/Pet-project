"use client";

import { useState, useRef, useEffect } from "react";

type MenuItem = {
	label: string;
	onClick: () => void;
	danger?: boolean;
};

type KebabMenuProps = {
	items: MenuItem[];
};

export const KebabMenu = ({ items }: KebabMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				className="p-1.5 hover:bg-white/10 transition opacity-0 group-hover:opacity-100 rounded-sm"
			>
				<svg
					className="w-5 h-5 text-gray-400"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="5" r="2" />
					<circle cx="12" cy="12" r="2" />
					<circle cx="12" cy="19" r="2" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 shadow-lg z-50 min-w-[160px]">
					{items.map((item, idx) => (
						<button
							key={idx}
							onClick={(e) => {
								e.stopPropagation();
								item.onClick();
								setIsOpen(false);
							}}
							className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition ${
								item.danger ? "text-red-400" : "text-white"
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
