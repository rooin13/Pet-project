import ProductSwiper from "@/features/product-swiper/ui/ProductSwiper";
import React from "react";

export default function CategoryCarousels() {
	return (
		<section className="bg-white ">
			<div className="mb-16">
				<h2 className="text-text text-4xl text-center mb-6">
					Necklaces
				</h2>

				<ProductSwiper
					count={16}
					jsonUrl="/products.json"
				></ProductSwiper>
			</div>
			<div className="mb-16">
				<h2 className="text-text text-4xl text-center mb-6">
					Rings & Earrings
				</h2>

				<ProductSwiper
					count={16}
					jsonUrl="/products.json"
				></ProductSwiper>
			</div>
			<div className="pb-12">
				<h2 className="text-text text-4xl text-center mb-6">For Him</h2>

				<ProductSwiper
					count={16}
					jsonUrl="/products.json"
				></ProductSwiper>
			</div>
		</section>
	);
}
