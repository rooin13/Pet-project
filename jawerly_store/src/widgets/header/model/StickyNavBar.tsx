import cx from "classnames";
import React from "react";

import { useStickyNavbarStatus } from "./useLayoutEffect";
import "./styles.css";
import CartMenu from "@/app/ui/CartMenu";
import BurgerMenu from "@/app/ui/Menu";

export interface StickyNavbarProps {
	children?: React.ReactNode;
	classNames?: {
		scrollTop?: string;
		scrollMiddle?: string;
		scrollBottom?: string;
		scrollUp?: string;
		scrollDown?: string;
	};
	showOnTop?: boolean;
	showOnBottom?: boolean;
	showOnScrollDown?: boolean;
	showOnScrollUp?: boolean;
	position?: "top";
	// animation?: "fade";
	zIndex?: number;
	duration?: number;
	// background?: string;
	stickyBackground?: string;
}

const StickyNavbar = ({
	children,
	classNames,
	showOnTop = true,
	showOnBottom = false,
	showOnScrollUp = true,
	showOnScrollDown = false,
	zIndex = 100,
	stickyBackground = "white",
	duration = 500,
}: StickyNavbarProps): JSX.Element => {
	const { isScrollTop, isScrollUp, isScrollBottom } = useStickyNavbarStatus();

	return (
		<nav
			className={cx(
				"sticky-navbar-nav",
				{
					"sticky-navbar-middle ": !isScrollTop && !isScrollBottom,
					"sticky-navbar-hidden":
						(!showOnTop && isScrollTop) ||
						(!(showOnTop && isScrollTop) &&
							!(showOnBottom && isScrollBottom) &&
							((!isScrollUp && !showOnScrollDown) ||
								(isScrollUp && !showOnScrollUp))) ||
						(!(showOnTop && isScrollTop) &&
							!showOnBottom &&
							isScrollBottom),
				},
				isScrollTop && classNames?.scrollTop,
				!isScrollTop && !isScrollBottom && classNames?.scrollMiddle,
				isScrollBottom && classNames?.scrollBottom,
				isScrollUp && classNames?.scrollUp,
				!isScrollUp && classNames?.scrollDown
			)}
			style={{
				zIndex,

				background: !isScrollTop ? stickyBackground : "transparent",
				transitionDuration: `${duration}ms`,
			}}
		>
			{children}
			<header className="w-full h-full z-40">
				<div className="_container mx-33 pt-3 flex justify-between items-center">
					<button>
						<BurgerMenu></BurgerMenu>
					</button>
					<img
						src="/images/logo.svg"
						style={{ display: !isScrollTop ? "none" : "flex" }}
						alt="Logo"
						className="logo"
					/>

					<img
						className="dark-logo "
						style={{ display: !isScrollTop ? "flex" : "none" }}
						src="//necklacesbysamaa.com/cdn/shop/files/SAMAA_LOGO_COLORS_2COLOR_TRNS_x55.png?v=1614343838"
					/>
					<CartMenu>
						<div className="cart">
							<svg
								width="26"
								height="31"
								viewBox="0 0 26 31"
								fill={`${!isScrollTop ? "#FFB08B" : "white"}`}
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M24.1811 24.5446V22.4047H8.45267C8.23868 22.4047 8.02469 22.2977 8.02469 22.2977C8.02469 22.1907 8.02469 21.9767 8.23868 21.7627L10.6996 19.5158L24.823 18.0179L26 7.31831H6.74074L4.92181 2.61049L0.534979 1.54053L0 3.57345L3.31687 4.32242L8.88066 18.2319L6.74074 20.1578C5.88477 20.9068 5.67078 22.0837 5.99177 23.0467C6.41975 24.0097 7.27572 24.5446 8.45267 24.5446H24.1811ZM7.59671 9.45822H23.5391L22.7901 16.092L10.8066 17.3759L7.59671 9.45822Z"
									fill={`${
										!isScrollTop ? "#FFB08B" : "white"
									}`}
								/>
								<path
									d="M8.66665 29.3595C9.61212 29.3595 10.3786 28.593 10.3786 27.6475C10.3786 26.7021 9.61212 25.9356 8.66665 25.9356C7.72117 25.9356 6.95471 26.7021 6.95471 27.6475C6.95471 28.593 7.72117 29.3595 8.66665 29.3595Z"
									fill={`${
										!isScrollTop ? "#FFB08B" : "white"
									}`}
								/>
								<path
									d="M23.2181 29.3595C24.1636 29.3595 24.93 28.593 24.93 27.6475C24.93 26.7021 24.1636 25.9356 23.2181 25.9356C22.2726 25.9356 21.5062 26.7021 21.5062 27.6475C21.5062 28.593 22.2726 29.3595 23.2181 29.3595Z"
									fill={`${
										!isScrollTop ? "#FFB08B" : "white"
									}`}
								/>
							</svg>
						</div>
					</CartMenu>
				</div>
			</header>
		</nav>
	);
};

export default StickyNavbar;
