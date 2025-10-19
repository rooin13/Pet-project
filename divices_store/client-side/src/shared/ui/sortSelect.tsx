"use client";

import React, { useState } from "react";
import { SortOption } from "@/features/filtration/model/types";

interface Props {
	sortBy: SortOption;
	setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
}

const sortOptions = [
	{ value: "popular" as SortOption, label: "Best Sellers", icon: "★" },
	{
		value: "price-asc" as SortOption,
		label: "By price: low to high",
		icon: "↑",
	},
	{
		value: "price-desc" as SortOption,
		label: "By price: high to low",
		icon: "↓",
	},
];

export function SortSelect({ sortBy, setSortBy }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const selectedOption =
		sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

	const handleSelect = (value: SortOption) => {
		setSortBy(value);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full sm:w-[200px]">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="
					w-full flex items-center justify-between gap-3
					bg-white text-black font-semibold
					rounded-md border-none
					px-4 py-3 h-[48px]
					hover:shadow-md
					focus:outline-none focus:ring-2 focus:ring-primary
					transition-all duration-200
					text-sm sm:text-base
					outline-[#91a5ff] outline-2
				"
				aria-label="Sort products"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span className="flex items-center gap-2">
					<span className="text-lg">{selectedOption.icon}</span>
					<span className="truncate">{selectedOption.label}</span>
				</span>
				<svg
					className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>
					<div
						className="
							absolute right-0 mt-2 w-full
							bg-white rounded-md shadow-xl border-2 border-primary
							overflow-hidden z-20
							animate-in fade-in slide-in-from-top-2 duration-200
						"
						role="listbox"
					>
						{sortOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => handleSelect(option.value)}
								className={`
									w-full flex items-center justify-between px-4 py-3
									text-left text-sm sm:text-base font-semibold
									transition-colors duration-150
									${
										sortBy === option.value
											? "bg-secondary text-black"
											: "text-black hover:bg-secondary"
									}
								`}
								role="option"
								aria-selected={sortBy === option.value}
							>
								<span className="flex items-center gap-2 flex-1">
									<span className="text-lg">
										{option.icon}
									</span>
									<span>{option.label}</span>
								</span>
								{sortBy === option.value && (
									<svg
										className="w-5 h-5 text-primary flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
