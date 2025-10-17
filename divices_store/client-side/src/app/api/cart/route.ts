import { prisma } from "@/shared/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // для декодирования JWT
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



const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

export async function GET(req: NextRequest) {
    try {

        const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET });
        const userId: number | null =
            tokenPayload?.id ? Number(tokenPayload.id) :
                tokenPayload?.sub ? Number(tokenPayload.sub) :
                    null;

        // Для гостя — читаем cartToken
        const cartToken = userId ? null : req.cookies.get("cartToken")?.value;

        // Ищем корзину (приоритет userId)
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
                                product: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
        });

        // если корзины нет — создаём (и для гостя пометим, что нужно поставить cookie)
        let setCartCookieValue: string | null = null;
        if (!cart) {
            const newToken = userId ? undefined : crypto.randomUUID();
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
                                    product: { select: { id: true, name: true } },
                                },
                            },
                        },
                    },
                },
            });

            if (!userId && cart.token) setCartCookieValue = cart.token;
        }

        // Подготовим items и totalAmount
        const items = (cart?.items ?? []).map((item) => ({
            id: item.id,
            quantity: item.quantity,
            variation: item.variation,
        }));

        const totalAmount = items.reduce(
            (sum, item) => sum + ((item.variation?.price ?? 0) * item.quantity),
            0
        );

        // Формируем ответ и при необходимости ставим cookie
        const res = NextResponse.json({ items, totalAmount }, { headers: createCorsHeaders(req) });

        if (setCartCookieValue) {
            res.cookies.set("cartToken", setCartCookieValue, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30, // 30 дней
            });
        }

        return res;
    } catch (err: any) {
        console.error("❌ Ошибка получения корзины:", err);
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
