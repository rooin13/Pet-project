"use client";

import { useState } from "react";
import { LoginForm } from "@/features/auth/LoginForm";
import { SignupForm } from "@/features/auth/SignupForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
	const [isSignup, setIsSignup] = useState(false);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* logo */}
				<div className="text-center mb-8">
					<Link href="/" className="inline-block">
						<Image
							src="/img/hedaer-logo.svg"
							alt="W-Wave"
							width={160}
							height={40}
							className="brightness-0 invert"
						/>
					</Link>
				</div>

				{/* auth card */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
					<h1 className="text-3xl font-bold text-white mb-2 text-center">
						{isSignup ? "Create Account" : "Welcome Back"}
					</h1>
					<p className="text-gray-400 text-center mb-8">
						{isSignup
							? "Sign up to start listening"
							: "Sign in to continue"}
					</p>

					{isSignup ? <SignupForm /> : <LoginForm />}

					<div className="mt-6 text-center">
						<button
							onClick={() => setIsSignup(!isSignup)}
							className="text-sm text-gray-400 hover:text-purple-400 transition"
						>
							{isSignup
								? "Already have an account? Sign in"
								: "Don't have an account? Sign up"}
						</button>
					</div>
				</div>

				{/* footer */}
				<p className="text-center text-gray-500 text-sm mt-8">
					By continuing, you agree to W-Wave's Terms of Service and
					Privacy Policy
				</p>
			</div>
		</div>
	);
}
