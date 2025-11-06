import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { StoreProvider } from "@/providers/StoreProvider";
import { Player } from "@/widgets/spotify/Player";
import "../globals.css";

export const metadata: Metadata = {
	title: "W-Wave Music Player",
	description: "Listen to millions of songs",
	icons: {
		icon: "/img/favicon.png",
	},
};

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!locales.includes(locale as any)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body>
				<StoreProvider>
					<NextIntlClientProvider messages={messages}>
						<div className="relative min-h-screen">
							{children}
							{/* Player persistent - никогда не размонтируется */}
							<Player />
						</div>
					</NextIntlClientProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
