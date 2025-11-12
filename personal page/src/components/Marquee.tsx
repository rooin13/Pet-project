"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Marquee() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [textWidth, setTextWidth] = useState(0);
	const text = "ABOUT ME - ABOUT ME - ABOUT ME - ABOUT ME - ";

	useEffect(() => {
		if (containerRef.current) {
			setTextWidth(containerRef.current.scrollWidth / 2);
		}
	}, []);

	return (
		<div className="relative border-t-white  border-t-1 w-full overflow-hidden  bg-black h-20 flex items-center">
			<motion.div
				ref={containerRef}
				className="whitespace-nowrap text-white text-6xl font-bold flex"
				animate={{ x: [-textWidth, 0] }}
				transition={{
					x: {
						repeat: Infinity,
						repeatType: "loop",
						duration: 15,
						ease: "linear",
					},
				}}
			>
				{text}
				{text}
			</motion.div>
		</div>
	);
}
