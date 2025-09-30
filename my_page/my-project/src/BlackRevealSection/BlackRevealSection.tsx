"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function BlackRevealSection() {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!rootRef.current) return;

		const letters =
			rootRef.current.querySelectorAll<HTMLElement>(".letter");

		// общий таймлайн с pin (как в App с кругом)
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: rootRef.current,
				start: "top top",
				end: "+=150%", // длина анимации
				scrub: true,
				pin: true,
				pinSpacing: true,
			},
		});

		// каждая буква анимируется последовательно
		letters.forEach((el, i) => {
			tl.fromTo(
				el,
				{ backgroundPosition: "0% 100%" }, // низ (серый)
				{ backgroundPosition: "0% 0%", ease: "none" }, // вверх (чёрный)
				i * 0.1 // смещение во времени
			);
		});

		return () => {
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	}, []);

	return (
		<section
			ref={rootRef}
			className="relative z-10 w-full h-screen bg-black flex items-center justify-start px-12"
		>
			<div className="text-[8vw] font-extrabold leading-tight flex flex-wrap">
				{"MY PORTFOLIO".split("").map((letter, i) => (
					<span
						key={i}
						className="letter inline-block 
							bg-gradient-to-t from-black from-50% to-gray-500 to-50% 
							bg-[length:100%_200%] 
							bg-clip-text text-transparent"
						style={{
							backgroundPosition: "0% 100%",
							marginRight: letter === " " ? "0.3em" : "0",
						}}
					>
						{letter}
					</span>
				))}
			</div>
		</section>
	);
}

export default React.memo(BlackRevealSection);
