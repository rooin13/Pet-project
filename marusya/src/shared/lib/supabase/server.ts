import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()

    // Debug logging
    console.log('Server createClient:', {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        cookiesCount: allCookies.length,
        supabaseCookies: allCookies.filter(c => c.name.includes('supabase')).map(c => c.name)
    })

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server component - can't set cookies
                    }
                },
            },
        }
    )
}

