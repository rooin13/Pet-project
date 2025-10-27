import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPlanDuration } from '@/shared/lib/api/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
        console.error('Missing signature');
        return NextResponse.json(
            { error: 'Missing signature' },
            { status: 400 }
        );
    }

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json(
            { error: 'Stripe not configured' },
            { status: 500 }
        );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const { userId, planId } = session.metadata;

        if (!userId || !planId) {
            console.error('Missing metadata in session');
            return NextResponse.json({ received: true });
        }

        const durationMonths = getPlanDuration(planId);
        const subscriptionEnd = new Date();
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + durationMonths);

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                has_subscription: true,
                subscription_end: subscriptionEnd.toISOString(),
                stripe_customer_id: session.customer,
            })
            .eq('id', userId);

        if (error) {
            console.error('Failed to update subscription:', error);
        } else {
            console.log(`Subscription activated for user ${userId}`);
        }
    }

    return NextResponse.json({ received: true });
}

