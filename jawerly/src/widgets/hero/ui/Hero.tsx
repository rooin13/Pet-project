import NavCorousel from "@/features/nav-corousel/ui/NavCorousel";
import Button from "@/shared/ui/button/Button";
import React from "react";

export default function Hero() {
	return (
		<section className="hero flex flex-col relative">
			<div className="_container flex flex-col items-center">
				<NavCorousel></NavCorousel>
				<h1 className="text-white fs text-5xl text-center mb-20">
					Best Gift to Express your feeling to <br />
					your Loved Ones
				</h1>
				<Button disabled={false} link="https://www.example.com">
					VIEW MORE
				</Button>
			</div>
		</section>
	);
}
