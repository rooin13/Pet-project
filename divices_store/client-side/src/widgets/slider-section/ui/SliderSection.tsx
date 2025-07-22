"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const SliderSection = () => {
	return (
		<section className="bg-[#B2C0FF]  text-black text-sm font-light">
			<Swiper
				modules={[Autoplay]}
				autoplay={{
					delay: 8000,
					disableOnInteraction: false,
				}}
				loop={true}
				slidesPerView={1}
				allowTouchMove={false}
			>
				<SwiperSlide className="text-center text-1xl  z-0 py-2">
					Celebrate : Save 20% off 2+ items
				</SwiperSlide>
				<SwiperSlide className="text-center text-1xl z-0  py-2">
					Free Delivery in 3 Days
				</SwiperSlide>
				<SwiperSlide className="text-center text-1xl z-0 py-2">
					Big Discount on All Products
				</SwiperSlide>
			</Swiper>
		</section>
	);
};

export default SliderSection;
