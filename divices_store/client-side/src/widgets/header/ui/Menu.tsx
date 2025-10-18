"use client";

import { FC, memo, useMemo, useRef } from "react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/shared/ui/NavigationMenu";

import Image from "next/image";
import Link from "next/link";

import { AuthBtn } from "@/features/auth-btn/ui/AuthBtn";
import CartBtn from "../ui/CartBtn";
import SearchDropdown from "@/features/search/ui/search-dropdown/SearchDropdown";

import { useAppSelector } from "@/store";
import { useMobileMenu } from "../model/lib/useMobileMenu";
import { BurgerButton } from "./BurgerButton";
import { MobileMenuPortal } from "./MobileMenuPortal";
import { SHOP_CATEGORIES } from "@/shared/lib/config/categories.config";

const Logo = memo(() => (
	<NavigationMenuItem className="flex items-center justify-between">
		<Link href="/" aria-label="HEX Store - Go to homepage">
			<Image
				width={70}
				height={70}
				alt="HEX Store Logo"
				src="/images/favicon.png"
				priority
			/>
		</Link>
	</NavigationMenuItem>
));
Logo.displayName = "Logo";

const ShopContent = memo(() => (
	<NavigationMenuContent className="bg-secondary h-100 z-30 text-black">
		<div className="w-screen flex justify-center p-4">
			<div className="max-w-[1500px] justify-between w-full flex items-start gap-8">
				<div className="grid grid-cols-3 gap-3 h-20">
					{SHOP_CATEGORIES.map(({ href, src, label }, i) => (
						<Link
							key={i}
							href={href}
							className="block w-32 sm:w-36 md:w-40 text-center hover:text-blue-500"
							aria-label={`Shop ${label}`}
						>
							{/* Контейнер картинки */}
							<div className="relative w-full h-28 sm:h-32 md:h-36  rounded-lg overflow-hidden">
								<Image
									src={src}
									alt={`${label} category`}
									fill
									className="object-contain"
								/>
							</div>
							<span className="block mt-1 text-xs sm:text-sm md:text-base">
								{label}
							</span>
						</Link>
					))}
				</div>
				<div className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 mt-20 rounded-lg p-6 mx-20  text-white flex flex-col justify-center shadow-lg">
					<h3 className="text-lg font-semibold mb-2">
						Special Offer
					</h3>
					<p className="text-sm mb-4">
						Get exclusive deals on top gaming gear this week only.
					</p>
					<Link
						href="/shop"
						className="inline-block bg-white text-indigo-600 font-semibold py-1 px-3 rounded hover:bg-gray-200 transition"
						aria-label="Shop special offers now"
					>
						<span className="text-black">Shop Now →</span>
					</Link>
				</div>
			</div>
		</div>
	</NavigationMenuContent>
));
ShopContent.displayName = "ShopContent";

const RightButtons = memo(() => (
	<div className="flex gap-10">
		<NavigationMenuItem className="flex gap-4 items-center">
			<SearchDropdown />
		</NavigationMenuItem>

		<NavigationMenuItem className="flex gap-4 items-center px-8">
			<div className="hover:opacity-70 flex items-center">
				<AuthBtn />
			</div>
			<div className="flex items-center">
				<CartBtn />
			</div>
		</NavigationMenuItem>
	</div>
));
RightButtons.displayName = "RightButtons";

const Menu: FC = () => {
	const atTop = useAppSelector((state) => state?.ui?.atTop ?? true);
	const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
	const burgerButtonRef = useRef<HTMLDivElement>(null);

	const ShopMenuItem = useMemo(() => {
		return (
			<NavigationMenuItem className="text-black bg-transparent text-xl h-15 font-semibold duration-300">
				<Link href={"/shop"} aria-label="Shop all products">
					<NavigationMenuTrigger
						className={`
            relative cursor-pointer h-full duration-300
            ${atTop ? "text-black" : "text-white"}
            after:absolute after:bottom-3 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all
            hover:after:w-full
          `}
						aria-label="Open shop menu"
					>
						<span className="cursor-pointer text-xl font-semibold">
							Shop
						</span>
					</NavigationMenuTrigger>
				</Link>
				<ShopContent />
			</NavigationMenuItem>
		);
	}, [atTop]);

	const SoftwareMenuItem = useMemo(() => {
		return (
			<NavigationMenuItem>
				<NavigationMenuTrigger
					className={`
          relative cursor-pointer h-full duration-300
          ${atTop ? "text-black" : "text-white"}
          after:absolute after:bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all
          hover:after:w-full
        `}
					aria-label="Open software menu"
				>
					<Link href={"/software"} aria-label="Software and drivers">
						<span className="cursor-pointer text-xl font-semibold">
							Software
						</span>
					</Link>
				</NavigationMenuTrigger>
			</NavigationMenuItem>
		);
	}, [atTop]);

	return (
		<>
			{/* Десктопное меню */}
			<NavigationMenu
				className="hidden md:flex"
				role="navigation"
				aria-label="Main navigation"
			>
				<NavigationMenuList className="items-center justify-between gap-16 w-[97vw] max-w-380">
					<div className="flex items-center gap-9">
						<Logo />
						{ShopMenuItem}
						{SoftwareMenuItem}
					</div>
					<RightButtons />
				</NavigationMenuList>
			</NavigationMenu>

			{/* Мобильное бургер-меню */}
			<nav
				className="md:hidden flex items-center justify-between md:p-4 p-0 relative"
				role="navigation"
				aria-label="Mobile navigation"
			>
				<Logo />
				<div className="flex items-center gap-3">
					<div className="flex items-center">
						<SearchDropdown />
					</div>
					<div className="flex items-center hover:opacity-70">
						<AuthBtn />
					</div>
					<div className="flex items-center">
						<CartBtn />
					</div>
					<div
						ref={burgerButtonRef}
						className="flex items-center relative"
						style={{ zIndex: 50000 }}
					>
						<BurgerButton
							isOpen={isOpen}
							onClick={toggleMenu}
							isDark={atTop && !isOpen}
						/>
					</div>
				</div>
			</nav>

			{/* Мобильное меню через портал */}
			<MobileMenuPortal
				isOpen={isOpen}
				onClose={closeMenu}
				ignoreRef={burgerButtonRef}
			/>
		</>
	);
};

export default Menu;
