import { useState } from "react";

/**
 * Хук для управления hover состоянием продукта
 */
export const useProductHover = () => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);

	return {
		isHovered,
		handleMouseEnter,
		handleMouseLeave,
	};
};

