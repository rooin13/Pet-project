import React, { FC } from "react";
import { FaSearch } from "react-icons/fa";

const SearchIcon: FC = () => {
	return (
		<div className="text-black text-xl font-semibold cursor-pointer group">
			<FaSearch
				fill="gray"
				size={16}
				className="absolute right-3 top-3"
			/>

			<div className="w-full min-w-50 pt-5 pb-6 text-black bg-secondery p-2.5 pl-10 placeholder:text-shadow-white rounded-xl bg-secondary  focus:outline-none focus:ring-2 focus:ring-blue-500" />
		</div>
	);
};

export default SearchIcon;
