import { useEffect, useState, useRef, RefObject } from "react";
import { getCuratedTopMovies } from "@/shared/lib/api/moviesApi";
import type { IMovie } from "@/entities/movie";

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

// Parallax disabled per request

