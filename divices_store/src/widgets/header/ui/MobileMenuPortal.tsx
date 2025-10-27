"use client";

import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MobileMenu } from "./MobileMenu";

interface MobileMenuPortalProps {
	isOpen: boolean;
	onClose: () => void;
	ignoreRef?: React.RefObject<HTMLElement>;
}

export const MobileMenuPortal: FC<MobileMenuPortalProps> = ({
	isOpen,
	onClose,
	ignoreRef,
}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return createPortal(
		<MobileMenu isOpen={isOpen} onClose={onClose} ignoreRef={ignoreRef} />,
		document.body
	);
};
