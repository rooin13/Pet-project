import React, { useEffect, useRef } from "react";
import "./CorouselApi.css";

interface HoverCarouselProps {
	items: string[]; // измените тип, если данные не строки
}

const HoverCarousel: React.FC<HoverCarouselProps> = ({ items }) => {
	// используем ref для контейнера карусели
	const carouselRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const carousel = carouselRef.current;
		if (!carousel) return;

		let containerWidth = 0;
		let scrollWidth = 0;
		let posFromLeft = 0;
		let scrollPos = 0;
		let animated: number | undefined;

		const handleMouseEnter = (e: MouseEvent) => {
			containerWidth = carousel.clientWidth;
			scrollWidth = carousel.scrollWidth;
			const rect = carousel.getBoundingClientRect();
			posFromLeft = rect.left;
			const stripePos = e.pageX - posFromLeft;
			const pos = stripePos / containerWidth;
			scrollPos = (scrollWidth - containerWidth) * pos;

			// включаем плавную прокрутку
			carousel.style.scrollBehavior = "smooth";

			if (scrollPos < 0) scrollPos = 0;
			if (scrollPos > scrollWidth - containerWidth)
				scrollPos = scrollWidth - containerWidth;

			carousel.scrollLeft = scrollPos;

			// обновляем CSS-переменные
			carousel.style.setProperty(
				"--scrollWidth",
				(containerWidth / scrollWidth) * 100 + "%"
			);
			carousel.style.setProperty(
				"--scrollLeft",
				(scrollPos / scrollWidth) * 100 + "%"
			);

			animated = window.setTimeout(() => {
				carousel.style.scrollBehavior = "auto";
				animated = undefined;
			}, 200);
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (animated) return;
			containerWidth = carousel.clientWidth;
			scrollWidth = carousel.scrollWidth;
			const rect = carousel.getBoundingClientRect();
			posFromLeft = rect.left;
			const stripePos = e.pageX - posFromLeft;
			const pos = stripePos / containerWidth;
			scrollPos = (scrollWidth - containerWidth) * pos;

			carousel.scrollLeft = scrollPos;

			if (scrollPos < scrollWidth - containerWidth) {
				carousel.style.setProperty(
					"--scrollLeft",
					(scrollPos / scrollWidth) * 100 + "%"
				);
			}

			let dataAt = "";
			if (scrollPos > 5) dataAt += "left ";
			if (scrollWidth - containerWidth - scrollPos > 5) dataAt += "right";
			carousel.setAttribute("data-at", dataAt.trim());
		};

		// Привязываем обработчики событий к контейнеру
		carousel.addEventListener("mouseenter", handleMouseEnter);
		carousel.addEventListener("mousemove", handleMouseMove);

		return () => {
			carousel.removeEventListener("mouseenter", handleMouseEnter);
			carousel.removeEventListener("mousemove", handleMouseMove);
			if (animated !== undefined) {
				clearTimeout(animated);
			}
		};
	}, [items]);

	return (
		<div
			ref={carouselRef}
			className="carousel"
			style={{
				overflow: "hidden",
				position: "absolute",
				width: "90%",
				left: "30px",
				paddingTop: "26rem",
				top: "70px",
				height: "90%",
			}}
		>
			<ul
				style={{
					listStyle: "none",
					display: "flex",
					padding: 0,
					margin: 0,
					whiteSpace: "nowrap",
					transition: "transform 0.2s ease",
				}}
			>
				{items.map((item, index) => (
					<li
						key={index}
						style={{
							display: "inline-block",
							width: "33.33%",
							flexShrink: 0,
						}}
					>
						<button className="btn">
							<div
								style={{
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#FFFFFF",
									fontSize: "0.7rem",
									fontWeight: "bolder",
								}}
							>
								{item}
							</div>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default HoverCarousel;
