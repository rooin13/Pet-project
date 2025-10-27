import Header from "@/widgets/header/ui/Header";
import Footer from "@/widgets/footer/ui/Footer";
import { StoreProvider } from "@/providers/StoreProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { Play } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/lib/queryClient/queryProvider";

const play = Play({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={play.className}>
			<body className="flex m-auto justify-center bg-gradient-to-b from-[#0c1a2d] to-[#38384a] relative">
				{/* Global Video Background */}
				<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
					<video
						autoPlay
						loop
						muted
						playsInline
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
