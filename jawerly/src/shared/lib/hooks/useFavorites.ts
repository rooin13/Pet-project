import { getUserProfileThunk, selectUser } from '@/entities/user/model/slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { useState, useCallback } from 'react';
import { deleteFavorites, postFavorites } from '../api/favorites-api/api';


export const useFavorites = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const closeForm = useCallback(() => setIsOpen(false), []);
    const toggleForm = useCallback(() => setIsRegister((prev) => !prev), []);

    const isFavorite = useCallback(
        async (id: number) => {

            const favorites = user.favorites.map(Number);
            if (favorites.includes(id)) {
                return true
            } else {
                return false
            }
        },
        [user.favorites]
    )

    const handleFavoriteToggle = useCallback(
        async (id: number) => {
            try {
                const favorites = user.favorites.map(Number);
                if (favorites.includes(id)) {
                    await deleteFavorites(id);
                } else {
                    await postFavorites(id);
                }
                dispatch(getUserProfileThunk());
            } catch (error) {
                setIsOpen(true);
            }
        },
        [user.favorites, dispatch]
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
