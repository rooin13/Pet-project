"use client";
import { MovieSearchInput } from "@/features/movie-search/ui/MovieSearchInput";
import { AuthButton } from "@/features/auth-button/ui/AuthButton";
import { BurgerMenu } from "./BurgerMenu";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
	const [logoLoaded, setLogoLoaded] = useState(false);

	return (
		<header className="pt-7 pb-7 items-center relative flex px-2 md:px-0">
			<div className="inline-flex items-center gap-2 px-0 py-2 relative flex-shrink-0 mr-4 lg:mr-16">
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2"
					aria-label="Go to homepage"
				>
					<div className="relative w-6 h-6">
						{!logoLoaded && (
							<div className="w-6 h-6 bg-gray-700 rounded" />
						)}
						<Image
							src="/images/logo.svg"
							alt="MARUSYA logo"
							width={24}
							height={24}
							onLoad={() => setLogoLoaded(true)}
							className={logoLoaded ? "opacity-100" : "opacity-0"}
						/>
					</div>
					<p className="font-normal text-white text-xl lg:text-3xl hidden md:inline">
						marusya
					</p>
				</Link>
			</div>

			{/* desktop nav */}
			<nav
				className="hidden lg:block flex-shrink-0"
				aria-label="Main navigation"
			>
				<ul className="flex space-x-6" role="list">
					<Link href="/" className="group relative">
						<li className="font-normal text-white text-2xl whitespace-nowrap">
							Main
						</li>
						<span className="absolute left-0 top-9 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
					</Link>
					<Link href="/genres" className="group relative">
						<li className="font-normal text-white text-2xl whitespace-nowrap">
							Genres
						</li>
						<span className="absolute left-0 top-9 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
					</Link>
					<Link href="/favorites" className="group relative">
						<li className="font-normal text-white text-2xl whitespace-nowrap">
							Favorites
						</li>
						<span className="absolute left-0 top-9 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
					</Link>
				</ul>
			</nav>

			{/* search */}
			<div className="flex-1 px-12">
				<MovieSearchInput />
			</div>

			<div className="font-normal text-white text-2xl hidden lg:block flex-shrink-0">
				<AuthButton />
			</div>

			<BurgerMenu />
		</header>
	);
};

export default Header;
