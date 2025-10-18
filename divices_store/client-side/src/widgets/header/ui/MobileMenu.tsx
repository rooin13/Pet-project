"use client";

import { FC, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	ignoreRef?: React.RefObject<HTMLElement>;
}

const menuVariants: any = {
	closed: {
		x: "100%",
		transition: {
			type: "tween",
			duration: 0.3,
			ease: "easeInOut",
		},
	},
	open: {
		x: 0,
		transition: {
			type: "tween",
			duration: 0.3,
			ease: "easeInOut",
		},
	},
};

const overlayVariants: any = {
	closed: {
		opacity: 0,
		transition: {
			duration: 0.3,
		},
	},
	open: {
		opacity: 1,
		transition: {
			duration: 0.3,
		},
	},
};

const menuItemVariants: any = {
	closed: { x: 50, opacity: 0 },
	open: (i: number) => ({
		x: 0,
		opacity: 1,
		transition: {
			delay: i * 0.1,
			duration: 0.3,
			ease: "easeOut",
		},
	}),
};

export const MobileMenu: FC<MobileMenuProps> = ({
	isOpen,
	onClose,
	ignoreRef,
}) => {
	const menuRef = useRef<HTMLDivElement>(null);

	// Кастомная проверка клика вне меню (с учетом игнорируемого элемента)
	useEffect(() => {
		if (!isOpen) return;

		const handleClick = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node;
			const menu = menuRef.current;
			const ignoreEl = ignoreRef?.current;

			if (menu && menu.contains(target)) return;
			if (ignoreEl && ignoreEl.contains(target)) return;

			onClose();
		};

		const timer = setTimeout(() => {
			document.addEventListener("mousedown", handleClick);
			document.addEventListener("touchstart", handleClick);
		}, 400);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("touchstart", handleClick);
		};
	}, [isOpen, onClose, ignoreRef]);

	// Блокировка скролла при открытом меню
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const menuItems = [
		{ href: "/shop", label: "Shop" },
		{ href: "/software", label: "Software" },
	];

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Overlay - поверх всего */}
					<motion.div
						className="fixed inset-0 bg-black/50 md:hidden"
						style={{ zIndex: 39998 }}
						variants={overlayVariants}
						initial="closed"
						animate="open"
						exit="closed"
					/>

					{/* Menu - поверх всего и фиксированный */}
					<motion.div
						ref={menuRef}
						className="fixed top-0 right-0 w-80 bg-white shadow-2xl md:hidden overflow-y-auto"
						style={{
							height: "100vh",
							zIndex: 39999,
						}}
						variants={menuVariants}
						initial="closed"
						animate="open"
						exit="closed"
					>
						<div className="flex flex-col h-full">
							{/* Navigation */}
							<nav className="flex-1 p-6 bg-white pt-12">
								<ul className="space-y-4">
									{menuItems.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												onClick={onClose}
												style={{ color: "#000000" }}
												className="block py-4 px-6 text-2xl font-bold bg-gray-100 hover:bg-gray-300 rounded-lg transition-colors shadow-sm"
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
