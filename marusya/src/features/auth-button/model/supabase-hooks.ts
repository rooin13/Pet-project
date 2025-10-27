import { useState } from 'react';
import { useCurrentUser, useSignOut, useSignIn, useSignUp, useGoogleSignIn } from '@/features/auth/model/supabase-hooks';

/**
 * Hook for managing auth modal state
 */
export function useAuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const openLoginForm = () => {
        setIsRegister(false);
        setIsOpen(true);
    };

    const openRegisterForm = () => {
        setIsRegister(true);
        setIsOpen(true);
    };

    const closeForm = () => setIsOpen(false);

    const toggleForm = () => setIsRegister((prev) => !prev);

    return {
        isOpen,
        isRegister,
        openLoginForm,
        openRegisterForm,
        closeForm,
        toggleForm,
    };
}

/**
 * Re-export Supabase hooks for convenience
 */
export { useCurrentUser as useUser, useSignOut as useLogout, useSignIn as useLogin, useSignUp as useRegister, useGoogleSignIn };

