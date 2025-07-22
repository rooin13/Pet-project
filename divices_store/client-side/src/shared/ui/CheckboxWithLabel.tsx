// shared/ui/checkbox-with-label.tsx
"use client";
import { Checkbox, Label } from "@/shared/ui";
import React from "react";

interface Props {
	title: string;
	label: string;
	classtitle?: string;
}

export const CheckboxWithLabel = ({ title, label, classtitle }: Props) => {
	const id = `checkbox-${title + label}`;
	return (
		<div className="text-gray-500 flex items-start gap-3 mb-2">
			<Checkbox
				key={id}
				onCheckedChange={(checked) =>
					console.log(title + " " + label + " " + checked)
				}
				id={id}
				value={label}
				name={title}
			/>
			<Label htmlFor={id} className="text-base">
				{label}
			</Label>
		</div>
	);
};
