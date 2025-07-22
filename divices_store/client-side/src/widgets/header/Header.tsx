// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
"use client";

import { FC } from "react";

import Menu from "./menu/Menu";

import SliderSection from "../slider-section/ui/SliderSection";
import Us from "./us/Us";

const Header: FC = () => {
	return (
		<header className="bg-white ">
			<Us></Us>
			<Menu></Menu>
		</header>
	);
};

export default Header;
