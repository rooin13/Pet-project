"use client";

import { useAddItemMutation } from "@/shared/lib/api/cart/cartApi";
import Button from "@/shared/ui/button/Button";
import { Product, Variation } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { CartPopover } from "./CartPopover"; // путь к твоему Popover
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Truck, Percent, ShoppingCart } from "lucide-react";

type ProductWithVariations = Product & { variations: Variation[] };

export const ProductDetails = (product: ProductWithVariations) => {
	const [selectedVariation, setSelectedVariation] =
		useState<Variation | null>(product.variations[0] ?? null);
	const [imageLoaded, setImageLoaded] = useState(false);

	const [addItem] = useAddItemMutation();

	const handleAddToCart = async () => {
		if (!selectedVariation) return;

		try {
			const result = await addItem({
				variationId: selectedVariation.id,
				quantity: 1,
				// Передаем данные для оптимистичного UI
				optimisticData: {
					variation: selectedVariation,
					product: product,
				},
			}).unwrap();

			console.log("✅ Added to cart:", result);
			// Popover автоматически покажет актуальное содержимое через useGetCartQuery
		} catch (error) {
			console.error("❌ Failed to add:", error);
		}
	};

	return (
		<div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12 py-6 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
			{/* BREADCRUMBS */}
			<div className="lg:col-span-12">
				{(() => {
					const categoryName =
						(product as any)?.category?.name ||
						(product as any)?.categoryName;
					const categorySlug =
						(product as any)?.category?.slug ||
						(product as any)?.categorySlug ||
						(categoryName
							? String(categoryName).toLowerCase()
							: undefined);
					const crumbs = [
						{ label: "Home", href: "/" },
						{ label: "Shop", href: "/shop" },
					] as { label: string; href?: string }[];
					if (categoryName)
						crumbs.push({
							label: categoryName,
							href: categorySlug
								? `/shop/c/${categorySlug}`
								: undefined,
						});
					crumbs.push({ label: product.name });
					return <Breadcrumbs items={crumbs} />;
				})()}
			</div>

			{/* LEFT SIDE */}
			<div className="lg:col-span-7 flex flex-col gap-5 lg:gap-8">
				<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black">
					{product.name}
				</h1>

				<div className="grid grid-cols-2 gap-5">
					{/* Верхний левый квадрат с изображением */}
					<div className="bg-white rounded-2xl p-2 shadow-md relative">
						{!imageLoaded && (
							<div className="absolute inset-0 rounded-xl bg-secondary/30 animate-pulse" />
						)}
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
								width={800}
								height={800}
								className="rounded-xl w-full h-full aspect-square object-contain"
								onLoadingComplete={() => setImageLoaded(true)}
							/>
						)}
					</div>
					{/* Остальные три пустых квадрата */}
					<div className="bg-white rounded-2xl p-2 shadow-sm">
						<div className="rounded-xl w-full h-full aspect-square bg-secondary/20" />
					</div>
					<div className="bg-white rounded-2xl p-2 shadow-sm">
						<div className="rounded-xl w-full h-full aspect-square bg-secondary/20" />
					</div>
					<div className="bg-white rounded-2xl p-2 shadow-sm">
						<div className="rounded-xl w-full h-full aspect-square bg-secondary/20" />
					</div>
				</div>

				{/* Описание товара под картинками */}
				{product.description && (
					<div className="bg-white rounded-2xl p-6 shadow-md">
						<h2 className="text-xl font-semibold text-black mb-4">
							Description
						</h2>
						<p className="text-black/70 font-light text-sm sm:text-base leading-relaxed">
							{product.description}
						</p>
					</div>
				)}
			</div>

			{/* RIGHT SIDE */}
			<div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-8 sm:gap-10">
				<div className="bg-white p-6 sm:p-7 lg:p-9 rounded-2xl space-y-6 sm:space-y-8 shadow-lg">
					<div className="flex items-baseline justify-between">
						<p className="text-2xl sm:text-3xl font-light text-black">
							${product.price}
						</p>
						<span className="text-xs px-2 py-1 rounded-full bg-secondary text-black">
							In stock
						</span>
					</div>

					{product.variations.length > 0 && (
						<div className="border-b border-gray-300 pb-6 mb-6">
							<p className="mb-3 text-lg sm:text-xl font-light text-black">
								Select option
							</p>
							<div className="flex flex-wrap gap-2 sm:gap-3">
								{product.variations.map((variation) => {
									const isSelected =
										selectedVariation?.id === variation.id;

									let bgClass = "bg-white text-black"; // default
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
												"ring-2 ring-gray-400";
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
											className={`px-3 sm:px-4 py-1 sm:py-2 rounded-xl border cursor-pointer text-xs sm:text-sm transition-colors duration-200 ${bgClass} ${borderClass} ${outlineClass} hover:border-gray-500`}
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
								type="primary"
								onClick={handleAddToCart}
								disabled={!selectedVariation}
							>
								ADD TO CART
							</Button>
						}
					/>

					<div className="space-y-4">
						<div className="rounded-lg border border-black/10 p-3 text-sm text-black/80 flex items-center gap-2 shadow-sm">
							<Truck className="size-8" />
							<span>
								Get it by Wed — Free standard shipping on orders
								over $39
							</span>
						</div>
						<div className="rounded-lg border border-black/10 p-3 text-sm text-black/80 flex items-center gap-2 shadow-sm">
							<Percent className="size-8" />
							<span>
								Save 30% on Premium Keyboards when you buy MX
								Master 4
							</span>
						</div>
						<div className="rounded-lg border border-black/10 p-3 text-sm text-black/80 flex items-center gap-2 shadow-sm">
							<ShoppingCart className="size-8" />
							<span>
								Save 30% on select Mice with Signature Slim
								Series
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
