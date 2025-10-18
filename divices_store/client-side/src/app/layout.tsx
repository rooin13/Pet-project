import "./globals.css";
import { Inter } from "next/font/google";
import AppClientProviders from "@/providers/AppClientProviders";
import Header from "@/widgets/header/Header";
import SliderSection from "@/widgets/slider-section/ui/SliderSection";
import { ModalRenderer } from "@/features/modal/ui/ModalRenderer";

import type { Metadata } from "next";

const inter = Inter({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "HEX Store",
	description:
		"Gaming equipment store - Shop gaming mice, keyboards, headphones, webcams and accessories",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "HEX Store - Gaming Equipment",
		description: "Shop premium gaming gear and accessories",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AppClientProviders>
					<Header />
					<SliderSection />
					<ModalRenderer />
					{children}
				</AppClientProviders>
			</body>
		</html>
	);
}
