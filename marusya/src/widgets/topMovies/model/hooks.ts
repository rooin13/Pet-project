import { useEffect, useState, useRef, RefObject } from "react";
import { getCuratedTopMovies } from "@/shared/lib/api/moviesApi";
import { IMovie } from "@/entities/movie/model/types";

export function useTopMovies() {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getCuratedTopMovies();
                setMovies(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch top movies:", error);
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return { movies, isLoading };
}

export function useScrollToTop(
    containerRef: RefObject<HTMLDivElement>,
    isLoading: boolean
) {
    useEffect(() => {
        if (!containerRef.current || isLoading) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.top < 0) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 100);
        }
    }, [isLoading, containerRef]);
}

export function useParallaxScroll(
    containerRef: RefObject<HTMLDivElement>,
    scrollContainerRef: RefObject<HTMLDivElement>,
    movies: IMovie[]
) {
    useEffect(() => {
        if (
            movies.length === 0 ||
            !containerRef.current ||
            !scrollContainerRef.current
        )
            return;

        const container = containerRef.current;
        const scrollContainer = scrollContainerRef.current;
        const columnSpeeds = [0.4, 0.6, 0.56, 0.32];

        let ticking = false;

        const updateParallax = () => {
            const rect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
            const viewportHeight = window.innerHeight;

            const columns =
                scrollContainer.querySelectorAll<HTMLElement>(
                    ".movie-column"
                );

            let maxColHeight = 0;
            columns.forEach((col) => {
                maxColHeight = Math.max(maxColHeight, col.scrollHeight);
            });

            const viewportH = scrollContainer.offsetHeight;
            const totalScrollNeeded = maxColHeight - viewportH;

            if (rect.top <= 0) {
                const scrolled = Math.abs(rect.top);
                const totalScroll = containerHeight - viewportHeight;
                const progress = Math.min(scrolled / totalScroll, 1);

                columns.forEach((col, index) => {
                    const speed = columnSpeeds[index];
                    const colHeight = col.scrollHeight;

                    let offset = 0;

                    if (progress <= 0.65) {
                        offset = -progress * totalScrollNeeded * speed * 1.54;
                    } else {
                        const offsetAt65 = -0.65 * totalScrollNeeded * speed * 1.54;
                        const fullScrollNeeded = colHeight - viewportH;
                        const remainingScroll = fullScrollNeeded - Math.abs(offsetAt65);
                        const remainingProgress = (progress - 0.65) / 0.35;
                        offset = offsetAt65 - remainingProgress * remainingScroll;
                    }

                    col.style.transform = `translateY(${offset}px)`;
                });
            }
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("scrollend", handleScroll, { passive: true });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        updateParallax();
                    }
                });
            },
            { threshold: 0 }
        );

        const nextElement = container.nextElementSibling;
        if (nextElement) {
            observer.observe(nextElement);
        }

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("scrollend", handleScroll);
            observer.disconnect();
        };
    }, [movies, containerRef, scrollContainerRef]);
}

