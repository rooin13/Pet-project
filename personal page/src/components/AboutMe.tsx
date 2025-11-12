"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!rootRef.current) return;

		const ctx = gsap.context(() => {
			const section = rootRef.current;
			if (section === null) {
				return;
			}

			gsap.from(section.querySelector(".about-title"), {
				y: 60,
				opacity: 0,
				rotationX: 15,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: section,
					start: "top 80%",
					toggleActions: "play none none none", // анимация только один раз
				},
			});

			gsap.from(section.querySelectorAll(".about-text"), {
				x: (i) => (i % 2 === 0 ? -50 : 50),
				y: 20,
				opacity: 0,
				stagger: 0.25,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: section,
					start: "top 80%",
					toggleActions: "play none none none",
				},
			});
		}, rootRef);

		return () => ctx.revert();
	}, []);

	const aboutText = [
		"Hey, I’m Ruslan — I craft clean and practical web apps that feel smooth, stable, and user-friendly.",
		"I love turning designs into responsive interfaces and connecting APIs to bring features to life.",
		"When I’m not coding, I experiment with motion, UI effects, or small side projects to keep creativity flowing.",
		"React, Next.js, Tailwind, Framer Motion, Redux, Prisma — my toolbox, but my focus is on building real, functional products.",
	];

	return (
		<section
			ref={rootRef}
			className="about-section w-full  min-h-screen flex flex-col items-start justify-center px-6 md:px-20 text-white gap-10"
		>
			<div className="flex flex-col gap-6 max-w-xl">
				{aboutText.map((text, i) => (
					<p
						key={i}
						className="about-text text-black text-lg md:text-xl leading-relaxed"
					>
						{text}
					</p>
				))}
			</div>
		</section>
	);
}
