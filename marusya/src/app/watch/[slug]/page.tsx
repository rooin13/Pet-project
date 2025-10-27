"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/features/auth/model/supabase-hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
	params: { slug: string };
}

export default function WatchPage({ params }: Props) {
	const { data: userData, isLoading } = useCurrentUser();
	const router = useRouter();

	const user = userData?.user;
	const profile = userData?.profile;

	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/");
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<p className="text-white text-2xl">Loading...</p>
			</div>
		);
	}

	if (!user || !profile?.has_subscription) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="text-center">
					<p className="text-white text-2xl mb-4">
						Subscription required
					</p>
					<Link
						href="/subscription"
						className="text-purple-400 hover:underline text-lg"
					>
						Get Premium
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-white mb-8">
					Coming Soon
				</h1>
				<p className="text-2xl text-white/70 mb-8">
					Video player is under development
				</p>
				<p className="text-white/50 mb-8">
					Movie: {decodeURIComponent(params.slug)}
				</p>
				<Link
					href="/"
					className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
}
