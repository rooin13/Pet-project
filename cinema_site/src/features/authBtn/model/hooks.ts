import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, postLoginUser, postRegisterUser, getLogoutUser } from '@/shared/lib/api/authApi/api';

// Хук для получения профиля пользователя
export function useUser() {
    return useQuery(['userProfile'], getUserProfile, {
        retry: false, // если не авторизован, ошибка не будет пытаться повториться
        staleTime: 1000 * 60 * 5, // кеш 5 минут
    });
}

// Хук для логина
export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation(postLoginUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(['userProfile']); // обновить профиль после логина
        },
    });
}

// Хук для регистрации
export function useRegister() {
    const queryClient = useQueryClient();
    return useMutation(postRegisterUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(['userProfile']); // обновить профиль после регистрации
        },
    });
}

// Хук для логаута
export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation(getLogoutUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(['userProfile']); // сбросить профиль после логаута
        },
    });
}
