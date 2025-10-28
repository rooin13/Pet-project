import Header from "@/widgets/header/ui/Header";
import Footer from "@/widgets/footer/ui/Footer";
import { StoreProvider } from "@/providers/StoreProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { Play } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/lib/queryClient/queryProvider";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: "#8b5cf6",
};

export const metadata: Metadata = {
	metadataBase: new URL("https://marusya.app"),
	title: {
		default: "MARUSYA - Watch Movies & TV Shows Online",
		template: "%s | MARUSYA",
	},
	description:
		"Discover millions of movies and TV shows. Watch trailers, read reviews, and find your next favorite film.",
	keywords: ["movies", "tv shows", "cinema", "watch online", "streaming"],
	authors: [{ name: "MARUSYA" }],
	creator: "MARUSYA",
	publisher: "MARUSYA",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://marusya.app",
		siteName: "MARUSYA",
	},
	twitter: {
		card: "summary_large_image",
		site: "@marusya",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

const play = Play({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
	preload: true,
	fallback: ["system-ui", "arial"],
	adjustFontFallback: true,
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={play.className}>
			<head>
				<link rel="dns-prefetch" href="https://image.tmdb.org" />
				<link
					rel="preconnect"
					href="https://image.tmdb.org"
					crossOrigin="anonymous"
				/>
			</head>
			<body className="flex m-auto justify-center bg-gradient-to-b from-[#0c1a2d] to-[#38384a] relative">
				<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
					<video
						autoPlay
						loop
						muted
						playsInline
						preload="none"
						className="w-full h-full object-cover opacity-40"
					>
						<source
							src="/videos/Superman _ Official Trailer _ DC.mp4#t=30"
							type="video/mp4"
						/>
					</video>
					<div className="absolute inset-0 bg-black/40" />
				</div>

				<ReactQueryProvider>
					<StoreProvider>
						<LenisProvider>
							<div className="container lg:ml-15 lg:mr-15 relative z-10">
								<Header />
								<main>{children}</main>
								<Footer />
							</div>
						</LenisProvider>
					</StoreProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
