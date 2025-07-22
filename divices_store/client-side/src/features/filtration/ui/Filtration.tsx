"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Prisma } from "@prisma/client";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { FilterGroup, FilterGroupProps } from "./FilterGroup";

interface FiltrationProps {
	filterGroups: FilterGroupProps[];
	isLoading: boolean;
}

export const Filtration: FC<FiltrationProps> = ({
	filterGroups,
	isLoading,
}) => {
	return (
		<div className="pb-10">
			<h3 className="mb-10 text-2xl">Filters</h3>

			{isLoading ? (
				<div className="text-gray-500 text-sm mb-6">
					Loading filters...
				</div>
			) : (
				<>
					<PriceRangeSlider />
					<div className="grid grid-cols-2 gap-4">
						{filterGroups.map((group) => (
							<FilterGroup
								key={group.title}
								title={group.title}
								options={group.options}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};
