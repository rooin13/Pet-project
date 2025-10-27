import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite as checkIsFavorite
} from '@/shared/lib/api/supabase-favorites'

/**
 * Hook for getting user's favorites
 */
export function useFavoritesList() {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const { data } = await getFavorites()
            return data
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

/**
 * Hook for adding to favorites
 */
export function useAddFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ movieId, movieTitle }: { movieId: number; movieTitle: string }) =>
            addFavorite(movieId, movieTitle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}

/**
 * Hook for removing from favorites
 */
export function useRemoveFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (movieId: number) => removeFavorite(movieId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}

/**
 * Hook for checking if movie is favorite
 */
export async function useFavoriteCheck(movieId: number) {
    return useQuery({
        queryKey: ['favorite', movieId],
        queryFn: () => checkIsFavorite(movieId),
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook for toggling favorite status
 */
export function useToggleFavorite() {
    const queryClient = useQueryClient()
    const addMutation = useAddFavorite()
    const removeMutation = useRemoveFavorite()

    const toggleFavorite = async (movieId: number, movieTitle: string) => {
        const isFav = await checkIsFavorite(movieId)

        if (isFav) {
            await removeMutation.mutateAsync(movieId)
        } else {
            await addMutation.mutateAsync({ movieId, movieTitle })
        }

        queryClient.invalidateQueries({ queryKey: ['favorites'] })
        queryClient.invalidateQueries({ queryKey: ['favorite', movieId] })
    }

    return { toggleFavorite, isLoading: addMutation.isPending || removeMutation.isPending }
}

