import "./globals.css";
import { Play } from "next/font/google";

import { StoreProvider } from "@/providers/StoreProvider";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/providers/QueryProvider";

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import Header from "@/widgets/header/Header";
// import Footer from "@/widgets/footer/ui/Footer";

import { ModalRenderer } from "@/features/modal/ui/ModalRenderer";

import { cn } from "@/shared/lib/utils/cn";

import {
	description,
	siteName,
	metadataBase,
} from "@/shared/lib/config/meta.config";

import type { Metadata } from "next";
import SliderSection from "@/widgets/slider-section/ui/SliderSection";
import ProgressBar from "@/providers/ProgressBar";
import { SessionProvider } from "next-auth/react";
import { Providers } from "@/providers/SessionProvider";
import Script from "next/script";

const play = Play({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const prisma = new PrismaClient().$extends(withAccelerate());

export const metadata: Metadata = {
	metadataBase,
	title: siteName,
	description: description,
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<Script
					src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA1D8zv4r59RhFZmCC04zQCU_hJivdqwr4&libraries=places`}
					strategy="beforeInteractive"
				/>
			</head>
			<body
				className={cn(
					play.className,
					"min-h-screen   bg-white bg-back"
				)}
			>
				<Providers>
					<QueryClientProvider client={queryClient}>
						<StoreProvider>
							<Header />
							<div className="relative">
								<ProgressBar />
							</div>

							{children}
						</StoreProvider>
					</QueryClientProvider>
				</Providers>
			</body>
		</html>
	);
}
