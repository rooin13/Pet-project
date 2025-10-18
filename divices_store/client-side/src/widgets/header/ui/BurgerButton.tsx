"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface BurgerButtonProps {
	isOpen: boolean;
	onClick: (e?: any) => void;
	isDark?: boolean;
}

export const BurgerButton: FC<BurgerButtonProps> = ({
	isOpen,
	onClick,
	isDark = false,
}) => {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onClick(e);
	};

	const lineColor = isOpen ? "bg-black" : isDark ? "bg-black" : "bg-white";
	const bgColor = isOpen ? "bg-white shadow-lg" : "";

	return (
		<button
			onClick={handleClick}
			style={{ zIndex: 50000000 }}
			className={`relative w-10 h-10 flex items-center justify-center p-2 rounded-lg transition-all cursor-pointer ${bgColor} ${
				!isOpen && "hover:bg-gray-100/10"
			}`}
			aria-label={isOpen ? "Close menu" : "Open menu"}
		>
			<div className="relative w-6 h-5 flex flex-col justify-center pointer-events-none">
				{/* Верхняя линия */}
				<motion.span
					className={`absolute w-6 h-0.5 ${lineColor} pointer-events-none`}
					animate={
						isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }
					}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				/>

				{/* Средняя линия */}
				<motion.span
					className={`absolute w-6 h-0.5 ${lineColor} pointer-events-none`}
					animate={
						isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }
					}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				/>

				{/* Нижняя линия */}
				<motion.span
					className={`absolute w-6 h-0.5 ${lineColor} pointer-events-none`}
					animate={
						isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }
					}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				/>
			</div>
		</button>
	);
};
