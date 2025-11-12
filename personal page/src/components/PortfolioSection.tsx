"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const projects = [
	{
		id: 1,
		title: "Project 1 Project 1 Project 1 Project 1 Project 1 Project 1 ",
		image: "/images/project1.jpg",
	},
	{
		id: 2,
		title: "Project 2 Project 2 Project 2 Project 2 Project 2 Project 2 ",
		image: "/images/project2.jpg",
	},
	{
		id: 3,
		title: "Project 3 Project 3 Project 3 Project 3 Project 3 Project 3 ",
		image: "/images/project3.jpg",
	},
];

export default function PortfolioSection() {
	return (
		<section className="w-full min-h-screen flex-col flex md:flex-row items-center justify-around 	 px-4">
			{projects.map((project) => (
				<InteractiveCard key={project.id} project={project} />
			))}
		</section>
	);
}

function InteractiveCard({ project }: { project: (typeof projects)[0] }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState(false);

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	// Смещение картинки внутри карточки по положению мыши
	const rotateX = useTransform(y, [-50, 50], [15, -15]);
	const rotateY = useTransform(x, [-50, 50], [-15, 15]);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const offsetX = e.clientX - rect.left - rect.width / 2;
		const offsetY = e.clientY - rect.top - rect.height / 2;
		x.set(offsetX);
		y.set(offsetY);
	};

	const handleMouseLeave = () => {
		setHovered(false);
		x.set(0);
		y.set(0);
	};

	const handleMouseEnter = () => setHovered(true);

	return (
		<motion.div
			ref={cardRef}
			className="relative flex align-middle  content-center md:w-67 w-80 mb-5 h-60 border-white border-1	bg-transparent md:h-120 rounded-4xl overflow-hidden cursor-pointer"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onMouseEnter={handleMouseEnter}
			style={{
				boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)",
				perspective: 600,
			}}
		>
			<motion.img
				src={project.image}
				alt={project.title}
				className="w-full h-full object-cover rounded-xl shadow-2xl"
				style={{
					rotateX,
					rotateY,
					scale: hovered ? 1.05 : 1,
					transition: "transform 0.2s ease-out",
				}}
			/>
			<motion.div
				className="absolute bottom-4 left-4 text-white font-bold text-lg"
				initial={{ opacity: 0 }}
				animate={{ opacity: hovered ? 1 : 0 }}
			>
				<p className="text-white">{project.title}</p>
			</motion.div>
		</motion.div>
	);
}
