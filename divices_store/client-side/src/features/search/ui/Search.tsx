"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import { useSearch } from "../model/hooks";
import useFocus from "@/shared/lib/hooks/useFocus";

import { FaSearch } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { Api } from "@/shared/lib/api/common/client";
import { Product } from "@prisma/client";
import { PAGES } from "@/shared/lib/config/pages.config";

interface SearchProps {
	closeSheet?: () => void;
	focus?: () => void;
}

export const Search: React.FC<SearchProps> = ({ closeSheet }) => {
	const { updateQuery, query } = useSearch();
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const { ref, isFocused, onFocus, onBlur } = useFocus();
	const pathname = usePathname();
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		updateQuery(value);
		if (value.trim() === "") {
			setFilteredProducts([]);
			return;
		}
		try {
			const products = await Api.products.search(value);

			setFilteredProducts(
				products
					? Array.isArray(products)
						? products
						: [products]
					: []
			);
		} catch (error) {
			setFilteredProducts([]);
		}
	};

	const showList =
		filteredProducts &&
		filteredProducts.length > 0 &&
		query != "" &&
		isFocused;

	const listRef = useRef<HTMLUListElement>(null);
	const dispatch = useAppDispatch();

	return (
		<div
			className="max-w-200 relative  bg-white rounded-xl min-w-80 lg:min-w-200 outline-black	 outline-1 "
			ref={ref}
		>
			<button className="text-black text-xl font-semibold w-full cursor-pointer group rounded-xl">
				<FaSearch
					fill="gray"
					size={16}
					className="absolute right-3 top-4"
				/>

				<input
					ref={inputRef}
					onFocus={onFocus}
					onBlur={onBlur}
					type="text"
					placeholder="Search "
					onChange={handleChange}
					className="w-full text-black font-light bg-white p-2.5 pl-4 placeholder:text-shadow-white rounded-xl bg-secondary  focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</button>
			<ul
				ref={listRef}
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
						.map((product) => (
							<Link
								onClick={() => closeSheet && closeSheet()}
								key={product.id}
								href={PAGES.PRODUCT(product)}
							>
								<li className="hover:bg-primary/20 transition-colors duration-150 rounded-xl flex bg-secondary pl-2 pb-2 pt-2 w-full">
									<Image
										alt="poster"
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
										<ul>
											<ul className="flex text-foreground items-center space-x-2 text-xs flex-row"></ul>
										</ul>
										<p className="text-base font-bold">
											{product.name}
										</p>
									</div>
								</li>
							</Link>
						))}
			</ul>
		</div>
	);
};
