import { FC } from "react";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { FilterGroup, FilterGroupProps } from "./FilterGroup";

interface FiltrationProps {
	filterGroups: FilterGroupProps[];
	isLoading: boolean;
}

const Filtration: FC<FiltrationProps> = ({ filterGroups, isLoading }) => {
	return (
		<div className="pb-6 sm:pb-10 px-4 sm:px-6 md:px-8 flex flex-col max-w-full">
			<h3 className="mb-6 sm:mb-10 text-xl sm:text-2xl font-semibold max-w-full">
				Filters
			</h3>

			{isLoading ? (
				<div className="text-gray-500 text-sm mb-4 sm:mb-6">
					Loading filters...
				</div>
			) : (
				<>
					<PriceRangeSlider />

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
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
