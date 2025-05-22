"use client";
import { useRef } from "react";
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
	if (!isOpen) return null;
	return createPortal(
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div ref={ref} className="bg-white rounded p-4 w-full max-w-sm">
				{children}
			</div>
		</div>,
		document.body
	);
};
