import { FC } from "react";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { FilterGroup, FilterGroupProps } from "./FilterGroup";

interface FiltrationProps {
	filterGroups: FilterGroupProps[];
	isLoading: boolean;
}

const Filtration: FC<FiltrationProps> = ({ filterGroups, isLoading }) => {
	return (
		<div className="pb-6 px-4 flex flex-col max-w-full">
			<h3 className="mb-6 text-xl font-semibold text-black">Filters</h3>

			{isLoading ? (
				<div className="text-gray-500 text-sm mb-4">
					Loading filters...
				</div>
			) : (
				<>
					<PriceRangeSlider />

					<div className="flex flex-col gap-4 mt-4">
						{filterGroups.map((group) => (
							<FilterGroup key={group.title} {...group} />
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Filtration;
