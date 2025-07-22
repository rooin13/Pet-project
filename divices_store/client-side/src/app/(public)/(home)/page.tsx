import Image from "next/image";
import Link from "next/link";

import Button from "@/shared/ui/button/Button";
export const metadata = {
	title: "Hex",
	description: "Best gaming divices for u",
};

export default function Page() {
	return (
		<main className="">
			<div className="flex h-[79vh] w-full items-center justify-center">
				<h1 className="text-center text-9xl font-bold text-black">
					HEX
				</h1>
			</div>
		</main>
	);
}
