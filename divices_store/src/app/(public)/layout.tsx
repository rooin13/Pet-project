import type { Metadata } from "next";
import {
	description,
	siteName,
	metadataBase,
} from "@/shared/lib/config/meta.config";

export const metadata: Metadata = {
	metadataBase,
	title: siteName,
	description: description,
	icons: {
		icon: "/favicon.ico",
	},
};

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex-1 mx-auto w-full max-w-[1800px] px-2 sm:px-3 md:px-4">
			<main className="relative pb-8" id="main">
				{children}
			</main>
		</div>
	);
}
