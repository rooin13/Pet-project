"use client";

import { motion, AnimatePresence } from "framer-motion";
import { itemVariants } from "@/shared/lib/animations/animation";
import { usePaginatedProducts } from "./model/usePaginatedProducts";
import ProductItem from "@/entities/product/ui/ProductItem";
import { Skeleton } from "@/shared/ui";
import { useAppSelector } from "@/store";
import { useWatchFilters } from "@/features/filtration/model/hooks/useWatchFilters";
import { useFiltersFromUrl } from "@/features/filtration/model/hooks/useFiltersFromUrl";

interface Props {
	slug: string;
	sortBy: "price-asc" | "price-desc" | "popular"; // 🆕 добавили сортировку
}

export default function ProductsList({ slug, sortBy }: Props) {
	useFiltersFromUrl(); // Подтягиваем фильтры из URL
	useWatchFilters(); // Слушаем изменения фильтров

	const filters = useAppSelector((state) => state.filters.selectedOptions);
	const priceRange = useAppSelector((state) => state.filters.priceRange);
	const initialized = useAppSelector((state) => state.filters.initialized);
	const {
		products,
		isLoading,
		isError,
		hasMore,
		observerRef,
		lastBatchStart,
	} = usePaginatedProducts({
		categorySlug: slug,
		filters,
		sortBy,
		priceRange,
		// 🔹 fetch будет внутри usePaginatedProducts проверять initialized
		initialized,
	});

	return (
		<>
			{/* Список продуктов */}
			<motion.ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10 relative">
				<AnimatePresence>
					{products.map((product, index) => {
						const localIndex =
							index >= lastBatchStart
								? index - lastBatchStart
								: -1;
						const delay = localIndex >= 0 ? localIndex * 0.6 : 0;

						return (
							<motion.li
								key={product.id + product.name + index}
								custom={delay}
								variants={itemVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								<ProductItem {...product} />
							</motion.li>
						);
					})}
				</AnimatePresence>
			</motion.ul>

			{/* Скелетоны при загрузке */}
			{isLoading && (
				<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="space-y-3">
							<Skeleton className="h-[200px] w-full rounded-xl" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					))}
				</div>
			)}

			<div ref={observerRef} className="h-10 z-40 absolute bottom-170" />
			{!hasMore && <p>No more products</p>}
		</>
	);
}
