import { supabase } from '../supabase/client'

/**
 * Update user profile (username, name, surname)
 */
export async function updateProfile(username?: string, name?: string, surname?: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const updates: any = {}
        if (username) updates.username = username
        if (name) updates.name = name
        if (surname) updates.surname = surname

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Update profile error:', error)
        return { data: null, error }
    }
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single()

        return !data // If no data → available
    } catch (error) {
        return true // On error assume available
    }
}

