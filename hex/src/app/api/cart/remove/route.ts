import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma"
import { createCorsHeaders } from "../route";
// CSRF не требуем для корзины (гость/юзер) — защита cookie+rate limit
import { getToken } from "next-auth/jwt";
import { z } from 'zod';

const RemoveSchema = z.object({ cartItemId: z.number().int().positive() });

export async function POST(req: NextRequest) {
    // простой rate limit по IP как в add
    const rateWindowMs = 10_000;
    const rateMax = 8;
    // хранение в модуле (на инстанс процесса)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.__cart_remove_hits = global.__cart_remove_hits || new Map();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ipHits: Map<string, { count: number; resetAt: number }> = global.__cart_remove_hits;
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();
    const rec = ipHits.get(ip) || { count: 0, resetAt: now + rateWindowMs };
    if (now > rec.resetAt) { rec.count = 0; rec.resetAt = now + rateWindowMs; }
    rec.count += 1; ipHits.set(ip, rec);
    if (rec.count > rateMax) {
        return NextResponse.json({ success: false, error: 'Too Many Requests' }, { status: 429, headers: createCorsHeaders(req) });
    }
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET; // может быть undefined для гостя
    const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET || undefined });
    const userId: number | null = tokenPayload?.id ? Number(tokenPayload.id) : tokenPayload?.sub ? Number(tokenPayload.sub) : null;
    // без CSRF
    const body = await req.json();
    const parsed = RemoveSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400, headers: createCorsHeaders(req) });
    }
    const { cartItemId } = parsed.data;

    // Поддержка гостя: если нет userId — используем cartToken из cookie
    const cartToken = userId ? null : req.cookies.get("cartToken")?.value || null;

    if (!userId && !cartToken) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: createCorsHeaders(req) });
    }

    // Удаляем только если cartItem принадлежит корзине текущего пользователя ИЛИ гостевой корзине с токеном
    const deleted = await prisma.cartItem.deleteMany({
        where: {
            id: cartItemId,
            cart: {
                OR: [
                    userId ? { userId } : undefined,
                    cartToken ? { token: cartToken } : undefined,
                ].filter(Boolean) as any,
            },
        },
    });

    if (deleted.count === 0) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404, headers: createCorsHeaders(req) });
    }

    return NextResponse.json({ success: true }, { headers: createCorsHeaders(req) });
}
