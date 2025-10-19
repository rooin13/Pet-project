import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { Product, Variation } from "@prisma/client";
import { getProductImages } from "@/shared/lib/utils/productUtils";
import { PAGES } from "@/shared/lib/config/pages.config";
import { useProductHover } from "../model/hooks/useProductHover";
import { formatPriceSimple } from "@/shared/lib/utils/formatters";

type ProductWithVariations = Product & {
	variations: Variation[];
};

const ProductItem: React.FC<ProductWithVariations> = (product) => {
	const imageRef = useRef<HTMLImageElement>(null);
	const { isHovered, handleMouseEnter, handleMouseLeave } = useProductHover();

	return (
		<article
			className="bg-secondary rounded-2xl w-full h-90 overflow-hidden flex flex-col"
			aria-label={`${product.name} - $${product.price.toFixed(0)}.99`}
		>
			<div className="relative overflow-hidden items-center mb-1 flex-1">
				<Link
					href={PAGES.PRODUCT(product)}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					aria-label={`View details for ${product.name}`}
				>
					<div className="overflow-hidden h-full">
						<Image
							ref={imageRef}
							src={getProductImages(product)[0].url}
							alt={`${product.name} - ${
								getProductImages(product)[0].alt
							}`}
							width={500}
							height={500}
							className={`transition-transform w-full h-full object-contain duration-700 ease-in-out ${
								isHovered ? "scale-105" : ""
							}`}
						/>
					</div>
				</Link>
			</div>
			{/* Описание товара под картинками */}
			<div className="px-4 py-2">
				<p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
					{product.description}
				</p>
			</div>

			<div className="pb-4 px-4 flex flex-col items-start">
				<h3 className="font-base text-1xl text-black mb-2">
					{product.name}
				</h3>
				<div className="flex items-center justify-between w-full">
					<p
						className="text-black font-thin"
						aria-label={`Price: ${formatPriceSimple(
							product.price
						)}`}
					>
						{formatPriceSimple(product.price)}
					</p>
				</div>
			</div>
		</article>
	);
};

export default ProductItem;
