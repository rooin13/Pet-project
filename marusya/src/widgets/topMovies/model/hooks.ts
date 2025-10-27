import { useEffect, useState, useRef, RefObject } from "react";
import { getCuratedTopMovies } from "@/shared/lib/api/moviesApi";
import { IMovie } from "@/entities/movie/model/types";

/**
 * Hook for fetching top movies
 */
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

/**
 * Hook for auto-scrolling to top if user reloaded page in the middle of Top Movies section
 */
export function useScrollToTop(
    containerRef: RefObject<HTMLDivElement>,
    isLoading: boolean
) {
    useEffect(() => {
        if (!containerRef.current || isLoading) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // If Top Movies section is visible on load - scroll to top
        if (rect.top < window.innerHeight && rect.top < 0) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 100);
        }
    }, [isLoading, containerRef]);
}

/**
 * Hook for parallax scroll effect with pinning
 */
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
        const columnSpeeds = [0.4, 0.6, 0.56, 0.32]; // Ideal speeds

        let ticking = false;

        const updateParallax = () => {
            const rect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
            const viewportHeight = window.innerHeight;

            const columns =
                scrollContainer.querySelectorAll<HTMLElement>(
                    ".movie-column"
                );

            // Find the height of the tallest column
            let maxColHeight = 0;
            columns.forEach((col) => {
                maxColHeight = Math.max(maxColHeight, col.scrollHeight);
            });

            const viewportH = scrollContainer.offsetHeight;
            const totalScrollNeeded = maxColHeight - viewportH;

            // Section is in viewport or scrolled past
            if (rect.top <= 0) {
                const scrolled = Math.abs(rect.top);
                const totalScroll = containerHeight - viewportHeight;
                const progress = Math.min(scrolled / totalScroll, 1); // Clamp to 1

                columns.forEach((col, index) => {
                    const speed = columnSpeeds[index];
                    const colHeight = col.scrollHeight;

                    let offset = 0;

                    if (progress <= 0.65) {
                        // 0-65%: Parallax - each column with its own speed
                        offset = -progress * totalScrollNeeded * speed * 1.54; // 1.54 = 1/0.65
                    } else {
                        // 65-100%: All columns move at the same speed for full display
                        // Position at 65%
                        const offsetAt65 =
                            -0.65 * totalScrollNeeded * speed * 1.54;

                        // Full scroll height needed for column (including padding)
                        const fullScrollNeeded = colHeight - viewportH;

                        // Remaining distance to fully display the entire column
                        const remainingScroll =
                            fullScrollNeeded - Math.abs(offsetAt65);

                        // Progress from 65% to 100%
                        const remainingProgress = (progress - 0.65) / 0.35;

                        // All move at the same speed to the end
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

        // Handle scrollend to ensure final position is correct
        window.addEventListener("scrollend", handleScroll, { passive: true });

        // IntersectionObserver for footer - lock final positions when footer appears
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Footer is visible - force final update
                        updateParallax();
                    }
                });
            },
            { threshold: 0 }
        );

        // Observe the element after Top Movies section (footer or next section)
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

