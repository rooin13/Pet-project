import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, postLoginUser, postRegisterUser, getLogoutUser } from '@/shared/lib/api/authApi/api';

// Хук для получения профиля пользователя
export function useUser() {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

// Хук для логина
export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postLoginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}

// Хук для регистрации
export function useRegister() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postRegisterUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}

// Хук для логаута
export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: getLogoutUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}
