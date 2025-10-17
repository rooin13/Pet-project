import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // используем версию по умолчанию аккаунта или укажем стабильную из dashboard при необходимости
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        console.log("📦 Checkout body:", body);

        const { firstName, lastName, address, zipCode, cartItems } = body;

        if (
            !firstName ||
            !lastName ||
            !address ||
            !zipCode ||
            !Array.isArray(cartItems) ||
            cartItems.length === 0
        ) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 1️⃣ Создаём заказ в базе
        const totalAmount = cartItems.reduce((sum: number, item: any) => {
            const price = item.variation?.price ?? item.product?.price ?? 0;
            return sum + price * item.quantity;
        }, 0);

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                token: crypto.randomUUID(),
                totalAmount,
                items: cartItems,
                status: "PENDING",
            },
        });

        // 2️⃣ Создаём Stripe Checkout Session
        const line_items = cartItems.map((item: any) => {
            const price = item.variation?.price ?? item.product?.price ?? 0;
            return {
                price_data: {
                    currency: "usd",
                    product_data: { name: item.product?.name ?? "Product" },
                    unit_amount: Math.round(price * 100), // обязательно integer в центах
                },
                quantity: Number(item.quantity),
            };
        });

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user.email,
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${order.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${order.id}`,
            metadata: { orderId: order.id },
        });

        console.log("✅ Stripe session URL:", stripeSession.url);

        return NextResponse.json({ success: true, url: stripeSession.url });
    } catch (err) {
        console.error("Stripe checkout error:", err);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
