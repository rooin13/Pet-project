"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const SliderSection = () => {
	return (
		<section
			className="bg-[#B2C0FF]  text-black text-sm font-light"
			role="banner"
			aria-label="Promotional offers"
		>
			<Swiper
				modules={[Autoplay]}
				autoplay={{
					delay: 8000,
					disableOnInteraction: false,
				}}
				loop={true}
				slidesPerView={1}
				allowTouchMove={false}
				aria-live="polite"
				aria-atomic="true"
			>
				<SwiperSlide
					className="text-center text-1xl  z-0 py-2"
					aria-label="Promotion: Save 20% off 2 or more items"
				>
					Celebrate : Save 20% off 2+ items
				</SwiperSlide>
				<SwiperSlide
					className="text-center text-1xl z-0  py-2"
					aria-label="Free delivery in 3 days"
				>
					Free Delivery in 3 Days
				</SwiperSlide>
				<SwiperSlide
					className="text-center text-1xl z-0 py-2"
					aria-label="Big discount on all products"
				>
					Big Discount on All Products
				</SwiperSlide>
			</Swiper>
		</section>
	);
};

export default SliderSection;
