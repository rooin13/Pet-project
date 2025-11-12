"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Circle = {
	el: HTMLDivElement;
	speed: number; // пиксели на 1px скролла
	baseY: number; // начальная позиция
};

export default function Parallax() {
	const containerRef = useRef<HTMLDivElement>(null);
	const circlesRef = useRef<Circle[]>([]);
	const textRef = useRef<HTMLDivElement>(null);

	// --- PARALLAX CIRCLES ---
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const circleElements =
			container.querySelectorAll<HTMLDivElement>(".circles");
		const circles: Circle[] = [];

		circleElements.forEach((el) => {
			const speed = 0.1 + Math.random() * 0.4; // разные скорости
			const rect = el.getBoundingClientRect();
			const baseY = rect.top;
			circles.push({ el, speed, baseY });
		});

		circlesRef.current = circles;

		function onScroll() {
			const scrollY = window.scrollY;
			circlesRef.current.forEach((c) => {
				c.el.style.transform = `translateY(${
					c.baseY - scrollY * c.speed
				}px)`;
			});
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();

		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	// --- ANIMATED GREETING ---
	useEffect(() => {
		if (!textRef.current) return;

		const lines = [
			"Hi, I'm Ruslan",
			"A Web Developer",
			"Creating modern interfaces",
		];

		textRef.current.innerHTML = "";

		lines.forEach((line, i) => {
			const h1 = document.createElement("h1");
			h1.className = "text-3xl md:text-5xl font-bold mb-4 opacity-0";
			h1.textContent = line;
			textRef.current?.appendChild(h1);

			gsap.fromTo(
				h1,
				{ y: 50, opacity: 0, scale: 0.9 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.8,
					delay: i * 0.3,
					ease: "power2.out",
				}
			);
		});
	}, []);

	return (
		<>
			{/* Background Circles */}
			<div
				ref={containerRef}
				className="fixed top-0 left-0 w-full h-screen bg-black pointer-events-none z-0"
			>
				{Array.from({ length: 200 }).map((_, i) => (
					<div
						key={i}
						className="circles absolute bg-white rounded-full"
						style={{
							width: `${2 + Math.random() * 3}px`,
							height: `${2 + Math.random() * 3}px`,
							left: `${Math.random() * 100}%`,
							top: `${1 + Math.random() * 90}%`,
						}}
					/>
				))}
			</div>

			{/* Greeting Content */}
			<div
				ref={textRef}
				className="relative z-10 w-full h-screen flex flex-col items-center justify-center text-center text-white px-4"
			></div>
		</>
	);
}
