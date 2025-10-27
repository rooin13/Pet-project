import { prisma } from "@/shared/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ALLOWED_ORIGINS = new Set([
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || '',
]);

export function createCorsHeaders(req: NextRequest) {
    const origin = req.headers.get('origin') || '';
    const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : '';
    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin',
    };
    if (allow) headers['Access-Control-Allow-Origin'] = allow;
    return headers;
}



const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET; // might be undefined for guests

export async function GET(req: NextRequest) {
    try {
        console.log('[cart.GET] start');
        const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET || undefined });
        const userId: number | null =
            tokenPayload?.id ? Number(tokenPayload.id) :
                tokenPayload?.sub ? Number(tokenPayload.sub) :
                    null;

        // for guests read cartToken
        const cartToken = userId ? null : req.cookies.get("cartToken")?.value;
        let cart = await prisma.cart.findFirst({
            where: {
                OR: [
                    userId ? { userId } : undefined,
                    cartToken ? { token: cartToken } : undefined,
                ].filter(Boolean) as any,
            },
            select: {
                id: true,
                token: true,
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        variation: {
                            select: {
                                id: true,
                                price: true,
                                product: { select: { id: true, name: true, slug: true, imagesUrl: true, description: true } },
                            },
                        },
                    },
                },
            },
        });

        // if no cart create one 
        let setCartCookieValue: string | null = null;
        if (!cart) {
            const newToken = userId ? undefined : crypto.randomUUID();
            console.log('[cart.GET] creating cart with', { userId, newToken });
            cart = await prisma.cart.create({
                data: {
                    userId: userId || undefined,
                    token: newToken,
                },
                select: {
                    id: true,
                    token: true,
                    items: {
                        select: {
                            id: true,
                            quantity: true,
                            variation: {
                                select: {
                                    id: true,
                                    price: true,
                                    product: { select: { id: true, name: true, slug: true, imagesUrl: true, description: true } },
                                },
                            },
                        },
                    },
                },
            });

            if (!userId && cart.token) setCartCookieValue = cart.token;
        }

        // prepare items and totalAmount
        const items = (cart?.items ?? []).map((item) => ({
            id: item.id,
            quantity: item.quantity,
            variation: item.variation,
        }));

        const totalAmount = items.reduce(
            (sum, item) => sum + ((item.variation?.price ?? 0) * item.quantity),
            0
        );

        // build response and set cookie if needed
        const res = NextResponse.json({ items, totalAmount }, { headers: createCorsHeaders(req) });
        if (!req.cookies.get('csrf-token')) {
            res.cookies.set('csrf-token', crypto.randomUUID(), {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24,
            });
        }

        if (setCartCookieValue) {
            res.cookies.set("cartToken", setCartCookieValue, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }
        return res;
    } catch (err: any) {
        return NextResponse.json(
            { items: [], totalAmount: 0, error: "Internal server error" },
            { status: 500, headers: createCorsHeaders(req) }
        );
    }
}

export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: createCorsHeaders(req),
    });
}
