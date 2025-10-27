import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    getCurrentUser,
    hasActiveSubscription
} from '@/shared/lib/api/supabase-auth'

/**
 * Hook for user signup with email
 */
export function useSignUp() {
    return useMutation({
        mutationFn: ({ email, password, name, surname }: { email: string; password: string; name?: string; surname?: string }) =>
            signUpWithEmail(email, password, name, surname),
    })
}

/**
 * Hook for user signin with email
 */
export function useSignIn() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            signInWithEmail(email, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}

/**
 * Hook for Google OAuth signin
 */
export function useGoogleSignIn() {
    return useMutation({
        mutationFn: () => signInWithGoogle(),
    })
}


/**
 * Hook for user signout
 */
export function useSignOut() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => signOut(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}

/**
 * Hook for getting current user with profile
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook for checking subscription status
 */
export function useSubscription() {
    return useQuery({
        queryKey: ['subscription'],
        queryFn: hasActiveSubscription,
        staleTime: 60 * 1000, // 1 minute
    })
}


