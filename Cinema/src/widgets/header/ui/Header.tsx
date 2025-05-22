"use client";
import { MovieSearchInput } from "@/features/movieSearch/ui/MovieSearchInput";
import { AuthBtn } from "@/features/authBtn/ui/Authbtn";

const Header = () => {
	return (
		<header className="pt-7 pb-7   items-center relative  justify-between flex space-x-20">
			<div className=" [border-bottom-style:solid] inline-flex items-center gap-2 px-0 py-2 relative ">
				<img
					className="relative  mb-[-2.24px] ml-[-2.98px]"
					src=""
					alt="logo"
				/>
				<p className=" font-normal text-white text-3xl">marusya</p>
			</div>
			<nav className="flex-1/6">
				<ul className="flex space-x-9 ">
					<li className=" font-normal text-white text-2xl">Main</li>
					<li className=" font-normal text-white text-2xl">Genre</li>
				</ul>
			</nav>
			<div className="flex-10/12">
				<MovieSearchInput />
			</div>
			<div className=" font-normal text-white text-2xl">
				<AuthBtn />
			</div>
		</header>
	);
};

export default Header;
