import React, { FC } from "react";
import { FaSearch } from "react-icons/fa";

const SearchIcon: FC = () => {
	return (
		<div className="text-black relative text-xl font-semibold cursor-pointer group">
			<FaSearch
				fill="gray"
				size={16}
				className="absolute right-3 top-2"
			/>

			<div className="w-full min-w-50 pt-4 pb-4 md:pt-5 md:pb-5 text-black border-primary border-1 bg-secondery p-2.5 pl-10 placeholder:text-shadow-white rounded-xl bg-secondary  focus:outline-none focus:ring-2 focus:ring-blue-500" />
		</div>
	);
};

export default SearchIcon;
