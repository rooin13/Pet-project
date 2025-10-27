"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

function SuccessContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					router.push("/");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

	return (
		<div className="page-wrapper min-h-screen flex items-center justify-center">
			<div className="max-w-2xl mx-auto text-center">
				{/* Logo */}
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-2 justify-center mb-8"
				>
					<Image
						src="/images/logo.svg"
						alt="MARUSYA logo"
						width={48}
						height={48}
					/>
					<h1 className="font-normal text-white text-5xl">marusya</h1>
				</Link>

				{/* Success Icon */}
				<FaCheckCircle className="text-green-500 text-8xl mx-auto mb-8" />

				{/* Success Message */}
				<h2 className="text-4xl font-bold text-white mb-4">
					Payment Successful!
				</h2>
				<p className="text-xl text-white/70 mb-8">
					Welcome to MARUSYA Premium! 🎉
				</p>

				<div className="bg-secondary rounded-2xl p-8 mb-8">
					<p className="text-white text-lg mb-4">
						Your subscription is now active. Enjoy unlimited access
						to thousands of movies and TV shows!
					</p>
					<p className="text-white/60">
						Redirecting to homepage in{" "}
						<span className="text-purple-400 font-bold">
							{countdown}
						</span>{" "}
						seconds...
					</p>
				</div>

				<Link
					href="/"
					className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
				>
					Start Watching Now
				</Link>
			</div>
		</div>
	);
}

export default function SubscriptionSuccessPage() {
	return (
		<Suspense
			fallback={
				<div className="page-wrapper min-h-screen flex items-center justify-center">
					<p className="text-white text-2xl">Loading...</p>
				</div>
			}
		>
			<SuccessContent />
		</Suspense>
	);
}
