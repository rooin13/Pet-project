import "../globals.css";
import { Play } from "next/font/google";

import { StoreProvider } from "@/providers/StoreProvider";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/providers/QueryProvider";

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// import Footer from "@/widgets/footer/ui/Footer";

import { ModalRenderer } from "@/features/modal/ui/ModalRenderer";

import {
	description,
	siteName,
	metadataBase,
} from "@/shared/lib/config/meta.config";

import type { Metadata } from "next";
import SliderSection from "@/widgets/slider-section/ui/SliderSection";

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
		<QueryClientProvider client={queryClient}>
			<StoreProvider>
				<SliderSection></SliderSection>

				<div className="flex-1 container mx-auto px-6">
					<main className="relative pb-8" id="main">
						{children}

						<ModalRenderer />
					</main>
				</div>
			</StoreProvider>
		</QueryClientProvider>
	);
}
