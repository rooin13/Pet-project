import { FC } from "react";
import { CheckboxWithLabel } from "@/shared/ui/CheckboxWithLabel";

export interface FilterGroupProps {
	title: string;
	options: { label: string; value: string }[];
}

export const FilterGroup: FC<FilterGroupProps> = ({ title, options }) => (
	<div className="mb-4 pb-4 border-b border-gray-300 last:border-b-0">
		<h4 className="mb-3 text-black font-semibold text-sm uppercase tracking-wide">
			{title}
		</h4>
		<div className="space-y-2">
			{options.map((option) => (
				<CheckboxWithLabel
					key={`${title}-${option.value}`}
					title={title}
					label={option.label}
				/>
			))}
		</div>
	</div>
);
