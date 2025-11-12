"use client";

import { useEffect } from "react";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	// close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-gray-900/90 backdrop-blur-md p-6 max-w-md w-full mx-4 border border-white/10"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};
