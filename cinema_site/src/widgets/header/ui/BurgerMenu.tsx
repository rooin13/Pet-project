"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import {
	useUser,
	useAuthModal,
} from "@/features/auth-button/model/supabase-hooks";

export const BurgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: userData } = useUser();
	const { openLoginForm } = useAuthModal();
	const user = userData?.user;
	const profile = userData?.profile;

	const toggleMenu = () => setIsOpen(!isOpen);
	const closeMenu = () => setIsOpen(false);

	const menuVariants = {
		closed: {
			x: "100%",
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		},
		open: {
			x: 0,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		},
	};

	const linkVariants = {
		closed: { x: 50, opacity: 0 },
		open: (i: number) => ({
			x: 0,
			opacity: 1,
			transition: {
				delay: i * 0.1,
			},
		}),
	};

	const links = [
		{ href: "/", label: "Main" },
		{ href: "/genres", label: "Genres" },
		{ href: "/favorites", label: "Favorites" },
		{ href: "/profile", label: "Profile" },
	];

	return (
		<>
			{/* Burger Icon - visible only on mobile */}
			<button
				onClick={toggleMenu}
				className="lg:hidden text-white text-3xl focus:outline-none z-50 relative"
				aria-label="Toggle menu"
			>
				{isOpen ? <FaTimes /> : <FaBars />}
			</button>

			{/* Backdrop */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closeMenu}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
					/>
				)}
			</AnimatePresence>

			{/* Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.nav
						variants={menuVariants}
						initial="closed"
						animate="open"
						exit="closed"
						className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-[#0c1a2d] to-[#38384a] shadow-2xl z-50 lg:hidden"
					>
						<div className="flex flex-col h-full p-8 pt-20">
							{/* User Info / Auth Button */}
							<motion.div
								custom={-1}
								variants={linkVariants}
								initial="closed"
								animate="open"
								exit="closed"
								className="mb-6 pb-4 border-b-2 border-purple-500/50"
							>
								{user ? (
									<Link
										href="/profile"
										onClick={closeMenu}
										className="block text-white text-xl font-semibold hover:text-purple-400 transition-colors truncate"
									>
										{profile?.username ||
											profile?.name ||
											user.email?.split("@")[0] ||
											"User"}
									</Link>
								) : (
									<button
										onClick={() => {
											closeMenu();
											openLoginForm();
										}}
										className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
									>
										Sign Up
									</button>
								)}
							</motion.div>

							{/* Navigation Links */}
							{links.map((link, i) => (
								<motion.div
									key={link.href}
									custom={i}
									variants={linkVariants}
									initial="closed"
									animate="open"
									exit="closed"
								>
									<Link
										href={link.href}
										onClick={closeMenu}
										className="block py-4 text-white text-2xl font-medium hover:text-purple-400 transition-colors border-b border-white/10"
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.nav>
				)}
			</AnimatePresence>
		</>
	);
};
