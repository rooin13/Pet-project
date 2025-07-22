"use client";
import { AuthBtn } from "@/features/auth-btn/ui/AuthBtn";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/shared/ui/navigation-menu";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import CartBtn from "./cart-btn/CartBtn";

import SearchDropdown from "@/features/search/ui/search-dropdown/SearchDropdown";

const Menu: FC = () => {
	return (
		<NavigationMenu className="">
			<NavigationMenuList className=" items-center justify-between  gap-16  w-[97vw]  max-w-380 ">
				<div className="flex items-center gap-9">
					<NavigationMenuItem className="flex items-center justify-between">
						<Link href="/">
							<Image
								width={80}
								height={80}
								alt="HEX Logo"
								src="/images/favicon.png"
							/>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem className="text-black text-xl h-15 font-semibold ">
						<Link href={"/shop"}>
							<NavigationMenuTrigger className="bg-white cursor-pointer h-full  ">
								<p className="text-black   text-xl  font-semibold">
									Shop
								</p>
							</NavigationMenuTrigger>
						</Link>

						<NavigationMenuContent className="bg-secondery min-h-50 text-black">
							<div className="w-screen justify-center flex">
								<div className="max-w-380">
									<div className=" gap-4  flex"></div>

									<div className="gap-4  flex">
										<p className="">
											Lorem ipsum dolor sit.
										</p>
										<p>Lorem ipsum dolor sit.</p>
										<p>Lorem ipsum dolor sit.</p>
									</div>
									<div className="gap-4  flex">
										<p className="">
											Lorem ipsum dolor sit.
										</p>
										<p>Lorem ipsum dolor sit.</p>
										<p>Lorem ipsum dolor sit.</p>
									</div>
								</div>
								<div className="max-w-380">
									<div className=" gap-4  flex">
										<p className="">
											Lorem ipsum dolor sit.
										</p>
										<p>Lorem ipsum dolor sit.</p>
										<p>Lorem ipsum dolor sit.</p>
									</div>
									<div className="gap-4  flex">
										<p className="">
											Lorem ipsum dolor sit.
										</p>
										<p>Lorem ipsum dolor sit.</p>
										<p>Lorem ipsum dolor sit.</p>
									</div>
									<div className="gap-4  flex">
										<p className="">
											Lorem ipsum dolor sit.
										</p>
										<p>Lorem ipsum dolor sit.</p>
										<p>Lorem ipsum dolor sit.</p>
									</div>
								</div>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger className="bg-white">
							<p className="text-black  cursor-pointer text-xl font-semibold">
								Software
							</p>

							<NavigationMenuContent className="bg-secondery text-black min-h-50 gap-4  flex outline-none  ">
								<div className="w-screen justify-center flex">
									<div className="max-w-380">
										<div className=" gap-4  flex">
											<p className="">
												Lorem ipsum dolor sit.
											</p>
											<p>Lorem ipsum dolor sit.</p>
											<p>Lorem ipsum dolor sit.</p>
										</div>
										<div className="gap-4  flex">
											<p className="">
												Lorem ipsum dolor sit.
											</p>
											<p>Lorem ipsum dolor sit.</p>
											<p>Lorem ipsum dolor sit.</p>
										</div>
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuTrigger>
					</NavigationMenuItem>
				</div>
				<div className="flex gap-10">
					<NavigationMenuItem className="flex gap-4 items-center ">
						<SearchDropdown></SearchDropdown>
					</NavigationMenuItem>
					<NavigationMenuItem className="flex gap-4 items-center px-8 ">
						<div className="hover:opacity-70 flex items-center">
							<AuthBtn></AuthBtn>
						</div>
						<CartBtn></CartBtn>
					</NavigationMenuItem>
				</div>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default Menu;
