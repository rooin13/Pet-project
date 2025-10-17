import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    if (process.env.NODE_ENV === 'production') {
        // базовый CSP, скорректировать под домены CDN/Stripe
        res.headers.set('Content-Security-Policy', [
            "default-src 'self'",
            "img-src 'self' data: blob:",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self' https://api.stripe.com",
            "frame-src 'self' https://js.stripe.com",
        ].join('; '));
        // HSTS
        res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};


