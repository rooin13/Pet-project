"use client";

import React, { useMemo } from "react";

import Button from "@/shared/ui/button/Button";
import dynamic from "next/dynamic";
import { HeroSection } from "@/widgets/hero/HeroSection";
import Footer from "@/widgets/footer/footer";

const Scroll3DSection = dynamic(
	() => import("@/widgets/keyboard-scene/KeyboardScene"),
	{
		ssr: false,
	}
);

export default function Page() {
	const marginStyle1 = useMemo(
		() => ({
			marginLeft: "calc(50% - 50.4vw)",
			marginRight: "calc(50% - 49.6vw)",
		}),
		[]
	);

	const marginStyle2 = useMemo(
		() => ({
			marginLeft: "calc(50% - 50.4vw)",
			marginRight: "calc(50% - 50vw)",
		}),
		[]
	);

	const productsSectionStyle = useMemo(
		() => ({
			marginLeft: "calc(50% - 50.4vw)",
			marginRight: "calc(50% - 49.6vw)",
			background: "linear-gradient(to bottom, black, white)",
		}),
		[]
	);

	return (
		<main>
			<section style={marginStyle1}>
				<div className="relative md:h-[76vh] h-[45vh] w-full flex flex-col items-center justify-center overflow-hidden">
					<div
						className="absolute inset-0 -z-20 scale-y-[100]"
						style={{
							backgroundImage: "url('/images/virus.webp')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							filter: "grayscale(150%)",
						}}
					/>

					<div
						className="absolute inset-0 -z-10"
						style={{
							background:
								"linear-gradient(to top, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0))",
						}}
					/>

					<div>
						<h1 className="text-center text-9xl font-bold mt-25 text-black mb-4 md:mb-30">
							HEX
						</h1>
					</div>
					<div className="flex items-center justify-center">
						<Button classname="mb-20  bg-secondary">
							Shop Now
						</Button>
					</div>
				</div>
			</section>

			<section
				id="keyboard-section"
				className="relative h-[100vh] md:h-[190vh] pb-0 md:pb-50 pt-25  md:pt-50 bg-black w-screen overflow-hidden"
				style={marginStyle2}
			>
				<Scroll3DSection />
			</section>

			<HeroSection />

			<Footer />
		</main>
	);
}
