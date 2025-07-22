import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const SliderSection = () => {
	return (
		<div className="_container flex content-center flex-col items-center">
			<section className="border-b-1 border-gray bg-white mb-40">
				<div className=" w-full h-10 ">
					<Swiper
						className="mySwiper"
						modules={[Autoplay]}
						autoplay={{
							delay: 3000,
						}}
					>
						<SwiperSlide className="text-primary font-light">
							925 Italian Silver with Certificate
						</SwiperSlide>
						<SwiperSlide className="text-primary font-light">
							Free Delivery All over UAE in 3 Days*
						</SwiperSlide>
						<SwiperSlide className="text-primary font-light">
							Big Discount on All Collection
						</SwiperSlide>
					</Swiper>
				</div>
			</section>
		</div>
	);
};
export default SliderSection;
