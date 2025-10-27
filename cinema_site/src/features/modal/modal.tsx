"use client";

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside";

export const Modal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, onClose);

	// close on Escape key + prevent body scroll without layout shift
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			// calculate scrollbar width
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;

			// prevent scroll but compensate for scrollbar width
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollbarWidth}px`;

			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
			document.body.style.paddingRight = "0px";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return createPortal(
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
		>
			<div ref={ref} className="bg-white rounded-2xl p-4 w-full max-w-sm">
				{children}
			</div>
		</div>,
		document.body
	);
};
