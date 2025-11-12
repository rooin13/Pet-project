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
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

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

	const breadcrumbs = [
		{ label: "Home", href: "/" },
		{ label: "Shop", href: "/shop" },
		{ label: currentCategory.toUpperCase() },
	];

	return (
		<>
			<div className="page-wrapper md:p-8 pt-4 mr-3 relative min-h-300">
				<div className="mb-4 flex justify-between items-center">
					<Breadcrumbs items={breadcrumbs} />
					<div className="hidden md:block">
						<SortSelect sortBy={sortBy} setSortBy={setSortBy} />
					</div>
				</div>

				<div className="mb-8 flex justify-between items-center md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button classname="text-black mr-4 whitespace-nowrap font-semibold text-sm w-[200px] h-[48px]">
								All filters
							</Button>
						</SheetTrigger>
						<SheetContent
							className="scroll-aut w-80! sm:px-6 overflow-y-auto data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left py-6 px-8 text-black bg-white border-black"
							side="left"
						>
							<Filtration
								filterGroups={initialFilters}
								isLoading={false}
							/>
							<SheetDescription></SheetDescription>
						</SheetContent>
					</Sheet>
					<SortSelect sortBy={sortBy} setSortBy={setSortBy} />
				</div>

				<div className="flex gap-2">
					<div className="hidden md:block w-1/5">
						<Filtration
							filterGroups={initialFilters}
							isLoading={false}
						/>
					</div>

					<div className="flex-1">
						<ProductsList
							sortBy={sortBy}
							slug={currentCategory.toLowerCase()}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
