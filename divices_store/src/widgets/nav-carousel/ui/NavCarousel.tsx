import React from "react";
import HoverCarousel from "./Carousel";

const NavCorousel = () => {
	const items = ["EXPRESSION", "TREND", "ELEGANT", "FOR HIM", "PROMISING"];

	return (
		<div className="">
			<HoverCarousel items={items} />
		</div>
	);
};

export default NavCorousel;
