// shared/ui/checkbox-with-label.tsx
"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleOption } from "@/features/filtration/model/slice";
import { Checkbox, Label } from "@/shared/ui";

interface Props {
	title: string; // Название группы фильтра, например "Brand"
	label: string; // Опция фильтра, например "Razer"
	classtitle?: string; // Дополнительный класс для заголовка (необязательно)
}

export const CheckboxWithLabel: React.FC<Props> = ({
	title,
	label,
	classtitle,
}) => {
	const dispatch = useAppDispatch();
	const selectedOptions = useAppSelector(
		(state) => state.filters.selectedOptions
	);

	

	console.log("Current selectedOptions from Redux:", selectedOptions);
	const selectedValues = selectedOptions[title] ?? [];

	const id = `checkbox-${title}-${label}`;

	const checked = selectedValues.includes(label);

	const onChangeHandler = (
		checked: boolean | "indeterminate" | undefined
	) => {
		// Важно: onCheckedChange из некоторых UI-библиотек может отдавать разные типы,
		// поэтому проверяем на true/false строго
		if (checked === true || checked === false) {
			dispatch(toggleOption({ field: title, value: label }));
		}
	};

	return (
		<div className="text-gray-500 flex items-start gap-3 mb-2">
			<Checkbox
				id={id}
				value={label}
				checked={checked}
				onCheckedChange={onChangeHandler}
				name={title}
			/>
			<Label htmlFor={id} className="text-base">
				{label}
			</Label>
		</div>
	);
};
