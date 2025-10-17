import { NextApiRequestCookies } from "next/dist/server/api-utils";

import { prisma } from "@/shared/lib/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createCorsHeaders } from "../route";
// CSRF не требуем для корзины (гость/юзер) — защита cookie+rate limit
import { getToken } from "next-auth/jwt";
import { z } from 'zod';

const UpdateSchema = z.object({ cartItemId: z.number().int().positive(), quantity: z.number().int().positive().max(50) });

export async function POST(req: NextRequest) {
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
    const tokenPayload = await getToken({ req, secret: NEXTAUTH_SECRET });
    const userId: number | null = tokenPayload?.id ? Number(tokenPayload.id) : tokenPayload?.sub ? Number(tokenPayload.sub) : null;
    // без CSRF
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400, headers: createCorsHeaders(req) });
    }
    const { cartItemId, quantity } = parsed.data;

    const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });

    return NextResponse.json({ success: true, updatedItem }, { headers: createCorsHeaders(req) });
}
