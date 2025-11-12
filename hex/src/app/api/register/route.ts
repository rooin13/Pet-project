import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, password, name, surname } = await req.json();

        if (!email || !password || !name || !surname) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const cookieStore = await cookies();
        const cartToken = cookieStore.get("cartToken")?.value;

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: `${name} ${surname}`,
                role: "USER",
                verified: new Date(),
                cart: { create: {} },
            },
            include: { cart: true },
        });

        if (!newUser.cart) throw new Error("Cart was not created for the new user");

        if (cartToken) {
            const guestCart = await prisma.cart.findUnique({
                where: { token: cartToken },
                include: { items: true },
            });

            if (guestCart) {
                for (const item of guestCart.items) {
                    await prisma.cartItem.create({
                        data: {
                            cartId: newUser.cart.id,
                            variationId: item.variationId,
                            quantity: item.quantity,
                        },
                    });
                }

            }
        }

        const response = NextResponse.json({ id: newUser.id, email: newUser.email }, { status: 201 });


        return response;
    } catch (err: any) {
        console.error("Register error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
