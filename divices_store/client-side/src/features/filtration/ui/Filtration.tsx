"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { FilterGroup, FilterGroupProps } from "./FilterGroup";

interface FiltrationProps {
	filterGroups: FilterGroupProps[];
	isLoading: boolean;
}

function buildQueryString(filters: Record<string, string[]>) {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, values]) => {
		values.forEach((v) => {
			if (v) params.append(key, v);
		});
	});
	return params.toString();
}

export const Filtration: FC<FiltrationProps> = ({
	filterGroups,
	isLoading,
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [filters, setFilters] = useState<Record<string, string[]>>({});

	// Считываем фильтры из URL при первой загрузке
	useEffect(() => {
		const obj: Record<string, string[]> = {};
		for (const [key, value] of searchParams.entries()) {
			if (!obj[key]) obj[key] = [];
			obj[key].push(value);
		}
		setFilters(obj);
	}, []);

	const handleCheckboxChange = (
		checked: boolean,
		groupName: string,
		value: string
	) => {
		setFilters((prev) => {
			const prevValues = prev[groupName] || [];
			const newValues = checked
				? [...prevValues, value]
				: prevValues.filter((v) => v !== value);

			const newFilters = {
				...prev,
				[groupName]: newValues,
			};

			const search = buildQueryString(newFilters);
			router.push(`?${search}`); // URL обновляется, что перезапустит SSR

			return newFilters;
		});
	};

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
