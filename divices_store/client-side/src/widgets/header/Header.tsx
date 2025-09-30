"use client";

import { FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAppSelector } from "@/store";
import { useHeaderScrollLogic } from "./model/lib/useHeaderScrollLogic";
import Menu from "./ui/Menu";
import Us from "./ui/Us";

const HEADER_US_HEIGHT = 35;
const HEADER_MENU_HEIGHT = 60;

const Header: FC = () => {
	const pathname = usePathname();
	const isHome = pathname === "/";

	// Redux state
	const atTop = useAppSelector((state) => state.ui.atTop);
	const isHeaderTransparent = useAppSelector(
		(state) => state.ui.isHeaderTransparent
	);
	const isTransparent = atTop || isHeaderTransparent;

	// Scroll detection logic
	useHeaderScrollLogic(isHome);

	// Smooth vertical scroll
	const scrollY = useMotionValue(0);
	const y = useSpring(
		useTransform(scrollY, (v) => -Math.min(v, HEADER_US_HEIGHT)),
		{ stiffness: 120, damping: 25 }
	);

	useEffect(() => {
		const handleScroll = () => scrollY.set(window.scrollY);
		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{/* Spacer to prevent layout shift */}
			<div style={{ height: HEADER_US_HEIGHT + HEADER_MENU_HEIGHT }} />

			<motion.header
				className="fixed top-0 w-full z-50"
				style={{ y }}
				initial={false}
				animate={{
					backgroundColor: isTransparent
						? "rgba(0,0,0,0)"
						: "rgba(0,0,0,1)",
				}}
				transition={{
					backgroundColor: {
						duration: isTransparent ? 0 : 0.1,
						ease: "easeInOut",
					},
				}}
			>
				{/* Верхняя панель */}
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: atTop ? 1 : 0 }}
					transition={{ duration: 0 }}
					style={{
						height: HEADER_US_HEIGHT,
						overflow: "hidden",
					}}
				>
					<Us />
				</motion.div>

				{/* Главное меню */}
				<div style={{ height: HEADER_MENU_HEIGHT + 3 }}>
					{" "}
					<Menu />
				</div>
			</motion.header>
		</>
	);
};

export default Header;
