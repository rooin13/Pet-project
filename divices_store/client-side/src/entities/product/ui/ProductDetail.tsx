"use client";

import { useAddItemMutation } from "@/shared/lib/api/cart/cartApi";
import Button from "@/shared/ui/button/Button";
import { Product, Variation } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { CartPopover } from "./cartPopover"; // путь к твоему Popover

type ProductWithVariations = Product & { variations: Variation[] };

export const ProductDetails = (product: ProductWithVariations) => {
	const [selectedVariation, setSelectedVariation] =
		useState<Variation | null>(product.variations[0] ?? null);
	const [addItem] = useAddItemMutation();

	const handleAddToCart = async () => {
		if (!selectedVariation) return;

		try {
			const result = await addItem({
				variationId: selectedVariation.id,
				quantity: 1,
			}).unwrap();

			console.log("✅ Added to cart:", result);
			// Popover автоматически покажет актуальное содержимое через useGetCartQuery
		} catch (error) {
			console.error("❌ Failed to add:", error);
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-10 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 pt-16 lg:pt-20">
			{/* LEFT SIDE */}
			<div className="lg:col-span-2 flex flex-col space-y-4 lg:space-y-6">
				<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-8">
					{product.name}
				</h2>
				<p className="text-gray-500 font-light text-sm sm:text-base max-w-full sm:max-w-3xl mt-1 sm:mt-2">
					{product.description}
				</p>
				<div className="relative w-3/4 md:w-2/4 ">
					{product.imagesUrl && (
						<Image
							src={
								Array.isArray(product.imagesUrl) &&
								product.imagesUrl.length > 0 &&
								typeof product.imagesUrl[0] === "string"
									? product.imagesUrl[0]
									: "/placeholder.png"
							}
							alt={product.name}
							width={1000}
							height={1000}
							className="rounded-xl w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain"
						/>
					)}
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8">
				<div className="bg-white p-4 sm:p-6 lg:p-8 pt-0 rounded-2xl space-y-4 sm:space-y-6">
					<p className="text-2xl sm:text-3xl mb-4 sm:mb-8 font-light text-gray-600">
						${product.price}
					</p>

					{product.variations.length > 0 && (
						<div className="border-b border-gray-400 pb-6 mb-6 sm:pb-8 sm:mb-8">
							<p className="mb-2 sm:mb-4 text-lg sm:text-xl font-light text-black">
								Select option
							</p>
							<div className="flex flex-wrap gap-2 sm:gap-3">
								{product.variations.map((variation) => {
									const isSelected =
										selectedVariation?.id === variation.id;

									let bgClass = "bg-white text-black"; // по умолчанию
									let borderClass = "border-gray-300";
									let outlineClass = "";

									if (isSelected) {
										if (
											variation.color.toLowerCase() ===
											"black"
										) {
											bgClass = "bg-black text-white";
										} else if (
											variation.color.toLowerCase() ===
											"white"
										) {
											bgClass = "bg-white text-black";
											outlineClass =
												"ring-2 ring-gray-400"; // добавляем видимый outline для белого
										} else {
											bgClass = `bg-[${variation.color.toLowerCase()}] text-white`;
										}
										borderClass = "border-transparent";
									}

									return (
										<div
											key={variation.id}
											onClick={() =>
												setSelectedVariation(variation)
											}
											className={`
   	       px-3 sm:px-4 py-1 sm:py-2 rounded-xl border cursor-pointer
          text-xs sm:text-sm transition-colors duration-200
          ${bgClass} ${borderClass} ${outlineClass}
          hover:border-gray-500
        `}
										>
											{variation.color}{" "}
											{variation.size &&
												`- ${variation.size}`}
										</div>
									);
								})}
							</div>
						</div>
					)}

					<CartPopover
						trigger={
							<Button
								type="outline"
								onClick={handleAddToCart}
								disabled={!selectedVariation}
							>
								Add to Cart
							</Button>
						}
					/>
				</div>
			</div>
		</div>
	);
};
