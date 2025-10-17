"use client";

import { FC, memo, useMemo, useState } from "react";

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

// импортируем Sheet из shadcn/ui
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/shared/ui/Sheet";

const Logo = memo(() => (
	<NavigationMenuItem className="flex items-center justify-between">
		<Link href="/">
			<Image
				width={70}
				height={70}
				alt="HEX Logo"
				src="/images/favicon.png"
				priority
			/>
		</Link>
	</NavigationMenuItem>
));
Logo.displayName = "Logo";

const ShopContent = memo(() => (
	<NavigationMenuContent className="bg-secondery h-100 z-30 text-black">
		<div className="w-screen flex justify-center p-4">
			<div className="max-w-[1500px] justify-between w-full flex items-start gap-8">
				<div className="grid grid-cols-3 gap-3 h-20">
					{[
						{
							href: "/shop/c/mice",
							src: "/images/categories/mice.png",
							label: "Mice",
						},
						{
							href: "/shop/c/keyboards",
							src: "/images/categories/keyboards.png",
							label: "Keyboards",
						},
						{
							href: "/shop/c/mats",
							src: "/images/categories/mats.png",
							label: "Mats",
						},
						{
							href: "/shop/c/headphones",
							src: "/images/categories/headphones.png",
							label: "Headphones",
						},
						{
							href: "/shop/c/webcams",
							src: "/images/categories/webcams.png",
							label: "Webcams",
						},
						{
							href: "/shop/c/accessories",
							src: "/images/categories/accessories.png",
							label: "Accessories",
						},
					].map(({ href, src, label }, i) => (
						<Link
							key={i}
							href={href}
							className="block w-32 sm:w-36 md:w-40 text-center hover:text-blue-500"
						>
							{/* Контейнер картинки */}
							<div className="relative w-full h-28 sm:h-32 md:h-36  rounded-lg overflow-hidden">
								<Image
									src={src}
									alt={label}
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
					>
						<p className="text-black">Shop Now →</p>
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
			<div className="pb-2">
				<CartBtn />
			</div>
		</NavigationMenuItem>
	</div>
));
RightButtons.displayName = "RightButtons";

const Menu: FC = () => {
	const atTop = useAppSelector((state) => state.ui.atTop);
	const [open, setOpen] = useState(false);

	const ShopMenuItem = useMemo(() => {
		return (
			<NavigationMenuItem className="text-black bg-transparent text-xl h-15 font-semibold duration-300">
				<Link href={"/shop"}>
					<NavigationMenuTrigger
						className={`
            relative cursor-pointer h-full duration-300
            ${atTop ? "text-black" : "text-white"}
            after:absolute after:bottom-3 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all
            hover:after:w-full
          `}
					>
						<p className="cursor-pointer text-xl font-semibold">
							Shop
						</p>
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
				>
					<Link href={"/software"}>
						<p className="cursor-pointer text-xl font-semibold">
							Software
						</p>
					</Link>
				</NavigationMenuTrigger>
			</NavigationMenuItem>
		);
	}, [atTop]);

	return (
		<>
			{/* Десктопное меню */}
			<NavigationMenu className="hidden md:flex">
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
			<div className="md:hidden flex items-center justify-between md:p-4 p-0	">
				<Logo />
				<div className="flex">
					<div className="flex flex-row ">
						<SearchDropdown />
						<div className="hover:opacity-70 mr-3 ml-3 flex items-center">
							<AuthBtn />
						</div>
						<div className="pt-0 md:pt-1	 mr-3">
							<CartBtn />
						</div>
					</div>
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger>
							<button className="p-2 rounded hover:bg-gray-200 mt-1 transition">
								<span
									className={`${
										atTop
											? "block w-6 h-0.5 bg-black mb-1"
											: "block w-6 h-0.5 bg-white mb-1"
									}`}
								></span>
								<span
									className={`${
										atTop
											? "block w-6 h-0.5 bg-black mb-1"
											: "block w-6 h-0.5 bg-white mb-1"
									}`}
								></span>
								<span
									className={`${
										atTop
											? "block w-6 h-0.5 bg-black mb-1"
											: "block w-6 h-0.5 bg-white mb-1"
									}`}
								></span>
							</button>
						</SheetTrigger>
						<SheetContent side="right" className="w-64 p-6">
							<SheetTitle>Menu</SheetTitle>

							<div className="flex flex-col gap-6 mt-6">
								<Link href="/shop">
									<p className="cursor-pointer text-xl font-semibold">
										Shop
									</p>
								</Link>
								<Link href="/software">
									<p className="cursor-pointer text-xl font-semibold">
										Software
									</p>
								</Link>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</>
	);
};

export default Menu;
