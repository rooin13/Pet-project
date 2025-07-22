"use client";

import { motion, AnimatePresence } from "framer-motion";
import { itemVariants } from "@/shared/lib/animations/animation";
import { usePaginatedProducst } from "./model/usePaginatedProducts"; // 💡 путь к хуку
import ProductItem from "@/entities/product/ui/ProductItem";
import Loading from "@/app/(public)/shop/c/[slug]/loading";
import { Skeleton } from "@/shared/ui";

interface Props {
	slug: string;
}

export default function ProductsList({ slug }: Props) {
	const { products, isLoading, hasMore, observerRef, lastBatchStart } =
		usePaginatedProducst(slug);

	return (
		<>
			<motion.ul
				className="grid gap-8 relative
                             grid-cols-1 
                             sm:grid-cols-2 
                             md:grid-cols-3 
                             lg:grid-cols-4 
                             mb-10"
			>
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

			{isLoading && (
				<div
					className="grid gap-8
                  grid-cols-1 
                  sm:grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-4 
                  mb-10"
				>
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
