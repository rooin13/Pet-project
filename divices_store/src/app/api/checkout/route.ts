import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Stripe from "stripe";
import { validateCsrf } from '@/shared/lib/security/csrf';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // версия API по умолчанию
});

export async function POST(req: NextRequest) {
    try {
        // проверяем авторизацию пользователя
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            // для неавторизованных пользователей проверяем CSRF токен
            if (!validateCsrf(req)) {
                return NextResponse.json({ success: false, error: 'Invalid CSRF token' }, { status: 403 });
            }
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { firstName, lastName, email, phone, address, city, state, zipCode, country, cartItems } = body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !address ||
            !city ||
            !zipCode ||
            !country ||
            !Array.isArray(cartItems) ||
            cartItems.length === 0
        ) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // пересчитываем цены на основе данных из базы
        // обрабатываем данные от клиента
        const items = (cartItems as any[]).map((i) => ({
            variationId: i.variationId ?? i.variation?.id ?? null,
            productId: i.productId ?? i.product?.id ?? i.variation?.product?.id ?? null,
            quantity: Number(i.quantity) || 0,
        })) as Array<{ variationId: number | null; productId: number | null; quantity: number }>;

        const variationIds = items.filter(i => i.variationId).map(i => Number(i.variationId));
        const productIds = items.filter(i => i.productId && !i.variationId).map(i => Number(i.productId));

        const [variations, products] = await Promise.all([
            variationIds.length
                ? prisma.variation.findMany({
                    where: { id: { in: variationIds } },
                    select: { id: true, price: true, product: { select: { name: true, price: true } } },
                })
                : Promise.resolve([]),
            productIds.length
                ? prisma.product.findMany({
                    where: { id: { in: productIds } },
                    select: { id: true, price: true, name: true },
                })
                : Promise.resolve([]),
        ]);

        const variationMap = new Map(variations.map(v => [v.id, v]));
        const productMap = new Map(products.map(p => [p.id, p]));

        const line_items = items.map((item) => {
            let unit = 0;
            let name = 'Product';
            if (item.variationId) {
                const v = variationMap.get(Number(item.variationId));
                unit = (v?.price ?? v?.product.price ?? 0);
                name = v?.product.name ?? name;
            } else if (item.productId) {
                const p = productMap.get(Number(item.productId));
                unit = p?.price ?? 0;
                name = p?.name ?? name;
            }
            // если не нашли в базе, берем данные от клиента
            if (!unit) {
                const fallbackVar = (cartItems as any[]).find(ci => (ci.variationId ?? ci.variation?.id ?? null) === item.variationId);
                const fallbackProd = (cartItems as any[]).find(ci => (ci.productId ?? ci.product?.id ?? ci.variation?.product?.id ?? null) === item.productId);
                const f = fallbackVar || fallbackProd || {} as any;
                unit = Number(f?.variation?.price ?? f?.product?.price ?? 0) || 0;
                name = String(f?.product?.name ?? f?.variation?.product?.name ?? name);
            }
            return {
                price_data: {
                    currency: "usd",
                    product_data: { name },
                    unit_amount: Math.round(unit * 100),
                },
                quantity: Number(item.quantity),
            };
        });

        const totalAmount = Math.round(line_items.reduce((sum, li) => sum + (li.price_data.unit_amount / 100) * li.quantity, 0));

        if (process.env.NODE_ENV === 'development') {
            console.log("📦 Creating order with data:", {
                userId: user.id,
                totalAmount,
                itemsCount: items.length,
                billing: { firstName, lastName, email, city, country },
            });
        }

        const order = await prisma.order.create({
            data: {
                user: {
                    connect: { id: user.id }
                },
                token: globalThis.crypto.randomUUID(),
                totalAmount,
                items: items as any,
                status: "PENDING",
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone && phone.trim() !== "" ? phone.trim() : null,
                address: address.trim(),
                city: city.trim(),
                state: state && state.trim() !== "" ? state.trim() : null,
                zipCode: zipCode.trim(),
                country: country.trim(),
            },
        });

        // создаем сессию Stripe для оплаты
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user.email,
            line_items,
            success_url: `${appUrl}/order-success?orderId=${order.id}`,
            cancel_url: `${appUrl}/checkout?orderId=${order.id}`,
            metadata: { orderId: String(order.id) },
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log("✅ Stripe session URL:", stripeSession.url);
        }

        return NextResponse.json({ success: true, url: stripeSession.url });
    } catch (err: any) {
        console.error("❌ Checkout error:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);

        // детальная ошибка для отладки
        const errorMessage = process.env.NODE_ENV === 'development'
            ? err.message
            : "Server error";

        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}
