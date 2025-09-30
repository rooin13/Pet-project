"use client";

import React from "react";
import { SortOption } from "@/features/filtration/model/types";

interface Props {
	sortBy: SortOption;
	setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
}

export function SortSelect({ sortBy, setSortBy }: Props) {
	return (
		<select
			value={sortBy}
			onChange={(e) => setSortBy(e.target.value as SortOption)}
			className="
			m-0
				outline-primary outline-3 bg-white text-black font-semibold 
				rounded-md focus:outline-none focus:ring-2 focus:ring-primary
				w-full sm:w-auto
				text-sm py-2 px-3 sm:text-md sm:py-3 sm:px-4
				whitespace-normal
			"
		>
			<option value="popular">Best Sellers</option>
			<option value="price-asc">By price: low to high</option>
			<option value="price-desc">By price: high to low</option>
		</select>
	);
}
