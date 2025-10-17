import { prisma } from "@/shared/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // getToken корректно работает в route handlers
import { createCorsHeaders } from "../route";
import { z } from 'zod';
import { validateCsrf } from '@/shared/lib/security/csrf';
const rateWindowMs = 10_000;
const rateMax = 8;
const ipHits = new Map<string, { count: number; resetAt: number }>();

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is required');
}
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

const AddSchema = z.object({
    variationId: z.number().int().positive(),
    quantity: z.number().int().positive().max(50),
});

export async function POST(req: NextRequest) {
    try {
        if (!validateCsrf(req)) {
            return NextResponse.json({ success: false, error: 'Invalid CSRF token' }, { status: 403, headers: createCorsHeaders(req) });
        }
        // Простое rate limit по IP
        const ip = req.headers.get('x-forwarded-for') || 'local';
        const now = Date.now();
        const rec = ipHits.get(ip) || { count: 0, resetAt: now + rateWindowMs };
        if (now > rec.resetAt) {
            rec.count = 0;
            rec.resetAt = now + rateWindowMs;
        }
        rec.count += 1;
        ipHits.set(ip, rec);
        if (rec.count > rateMax) {
            return NextResponse.json({ success: false, error: 'Too Many Requests' }, { status: 429, headers: createCorsHeaders(req) });
        }
        const json = await req.json();
        const parsed = AddSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Invalid payload" },
                { status: 400, headers: createCorsHeaders(req) }
            );
        }
        const { variationId, quantity } = parsed.data;



        const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET });

        // do not log tokens in production
        const userId: number | null =
            tokenPayload?.id ? Number(tokenPayload.id) :
                tokenPayload?.sub ? Number(tokenPayload.sub) :
                    null;
        const cartToken = userId ? null : req.cookies.get("cartToken")?.value;

        let cart = await prisma.cart.findFirst({
            where: {
                OR: [
                    userId ? { userId } : undefined,
                    cartToken ? { token: cartToken } : undefined,
                ].filter(Boolean) as any,
            },
        });


        let setCartCookieValue: string | null = null;


        if (!cart) {
            const newToken = userId ? undefined : crypto.randomUUID();
            cart = await prisma.cart.create({
                data: {
                    userId: userId || undefined,
                    token: newToken,
                },
            });

            if (!userId && cart.token) {

                setCartCookieValue = cart.token;
            }
        }

        let cartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, variationId },
        });

        if (cartItem) {
            cartItem = await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity: cartItem.quantity + quantity },
            });
        } else {
            cartItem = await prisma.cartItem.create({
                data: { cartId: cart.id, variationId, quantity },
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        variation: {
                            include: { product: true },
                        },
                    },
                },
            },
        });

        const res = NextResponse.json({ success: true, cart: updatedCart }, { headers: createCorsHeaders(req) });
        if (setCartCookieValue) {
            res.cookies.set("cartToken", setCartCookieValue, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30,
            });
        }
        return res;
    } catch (err: any) {
        console.error("❌ Ошибка добавления в корзину:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
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
