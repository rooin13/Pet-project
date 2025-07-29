"use client";

import { FC } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { RangeSlider } from "@/shared/ui/RangeSlider";
import { selectPriceRange } from "../model/selectors";
import { setPriceRange } from "../model/slice";

const priceRange = {
	min: 0,
	max: 1000,
};

export const PriceRangeSlider: FC = () => {
	const dispatch = useAppDispatch();
	const value = useAppSelector(selectPriceRange);

	const handleChange = (val: [number, number]) => {
		dispatch(setPriceRange(val));
	};

	return (
		<div className="mb-10">
			<RangeSlider
				value={value}
				onChange={handleChange}
				min={priceRange.min}
				max={priceRange.max}
				step={10}
			/>
		</div>
	);
};
