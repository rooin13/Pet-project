"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSearch } from "../model/hooks";
import { useProductSearch } from "../model/hooks/useProductSearch";
import useFocus from "@/shared/lib/hooks/useFocus";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { PAGES } from "@/shared/lib/config/pages.config";

interface SearchProps {
	closeSheet?: () => void;
	focus?: () => void;
}

export const Search: React.FC<SearchProps> = ({ closeSheet }) => {
	const { updateQuery, query } = useSearch();
	const { filteredProducts, handleSearch } = useProductSearch();
	const { ref, isFocused, onFocus, onBlur } = useFocus();
	const pathname = usePathname();
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		updateQuery(e.target.value);
		await handleSearch(e);
	};

	const showList = filteredProducts.length > 0 && query !== "" && isFocused;

	return (
		<div
			className="max-w-200 relative  bg-white rounded-xl min-w-80 lg:min-w-200 outline-black	 outline-1 "
			ref={ref}
			role="search"
		>
			<div className="text-black text-xl font-semibold w-full cursor-pointer group rounded-xl relative">
				<FaSearch
					fill="gray"
					size={16}
					className="absolute right-3 top-4 pointer-events-none"
					aria-hidden="true"
				/>

				<input
					ref={inputRef}
					onFocus={onFocus}
					onBlur={onBlur}
					type="search"
					placeholder="Search products..."
					onChange={handleChange}
					className="w-full text-black font-light bg-secondary p-2.5 pl-4 placeholder:text-shadow-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-label="Search for products"
					aria-autocomplete="list"
					aria-controls="search-results"
					aria-expanded={showList}
				/>
			</div>
			<ul
				ref={listRef}
				id="search-results"
				role="listbox"
				aria-label="Search results"
				className={
					showList
						? "bg-secondary text-black absolute top-20 w-full z-10 rounded-xl overflow-hidden"
						: "hidden z-0"
				}
			>
				{showList &&
					filteredProducts
						.flat()
						.sort((a, b) => b.name.localeCompare(a.name))
						.map((product, index) => (
							<li
								key={product.id}
								role="option"
								aria-posinset={index + 1}
								aria-setsize={filteredProducts.length}
							>
								<Link
									onClick={() => closeSheet && closeSheet()}
									href={PAGES.PRODUCT(product)}
									className="hover:bg-primary/20 transition-colors duration-150 rounded-xl flex bg-secondary pl-2 pb-2 pt-2 w-full"
									aria-label={`View ${product.name}`}
								>
									<Image
										alt={`${product.name} thumbnail`}
										className="mr-3 rounded-xl"
										width={35}
										height={35}
										src={
											Array.isArray(product.imagesUrl) &&
											product.imagesUrl.length > 0 &&
											typeof product.imagesUrl[0] ===
												"string"
												? product.imagesUrl[0]
												: "/placeholder.png"
										}
									/>
									<div className="flex flex-col flex-wrap rounded-xl bg-secondary">
										<p className="text-base font-bold">
											{product.name}
										</p>
									</div>
								</Link>
							</li>
						))}
			</ul>
		</div>
	);
};
