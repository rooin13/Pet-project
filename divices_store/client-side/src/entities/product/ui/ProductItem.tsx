import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@prisma/client";
import { getProductImages } from "@/shared/lib/utils/productUtils";
import { PAGES } from "@/shared/lib/config/pages.config";

const ProductItem: React.FC<Product> = (product) => {
	const imageRef = useRef<HTMLImageElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div className="bg-secondary rounded-2xl  w-full h-90 overflow-hidden flex flex-col ">
			<div className="relative overflow-hidden  items-center  mb-1  ">
				<Link
					href={PAGES.PRODUCT(product)}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="overflow-hidden ">
						<Image
							ref={imageRef}
							src={getProductImages(product)[0].url}
							alt={getProductImages(product)[0].alt}
							width={500}
							height={500}
							className={`transition-transform  w-full duration-700 ease-in-out ${
								isHovered ? "scale-105" : ""
							}`}
						/>
					</div>
				</Link>
			</div>
			<div className="pb-6 px-7 flex flex-col items-start">
				<h3 className="font-base text-1xl text-black mb-3">
					{product.name}
				</h3>
				<p className="mt-2 text-black font-light ">{`$${product.price.toFixed(
					0
				)}.99 `}</p>
			</div>
		</div>
	);
};

export default ProductItem;
