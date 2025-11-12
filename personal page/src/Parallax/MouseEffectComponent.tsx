"use client";

import { useState, useEffect } from "react";

export default function MouseEffectComponent() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			setMousePosition({ x: event.clientX, y: event.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	const transformStyle = {
		transform: `translate(-50%, -50%) translate(${
			(mousePosition.x - window.innerWidth / 2) / 10
		}px, ${(mousePosition.y - window.innerHeight / 2) / 4}px)`,
		transition: "transform 0.1s ease-out",
	};

	return (
		<div
			className="fixed top-1/2 left-1/2 w-32 h-32 border-1 border-white rounded-full"
			style={transformStyle}
		/>
	);
}
