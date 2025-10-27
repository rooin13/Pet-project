import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/shared/lib/api/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { planId, price } = await request.json();

        // Get cookies from Next.js
        const cookieStore = cookies();
        const allCookies = cookieStore.getAll();

        // Debug: check what cookies we have
        console.log('All cookies:', {
            count: allCookies.length,
            names: allCookies.map(c => c.name),
            supabaseCookies: allCookies.filter(c => c.name.includes('supabase'))
        });

        // Create Supabase client with proper cookie handling
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) {
                            // Handle error
                        }
                    },
                },
            }
        );

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        // Debug logging
        console.log('Auth check:', {
            hasUser: !!user,
            userError: userError?.message,
            userId: user?.id,
            userEmail: user?.email,
            hasCookies: !!request.headers.get('cookie')
        });

        if (userError || !user) {
            console.error('Auth failed:', userError);
            return NextResponse.json(
                { error: 'Unauthorized', details: userError?.message },
                { status: 401 }
            );
        }

        // Create Stripe checkout session
        const session = await createCheckoutSession(
            user.id,
            user.email!,
            planId,
            price
        );

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}

