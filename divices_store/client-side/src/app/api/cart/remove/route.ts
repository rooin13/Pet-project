import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma"
import { createCorsHeaders } from "../route";
// CSRF не требуем для корзины (гость/юзер) — защита cookie+rate limit
import { getToken } from "next-auth/jwt";
import { z } from 'zod';

const RemoveSchema = z.object({ cartItemId: z.number().int().positive() });

export async function POST(req: NextRequest) {
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
    const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET });
    const userId: number | null = tokenPayload?.id ? Number(tokenPayload.id) : tokenPayload?.sub ? Number(tokenPayload.sub) : null;
    // без CSRF
    const body = await req.json();
    const parsed = RemoveSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400, headers: createCorsHeaders(req) });
    }
    const { cartItemId } = parsed.data;

    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });

    return NextResponse.json({ success: true }, { headers: createCorsHeaders(req) });
}
