import { useEffect, useRef } from "react";

export const usePaginationObserver = (callback: () => void, isDisabled: boolean) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isDisabled) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) callback();
        }, {
            rootMargin: "200px",
        });

        const el = ref.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [callback, isDisabled]);

    return ref;
};
