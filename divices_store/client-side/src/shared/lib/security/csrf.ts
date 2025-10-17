import type { NextRequest } from 'next/server';

export function extractCsrfFromCookie(req: NextRequest): string | null {
    const raw = req.cookies.get('next-auth.csrf-token')?.value || '';
    // формат: token|hash
    const token = raw.split('|')[0];
    return token || null;
}

export function validateCsrf(req: NextRequest): boolean {
    const headerToken = req.headers.get('x-csrf-token') || req.headers.get('x-xsrf-token');
    const cookieToken = extractCsrfFromCookie(req);
    if (!headerToken || !cookieToken) return false;
    return headerToken === cookieToken;
}


