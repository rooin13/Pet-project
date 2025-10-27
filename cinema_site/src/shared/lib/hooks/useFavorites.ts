import { useState, useCallback } from 'react';
import { useCurrentUser } from '@/features/auth/model/supabase-hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
    addFavorite,
    removeFavorite,
    isFavorite as checkIsFavorite
} from '../api/supabase-favorites';
import { useFavoritesList } from './useSupabaseFavorites';

export const useFavorites = () => {
    const { data: userData } = useCurrentUser();
    const { refetch } = useFavoritesList();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const user = userData?.user;

    const closeForm = useCallback(() => setIsOpen(false), []);
    const toggleForm = useCallback(() => setIsRegister((prev) => !prev), []);

    const isFavorite = useCallback(
        async (id: number) => {
            if (!user) return false;
            return await checkIsFavorite(id);
        },
        [user]
    );

    const handleFavoriteToggle = useCallback(
        async (id: number, title?: string) => {
            if (!user) {
                setIsOpen(true);
                return;
            }

            try {
                const isFav = await checkIsFavorite(id);

                if (isFav) {
                    await removeFavorite(id);
                } else {
                    await addFavorite(id, title || `Movie ${id}`);
                }

                // Refetch favorites list and invalidate cache
                refetch();
                queryClient.invalidateQueries({ queryKey: ['favorite', id] });
                queryClient.invalidateQueries({ queryKey: ['favorites'] });

                // Force re-render by returning the new status
                return !isFav;
            } catch (error) {
                console.error('Failed to toggle favorite:', error);
            }
        },
        [user, refetch, queryClient]
    );

    return {
        isFavorite,
        isOpen,
        isRegister,
        closeForm,
        toggleForm,
        handleFavoriteToggle,
    };
};
