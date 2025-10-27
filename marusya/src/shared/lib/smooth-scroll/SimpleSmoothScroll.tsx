"use client";

import { useEffect } from "react";

export default function SimpleSmoothScroll({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		// simple smooth scroll without Lenis
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			const delta = e.deltaY;
			const currentScroll = window.pageYOffset;
			const targetScroll = currentScroll + delta * 0.5; // reduce scroll speed

			window.scrollTo({
				top: targetScroll,
				behavior: "smooth",
			});
		};

		// add wheel event handler
		window.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			window.removeEventListener("wheel", handleWheel);
		};
	}, []);

	return <>{children}</>;
}
