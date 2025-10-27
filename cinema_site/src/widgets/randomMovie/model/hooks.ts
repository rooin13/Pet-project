import { useEffect, useState } from "react";
import { IMovie } from "@/entities/movie/model/types";
import { getRandomMovie } from "@/shared/lib/api/moviesApi";

// random movie with loading state (logic moved from UI!)
export const useRandomMovie = () => {
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRandomMovie = async () => {
        setMovie(null);  // clear old movie before loading new one
        setIsLoading(true);
        setError(null);

        try {
            const data = await getRandomMovie();
            setMovie(data);
        } catch (err) {
            console.error('Failed to fetch random movie:', err);
            setError('Failed to load movie');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomMovie();
    }, []);

    const refreshMovie = () => {
        fetchRandomMovie();
    };

    return {
        movie,
        isLoading,
        error,
        refreshMovie,
    };
};

/**
 * Hook for managing movie favorite status
 */
export function useMovieFavorite(
    movieId: number | undefined,
    isFavorite: (id: number) => Promise<boolean>
) {
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        if (!movieId) return;
        const checkFavorite = async () => {
            const fav = await isFavorite(movieId);
            setIsFav(fav);
        };
        checkFavorite();
    }, [movieId, isFavorite]);

    // Update local state after toggle
    const updateFavoriteStatus = (newStatus: boolean) => {
        setIsFav(newStatus);
    };

    return { isFav, updateFavoriteStatus };
}

/**
 * Hook for managing image/trailer display
 */
export function useMovieMedia(movieId: number | undefined) {
    const [imageLoading, setImageLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerLoading, setTrailerLoading] = useState(false);

    useEffect(() => {
        setImageLoading(true);
        setShowTrailer(false);
    }, [movieId]);

    return {
        imageLoading,
        setImageLoading,
        showTrailer,
        setShowTrailer,
        trailerLoading,
        setTrailerLoading,
    };
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeId(url: string | null): string | null {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
}

