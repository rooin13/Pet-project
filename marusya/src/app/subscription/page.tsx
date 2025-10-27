"use client";

import { useState } from "react";
import { useCurrentUser } from "@/features/auth/model/supabase-hooks";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";

export default function SubscriptionPage() {
	const { data: userData, isLoading } = useCurrentUser();
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const user = userData?.user;

	const plans = [
		{
			id: "monthly",
			name: "Monthly",
			price: 19,
			duration: "1 month",
			popular: false,
		},
		{
			id: "quarterly",
			name: "Quarterly",
			price: 49,
			duration: "3 months",
			popular: true,
			savings: "Save $8",
		},
		{
			id: "yearly",
			name: "Yearly",
			price: 149,
			duration: "12 months",
			popular: false,
			savings: "Save $79",
		},
	];

	const handleSubscribe = async (planId: string, price: number) => {
		if (!user) {
			alert("Please login first");
			return;
		}

		setLoading(true);
		setSelectedPlan(planId);

		try {
			const response = await fetch("/api/stripe/create-checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId, price }),
				credentials: "include", // Important: send cookies
			});

			const { url } = await response.json();
			if (url) {
				window.location.href = url;
			}
		} catch (error) {
			console.error("Failed to create checkout:", error);
			alert("Failed to start payment. Please try again.");
		} finally {
			setLoading(false);
			setSelectedPlan(null);
		}
	};

	return (
		<div className="page-wrapper min-h-screen pb-20">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<Link
						href="/"
						className="cursor-pointer flex items-center gap-2 justify-center mb-8"
						aria-label="Go to homepage"
					>
						<Image
							src="/images/logo.svg"
							alt="MARUSYA logo"
							width={48}
							height={48}
						/>
						<h1 className="font-normal text-white text-5xl">
							marusya
						</h1>
					</Link>
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						Unlimited movies, TV shows, and more
					</h2>
					<p className="text-xl text-white/70">
						Watch anywhere. Cancel anytime.
					</p>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className={`relative rounded-2xl p-8 transition-all duration-300 ${
								plan.popular
									? "bg-gradient-to-b from-purple-600 to-purple-800 scale-105 shadow-2xl shadow-purple-500/50"
									: "bg-secondary hover:bg-gray-700"
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
									POPULAR
								</div>
							)}

							<div className="text-center mb-6">
								<h3 className="text-2xl font-bold text-white mb-2">
									{plan.name}
								</h3>
								<div className="flex items-baseline justify-center gap-2 mb-2">
									<span className="text-5xl font-bold text-white">
										${plan.price}
									</span>
									<span className="text-white/70">
										/{plan.duration}
									</span>
								</div>
								{plan.savings && (
									<p className="text-green-400 font-semibold">
										{plan.savings}
									</p>
								)}
							</div>

							<ul className="space-y-3 mb-8">
								<li className="flex items-center gap-2 text-white">
									<FaCheck className="text-green-400" />
									Unlimited movies & TV shows
								</li>
								<li className="flex items-center gap-2 text-white">
									<FaCheck className="text-green-400" />
									Watch on any device
								</li>
								<li className="flex items-center gap-2 text-white">
									<FaCheck className="text-green-400" />
									HD quality
								</li>
								<li className="flex items-center gap-2 text-white">
									<FaCheck className="text-green-400" />
									Cancel anytime
								</li>
							</ul>

							<button
								onClick={() =>
									handleSubscribe(plan.id, plan.price)
								}
								disabled={loading && selectedPlan === plan.id}
								className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 ${
									plan.popular
										? "bg-white text-purple-600 hover:bg-gray-100"
										: "bg-purple-600 text-white hover:bg-purple-700"
								} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								{loading && selectedPlan === plan.id
									? "Processing..."
									: "Subscribe Now"}
							</button>
						</div>
					))}
				</div>

				{/* Back Link */}
				<div className="text-center">
					<Link
						href="/"
						className="text-purple-400 hover:text-purple-300 text-lg hover:underline"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
