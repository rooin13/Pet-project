import { useState, useCallback } from "react";

export const useMobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openMenu = useCallback(() => {
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflow = "";
    }, []);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);

        if (!isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    return {
        isOpen,
        openMenu,
        closeMenu,
        toggleMenu,
    };
};

