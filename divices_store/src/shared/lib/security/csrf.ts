import type { NextRequest } from 'next/server';

export function extractCsrfFromCookie(req: NextRequest): string | null {
    // Пытаемся взять наш кастомный cookie
    const custom = req.cookies.get('csrf-token')?.value;
    if (custom) return custom;
    // Либо токен NextAuth (формат token|hash)
    const raw = req.cookies.get('next-auth.csrf-token')?.value || '';
    const token = raw.split('|')[0];
    return token || null;
}

export function validateCsrf(req: NextRequest): boolean {
    const headerToken = req.headers.get('x-csrf-token') || req.headers.get('x-xsrf-token');
    const cookieToken = extractCsrfFromCookie(req);
    if (!headerToken || !cookieToken) return false;
    return headerToken === cookieToken;
}


