"use client";
import { MovieSearchInput } from "@/features/movieSearch/ui/MovieSearchInput";
import { AuthBtn } from "@/features/authBtn/ui/Authbtn";
import {
	FaSearch,
	FaStar,
	FaHeart,
	FaSyncAlt,
	FaThLarge,
	FaUser,
	FaEnvelope,
	FaKey,
	FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
	return (
		<header className="pt-7 pb-7   items-center relative  justify-between flex space-x-20">
			<div className=" [border-bottom-style:solid] inline-flex items-center gap-2 px-0 py-2 relative ">
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2"
				>
					{" "}
					<Image
						src="/images/logo.svg"
						alt="Поиск"
						width={24}
						height={24}
					/>
					<p className=" font-normal text-white text-3xl">marusya</p>
				</Link>
			</div>
			<nav className="flex-1/6">
				<ul className="flex space-x-9 ">
					<Link href="/" className="group relative  hidden lg:inline">
						<li className=" font-normal text-white text-2xl">
							Main
						</li>
						<span className="absolute left-0 top-9  h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
					</Link>
					<Link
						href="/genres"
						className="group relative inline-block text-blue-600"
					>
						<li className="font-normal text-white text-2xl hidden lg:inline">
							Genres
						</li>
						<span className="absolute left-0 top-9 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
					</Link>
				</ul>
			</nav>
			<div className="flex-10/12 ">
				<MovieSearchInput />
			</div>
			<div className=" font-normal text-white text-2xl hidden lg:inline">
				<AuthBtn />
			</div>
		</header>
	);
};

export default Header;
