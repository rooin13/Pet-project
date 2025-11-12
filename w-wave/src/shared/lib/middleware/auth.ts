import { createClient } from "@/shared/lib/supabase/server";
import { AuthError } from "../errors";

// проверка авторизации для API routes
export async function requireAuth() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new AuthError("Authentication required");
    }

    return { user, supabase };
}

// опциональная авторизация (не выбрасывает ошибку)
export async function optionalAuth() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return { user, supabase };
}

