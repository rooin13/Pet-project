"use client";
import Link from "next/link";
import ProductsList from "@/widgets/products-list/ProductsList";
import Button from "@/shared/ui/button/Button";
import {
	SheetContent,
	SheetDescription,
	SheetTrigger,
} from "@/shared/ui/Sheet";
import { Sheet } from "@/shared/ui/Sheet";
import Filtration from "@/features/filtration/ui/Filtration";
import { FilterGroupProps } from "@/features/filtration/ui/FilterGroup";
import { useState } from "react";
import { SortSelect } from "@/shared/ui/SortSelect";

interface Props {
	currentCategory: string;
	initialFilters: FilterGroupProps[];
}

export const ProductsByCategories = ({
	currentCategory,
	initialFilters,
}: Props) => {
	const [sortBy, setSortBy] = useState<
		"price-asc" | "price-desc" | "popular"
	>("popular");

	return (
		<>
			<div className="page-wrapper md:p-8 pt-4 mr-3 relative min-h-300 bg-debug">
				<Link className="group inline-flex" href={"/shop"}>
					<svg
						width={44}
						height={44}
						className="absolute top-8 left-2 transition-transform duration-300 group-hover:-translate-x-2"
					>
						<use xlinkHref={`/images/icons/icons.xml#backarrow`} />
					</svg>
					<h3 className="pl-5 text-black self-stretch mb-10 flex-grow-0 flex-shrink-0 text-2xl sm:text-2xl md:text-4xl font-bold text-left">
						{currentCategory.toLocaleUpperCase()}
					</h3>
				</Link>
				<div className="mb-20 flex justify-between">
					<Sheet>
						<SheetTrigger asChild>
							<Button classname="text-black mr-4 md:mr-30">
								All filtres
							</Button>
						</SheetTrigger>
						<SortSelect
							sortBy={sortBy}
							setSortBy={setSortBy}
						></SortSelect>

						<SheetContent
							className="scroll-aut w-80! md:w-150!  sm:px-6 overflow-y-auto data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left py-6 px-8 text-black bg-white border-black "
							side="left"
						>
							<Filtration
								filterGroups={initialFilters}
								isLoading={false}
							/>

							<SheetDescription></SheetDescription>
						</SheetContent>
					</Sheet>
				</div>

				<ProductsList
					sortBy={sortBy}
					slug={currentCategory.toLowerCase()}
				></ProductsList>
			</div>
		</>
	);
};
