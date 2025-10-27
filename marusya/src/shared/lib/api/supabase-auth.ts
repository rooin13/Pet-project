import { supabase } from '../supabase/client'

/**
 * Sign up with email and password
 * Supabase sends verification email automatically
 */
export async function signUpWithEmail(email: string, password: string, name?: string, surname?: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    name: name || '',
                    surname: surname || '',
                }
            }
        })

        if (error) throw error

        // Update profile with name and surname
        if (data.user && (name || surname)) {
            await supabase
                .from('profiles')
                .update({
                    name: name || '',
                    surname: surname || '',
                })
                .eq('id', data.user.id)
        }

        return { data, error: null }
    } catch (error) {
        console.error('Sign up error:', error)
        return { data: null, error }
    }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
    }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Google sign in error:', error)
        return { data: null, error }
    }
}


/**
 * Sign out
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return { user: null, profile: null, error }

    // Get profile with subscription info
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle() // Use maybeSingle() instead of single() - doesn't throw if no rows

    // If profile doesn't exist, create it
    if (!profile && !profileError) {
        const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{ id: user.id, email: user.email || '' }])
            .select()
            .single()

        return { user, profile: newProfile, error: null }
    }

    return { user, profile, error: null }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription() {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return false

        const { data } = await supabase
            .from('profiles')
            .select('has_subscription, subscription_end')
            .eq('id', user.id)
            .single()

        if (!data) return false

        return data.has_subscription && new Date(data.subscription_end) > new Date()
    } catch (error) {
        console.error('Subscription check error:', error)
        return false
    }
}

