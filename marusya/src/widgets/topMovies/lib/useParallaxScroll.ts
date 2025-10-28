import { useEffect, useRef, useState } from "react";

// когда эффект стартует
const START_OFFSET = 0.3;

// когда заканчивается
const END_OFFSET = 0.8;

// плавность движения (меньше = резче)
const SMOOTHING_POWER = 0.6;

export const useParallaxScroll = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                if (!sectionRef.current) {
                    ticking = false;
                    return;
                }

                const section = sectionRef.current;
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionHeight = rect.height;
                const windowHeight = window.innerHeight;

                const scrollStart = sectionTop - windowHeight * START_OFFSET;
                const scrollEnd = sectionTop + sectionHeight - windowHeight * END_OFFSET;
                const scrollRange = scrollEnd - scrollStart;
                const currentScroll = window.scrollY;

                let progress = (currentScroll - scrollStart) / scrollRange;
                progress = Math.max(0, Math.min(1, progress));

                const easeInOut = progress * progress * (3 - 2 * progress);
                const smoothProgress = Math.pow(
                    Math.sin(easeInOut * Math.PI),
                    SMOOTHING_POWER
                );

                setScrollProgress(smoothProgress);
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return { scrollProgress, sectionRef };
};

