import { FC } from "react";
import { CheckboxWithLabel } from "@/shared/ui/CheckboxWithLabel";

export interface FilterGroupProps {
	title: string;
	options: { label: string; value: string }[];
}

export const FilterGroup: FC<FilterGroupProps> = ({ title, options }) => (
	<div className="mr-10 gridd">
		<h4 className="mb-3 text-foreground font-semibold text-lg">{title}</h4>
		{options.map((option) => (
			<CheckboxWithLabel
				key={`${title}-${option.value}`}
				title={title}
				label={option.label}
			/>
		))}
	</div>
);
