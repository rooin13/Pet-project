import Header from "@/widgets/header/ui/Header";
import { StoreProvider } from "@/providers/StoreProvider";
import { Play } from "next/font/google";
import "./globals.css";
import Footer from "@/widgets/footer/ui/Footer";

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
			<body className="flex m-auto justify-center  bg-gradient-to-b from-[#0c1a2d] to-[#38384a] ">
				<StoreProvider>
					<div className="container lg:ml-15 lg:mr-15">
						<Header />
						<main className="">{children}</main>
						<Footer />
					</div>
				</StoreProvider>
			</body>
		</html>
	);
}
