"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./../App.css";

gsap.registerPlugin(ScrollTrigger);

export default function SecondSection() {
	const rootRef = useRef<HTMLDivElement>(null);
	const lenisRef = useRef<Lenis | null>(null);

	const skills = [
		"React",
		"TypeScript",
		"Next.js",
		"Tailwind",
		"Redux Toolkit",
		"GSAP",
	];

	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => t,
			lerp: 0.1,
		});
		lenis.scrollTo(0, { immediate: true });
		ScrollTrigger.refresh();
		lenisRef.current = lenis;

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);
		lenis.scrollTo(0, { immediate: true });

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: ".white-section",
					start: "top top",
					end: "+=100%",
					scrub: true,
					pin: true,
					pinSpacing: true,
				},
			});

			// Анимация кружка
			tl.fromTo(
				".circle",
				{ scale: 0, opacity: 1 },
				{ scale: 8, opacity: 1, ease: "none", duration: 1 },
				0
			);

			// Анимация текста My Skills (вырастает снизу вверх)
			tl.fromTo(
				".skills-title",
				{ scaleY: 0, opacity: 0 },
				{
					scaleY: 1,
					opacity: 1,
					transformOrigin: "bottom",
					ease: "power2.out",
					duration: 1,
				},
				0
			);

			// Анимация блоков скиллов: плавно появляются с небольшой задержкой
			tl.fromTo(
				".skill-item",
				{ opacity: 0, scale: 0.8 },
				{
					opacity: 1,
					scale: 1,
					ease: "power2.out",
					duration: 0.6,
					stagger: 0.15, // задержка между появлением блоков
				},
				0.5 // старт через 0.5сек после начала анимации текста
			);
		}, rootRef);

		lenis.on("scroll", ScrollTrigger.update);

		return () => {
			ctx.revert();
			lenis.destroy();
		};
	}, []);

	return (
		<div ref={rootRef}>
			<section className="section white-section relative flex flex-col items-center justify-center gap-8">
				<div className="circle" />

				<h2 className="skills-title text-white text-7xl z-40">
					My Skills
				</h2>

				{/* Блоки скиллов */}
				<div className="flex flex-wrap justify-center gap-6 w-full px-4 mt-20">
					{skills.map((skill, i) => (
						<div
							key={i}
							className="skill-item w-40 h-25 border border-white rounded-lg flex items-center justify-center text-white text-lg font-semibold z-40"
						>
							{skill}
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
