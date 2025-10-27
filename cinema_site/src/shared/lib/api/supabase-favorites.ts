import { supabase } from '../supabase/client'

/**
 * Add movie to favorites
 */
export async function addFavorite(movieId: number, movieTitle: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('favorites')
            .insert([{
                user_id: user.id,
                movie_id: movieId,
                movie_title: movieTitle
            }])
            .select()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Add favorite error:', error)
        return { data: null, error }
    }
}

/**
 * Remove movie from favorites
 */
export async function removeFavorite(movieId: number) {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('movie_id', movieId)

        if (error) throw error
        return { error: null }
    } catch (error) {
        console.error('Remove favorite error:', error)
        return { error }
    }
}

/**
 * Get all user favorites
 */
export async function getFavorites() {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { data: [], error: null }

        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return { data: data || [], error: null }
    } catch (error) {
        console.error('Get favorites error:', error)
        return { data: [], error }
    }
}

/**
 * Check if movie is in favorites
 */
export async function isFavorite(movieId: number): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return false

        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('movie_id', movieId)
            .single()

        return !!data && !error
    } catch (error) {
        return false
    }
}

