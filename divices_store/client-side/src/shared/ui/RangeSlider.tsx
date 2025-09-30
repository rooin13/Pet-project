"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/shared/lib/utils/cn";

interface RangeSliderProps {
	value: [number, number];
	onChange: (val: [number, number]) => void;
	min?: number;
	max?: number;
	step?: number;
}

export const RangeSlider = ({
	value,
	onChange,
	min = 0,
	max = 1000,
	step = 10,
}: RangeSliderProps) => {
	return (
		<div className="flex flex-col items-start w-full">
			{/* Фиксированные метки на краях */}
			<div className="flex justify-between w-[250px] sm:w-full text-sm mb-2 text-muted-foreground">
				<span>{value[0]} $</span>
				<span>{value[1]} $</span>
			</div>

			<Slider.Root
				className={cn(
					"relative flex items-center select-none touch-none h-5",
					"w-full sm:w-full" // ширина слайдера на мобильных
				)}
				value={value}
				onValueChange={onChange}
				min={min}
				max={max}
				step={step}
				minStepsBetweenThumbs={1}
			>
				<Slider.Track className="bg-muted relative grow rounded-full h-1">
					<Slider.Range className="absolute bg-primary rounded-full h-full" />
				</Slider.Track>
				<Slider.Thumb className="block w-4 h-4 bg-white border border-primary rounded-full shadow" />
				<Slider.Thumb className="block w-4 h-4 bg-white border border-primary rounded-full shadow" />
			</Slider.Root>
		</div>
	);
};
