"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside";

export const Modal = ({
	isOpen,
	onClose,
	children,
	style,
}: {
	style?: string;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, onClose);
	if (!isOpen) return null;

	return createPortal(
		<div
			className={
				"fixed inset-0 bottom-full flex items-center justify-center z-400 w-full  h-full  " +
				style
			}
		>
			<div
				className="bg-white rounded-2xl w-full max-w-sm ref={ref}"
				ref={ref}
			>
				{children}
			</div>
		</div>,
		document.body
	);
};
