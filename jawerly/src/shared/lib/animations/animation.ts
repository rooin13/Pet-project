import { Variants } from "framer-motion";
export const listVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};


export const infoItemVariants: Variants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
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

// Контейнер для typewriter: задержка старта и между буквами
export const typewriterContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.01,    // задержка перед каждой буквой
            delayChildren: 0.2,       // небольшая задержка перед началом
        },
    },
};


// Отдельно для каждой буквы
export const typewriterLetter: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.1, ease: "easeOut" },
    },
};

// Для кнопок «подпрыгивание»
export const bounceButton: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 20,
            delay: 0.6,           // кнопки появятся чуть позже
        },
    },
};
