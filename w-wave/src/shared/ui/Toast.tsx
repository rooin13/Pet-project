"use client";

import { useEffect } from "react";

interface ToastProps {
	message: string;
	type?: "error" | "warning" | "info" | "success";
	onClose: () => void;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export const Toast = ({
	message,
	type = "warning",
	onClose,
	duration = 5000,
	action,
}: ToastProps) => {
	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	const colors = {
		error: "bg-red-600",
		warning: "bg-yellow-600",
		info: "bg-blue-600",
		success: "bg-green-600",
	};

	return (
		<div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-9999 animate-in slide-in-from-bottom-5">
			<div
				className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 min-w-[320px] max-w-md`}
			>
				<div className="flex-1">
					<p className="text-sm font-medium">{message}</p>
				</div>
				{action && (
					<button
						onClick={() => {
							action.onClick();
							onClose();
						}}
						className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition shrink-0"
					>
						{action.label}
					</button>
				)}
				<button
					onClick={onClose}
					className="p-1 hover:bg-white/20 rounded transition shrink-0"
					aria-label="Close"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
