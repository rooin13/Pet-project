import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set');
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeInstance;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
    userId: string,
    userEmail: string,
    planId: string,
    price: number
) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
        customer_email: userEmail,
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `MARUSYA Premium - ${getPlanName(planId)}`,
                        description: 'Unlimited movies, TV shows, and more',
                    },
                    unit_amount: price * 100, // Stripe uses cents
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId,
            planId,
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscription`,
    });

    return session;
}

function getPlanName(planId: string): string {
    const names: Record<string, string> = {
        monthly: '1 Month',
        quarterly: '3 Months',
        yearly: '12 Months',
    };
    return names[planId] || planId;
}

/**
 * Get subscription duration in months
 */
export function getPlanDuration(planId: string): number {
    const durations: Record<string, number> = {
        monthly: 1,
        quarterly: 3,
        yearly: 12,
    };
    return durations[planId] || 1;
}

