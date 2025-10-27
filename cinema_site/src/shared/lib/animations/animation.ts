import { Variants } from "framer-motion";
export const listVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.3,
        },
    },
};


export const infoItemVariants: Variants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};


export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.4,
            ease: "easeOut",
            delay: custom * 0.1,
        },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

// typewriter container: start delay and stagger between letters
export const typewriterContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.025,
            delayChildren: 0.4,
        },
    },
};

// individual letter animation
export const typewriterLetter: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: "easeOut" },
    },
};

// buttons bounce animation
export const bounceButton: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: 1.0,
        },
    },
};

// image fade in animation
export const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};
