import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import React, { useState, useEffect } from "react";
import "../style/style.css";
import { TProduct } from "@/entities/product/model/type";
import ProductItem from "@/entities/product/ui/productItem";

export type TProductSwiper = {
	count: number; // кол во карточек
	jsonUrl: string; //сылка на базу с данными о продуктах
};

const ProductSwiper: React.FC<TProductSwiper> = ({ count, jsonUrl }) => {
	const [products, setProducts] = useState<TProduct[]>([]);

	useEffect(() => {
		fetch(jsonUrl)
			.then((res) => res.json())
			.then((data) => {
				const limitedProducts = data.slice(0, count);
				setProducts(limitedProducts);
			});
	}, [jsonUrl, count]);

	return (
		<div className="swiper-container">
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				spaceBetween={10}
				slidesPerView={4}
				navigation={{
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				}}
				className="mySwiper"
				onSwiper={(swiper) => console.log(swiper)}
				onSlideChange={() => console.log("slide change")}
			>
				<div className="">
					{products.map((product) => (
						<SwiperSlide key={product.id}>
							<ProductItem {...product} />
						</SwiperSlide>
					))}
				</div>
				<div className="swiper-button-next"></div>
				<div className="swiper-button-prev"></div>
			</Swiper>
		</div>
	);
};

export default ProductSwiper;
