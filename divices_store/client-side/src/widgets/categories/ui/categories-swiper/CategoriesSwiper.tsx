"use client";

import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@prisma/client";
import { PAGES } from "@/shared/lib/config/pages.config";

interface CategoriesProps {
	categories: Category[] | null; // категории могут быть null пока не загрузились
}

export const CategoriesSwiper: React.FC<CategoriesProps> = ({ categories }) => {
	const [isReady, setIsReady] = useState(false);

	// Состояние слайдера будет инициализировано только когда категории готовы
	const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
		loop: false,
		breakpoints: {
			"(max-width: 639px)": { slides: { perView: 1, spacing: 10 } },
			"(min-width: 640px) and (max-width: 767px)": {
				slides: { perView: 2, spacing: 20 },
			},
			"(min-width: 768px) and (max-width: 1023px)": {
				slides: { perView: 3, spacing: 25 },
			},
			"(min-width: 1024px)": { slides: { perView: 4, spacing: 30 } },
		},
	});

	// Включаем слайдер только после того, как категории не null и не пусты
	useEffect(() => {
		if (categories && categories.length > 0) {
			setIsReady(true);
		}
	}, [categories]);

	if (!categories || !isReady) {
		return (
			<div className="flex gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="rounded-3xl bg-gray-300 animate-pulse"
						style={{ width: "25%", height: "280px" }}
					/>
				))}
			</div>
		);
	}

	return (
		<div style={{ position: "relative", width: "100%" }}>
			<div ref={sliderRef} className="keen-slider">
				{categories.map((category) => (
					<div
						key={category.id}
						className="keen-slider__slide rounded-3xl bg-secondery overflow-hidden flex flex-col items-center justify-center relative"
						style={{ height: "280px" }}
					>
						<Link
							href={PAGES.CATEGORY(category)}
							className="w-full h-full flex flex-col"
						>
							{" "}
							<div className="flex-grow max-h-75 relative	 overflow-hidden rounded-3xl">
								<Image
									src={category.imageUrl}
									alt={category.name}
									fill
									style={{
										objectFit: "contain", // или "contain", если хочешь, чтобы не обрезало
									}}
									sizes="(max-width: 768px) 220vw, 220vw"
									priority
								/>
							</div>
							<div className="bg-primary w-full h-13 flex items-center justify-center rounded-b-3xl mt-2">
								<p className="text-white text-2xl">
									{category.name}
								</p>
							</div>
						</Link>
					</div>
				))}
			</div>

			{/* Prev Button */}
			<button
				onClick={() => slider.current?.prev()}
				aria-label="Previous Slide"
				className="left-[-7vw] md:left-[-4vw] "
				style={{
					position: "absolute",
					top: "50%",

					transform: "translateY(-50%)",
					zIndex: 10,
					width: 30,
					height: 30,
					border: "none",
					background: "transparent",
					cursor: "pointer",
					overflow: "visible",
				}}
			>
				<span
					style={{
						display: "block",
						width: 0,
						height: 0,
						borderTop: "15px solid transparent",
						borderBottom: "15px solid transparent",
						borderRight: "15px solid rgba(0,0,0,0.5)",
					}}
				/>
			</button>

			{/* Next Button */}
			<button
				className=" md:right-[-5vw] right-[-10vw]"
				onClick={() => slider.current?.next()}
				aria-label="Next Slide"
				style={{
					position: "absolute",
					top: "50%",

					transform: "translateY(-50%)",
					zIndex: 10,
					width: 30,
					height: 30,
					border: "none",
					background: "transparent",
					cursor: "pointer",
					overflow: "visible",
				}}
			>
				<span
					style={{
						display: "block",
						width: 0,
						height: 0,
						borderTop: "15px solid transparent",
						borderBottom: "15px solid transparent",
						borderLeft: "15px solid rgba(0,0,0,0.5)",
					}}
				/>
			</button>
		</div>
	);
};
