"use client";

import { motion, AnimatePresence } from "framer-motion";
import { itemVariants } from "@/shared/lib/animations/animation";
import { usePaginatedProducts } from "./model/usePaginatedProducts";
import ProductItem from "@/entities/product/ui/ProductItem";
import { Skeleton } from "@/shared/ui";
import { useAppSelector } from "@/store";
import { useFiltersFromUrl } from "@/features/filtration/model/hooks/useFiltersFromUrl";
import { useWatchFilters } from "@/features/filtration/model/hooks/useWatchFilters";

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
						<article
							key={i}
							className="bg-secondary rounded-2xl w-full h-90 overflow-hidden flex flex-col"
						>
							{/* Скелетон изображения */}
							<div className="relative overflow-hidden items-center mb-1 flex-1">
								<Skeleton className="h-full w-full rounded-xl" />
							</div>
							{/* Скелетон контента */}
							<div className="pb-4 px-4 flex flex-col items-start space-y-3">
								{/* Название товара */}
								<Skeleton className="h-6 w-4/5 rounded" />
								{/* Описание товара */}
								<div className="space-y-2 w-full">
									<Skeleton className="h-3 w-full rounded" />
									<Skeleton className="h-3 w-3/4 rounded" />
									<Skeleton className="h-3 w-1/2 rounded" />
								</div>
								{/* Цена */}
								<div className="flex items-center justify-between w-full mt-2">
									<Skeleton className="h-5 w-20 rounded" />
									<Skeleton className="h-4 w-16 rounded" />
								</div>
							</div>
						</article>
					))}
				</div>
			)}

			<div ref={observerRef} className="h-10 z-40 absolute bottom-170" />
			{!hasMore && <p>No more products</p>}
		</>
	);
}
