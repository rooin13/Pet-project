"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Parallax from "./Parallax/Parallax";
import SecondSection from "./components/SecondSection";
import BlackRevealSection from "./BlackRevealSection/BlackRevealSection";
import MouseEffectComponent from "./Parallax/MouseEffectComponent";
import Marquee from "./components/Marquee";
import PortfolioSection from "./components/PortfolioSection";
import AboutMe from "./components/AboutMe";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
	const lenisRef = useRef<Lenis | null>(null);
	useEffect(() => {
		window.history.scrollRestoration = "manual";
	}, []);

	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => t,
			lerp: 0.1,
		});
		lenis.scrollTo(0, { immediate: true });
		ScrollTrigger.refresh();
		lenisRef.current = lenis;
		lenis.scrollTo(0, { immediate: true });

		function raf(time: number) {
			lenis.raf(time);
			console.log("Lenis scroll:", lenis.scroll);

			ScrollTrigger.update();

			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
		ScrollTrigger.scrollerProxy(document.body, {
			scrollTop(value) {
				if (value != null) {
					lenis.scrollTo(value as number, { immediate: true });
				}
				return lenis.scroll;
			},
			getBoundingClientRect() {
				return {
					top: 0,
					left: 0,
					width: window.innerWidth,
					height: window.innerHeight,
				};
			},
		});
		ScrollTrigger.addEventListener("refreshInit", () =>
			lenis.raf(performance.now())
		);

		// Перезапуск ScrollTrigger после сброса скролла
		ScrollTrigger.refresh();
	}, []);

	return (
		<body>
			<div>
				<section>
					<Parallax />
				</section>

				<section className="section"></section>

				<SecondSection></SecondSection>

				<Marquee></Marquee>
				<section className="section white-section">
					<AboutMe></AboutMe>
				</section>
				<MouseEffectComponent></MouseEffectComponent>
				<BlackRevealSection></BlackRevealSection>
				<PortfolioSection></PortfolioSection>
			</div>
		</body>
	);
}
