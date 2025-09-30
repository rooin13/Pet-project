import { prisma } from "@/shared/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // getToken корректно работает в route handlers
import { createCorsHeaders } from "../route";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || ""; // не оставляй default в продакшн

export async function POST(req: NextRequest) {
    try {
        const { variationId, quantity } = await req.json();

        if (!variationId || !quantity) {
            return NextResponse.json(
                { success: false, error: "variationId и quantity обязательны" },
                { status: 400, headers: createCorsHeaders(req) }
            );
        } try {

            const getAll = (req.cookies as any).getAll;
            const all = typeof getAll === "function" ? await getAll() : getAll;
            console.log("req.cookies.getAll():", all);
        } catch (e) {
            console.log("req.cookies.getAll() err", e);
        }

        const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET });

        console.log("getToken payload:", tokenPayload);
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
