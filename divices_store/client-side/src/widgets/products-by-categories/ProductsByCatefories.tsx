"use client";
import Link from "next/link";
import ProductsList from "@/widgets/products-list/ProductsList";
import Button from "@/shared/ui/button/Button";
import {
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/sheet";
import { Sheet } from "@/shared/ui/sheet";
import { Filtration } from "@/features/filtration/ui/Filtration";
import { capitalizeFirstLetter } from "@/shared/lib/utils/capitalizeFirstLetter";
import { FilterOption } from "@/features/filtration/model/types";
import { FilterGroupProps } from "@/features/filtration/ui/FilterGroup";

interface Props {
	currentCategory: string;
	initialFilters: FilterGroupProps[];
}

export const ProductsByCatefories = ({
	currentCategory,
	initialFilters,
}: Props) => {
	return (
		<>
			<div className="page-wrapper p-8 relative min-h-300 bg-debug">
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
				<div className="mb-20">
					<Sheet>
						<SheetTrigger asChild>
							<Button classname="text-black">All filtres</Button>
						</SheetTrigger>

						<SheetContent
							className="scroll-auto w-150! overflow-y-auto data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left py-6 px-8 text-black bg-white border-black "
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
					slug={currentCategory.toLowerCase()}
				></ProductsList>
			</div>
		</>
	);
};
