import { cn } from "@/shared/lib/utils/cn";
import { Play } from "next/font/google";

const play = Play({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});
export default function CartLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Этот блок закроет фон body полностью */}
			<div
				className={cn(
					play.className,
					"fixed inset-0 bg-secondery -z-10"
				)}
			/>

			<div className="relative min-h-screen text-black">{children}</div>
		</>
	);
}
