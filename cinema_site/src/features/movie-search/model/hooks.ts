import { useEffect, useState } from "react";
import { IMovie } from "@/entities/movie/model/types";
import { getMovieByTitle } from "@/shared/lib/api/moviesApi";

// search with debounce + API call (logic moved from UI!)
export const useMovieSearchWithDebounce = (debounceMs: number = 300) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // debounce query
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [query, debounceMs]);

    // fetch movies when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setMovies([]);
            return;
        }

        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getMovieByTitle(debouncedQuery);
                const moviesArray = result ? (Array.isArray(result) ? result : [result]) : [];
                setMovies(moviesArray);
            } catch (err) {
                console.error('Movie search error:', err);
                setError('Failed to search movies');
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [debouncedQuery]);

    const updateQuery = (value: string) => {
        setQuery(value);
    };

    const clearSearch = () => {
        setQuery("");
        setMovies([]);
    };

    return {
        query,
        movies,
        isLoading,
        error,
        updateQuery,
        clearSearch,
    };
};

