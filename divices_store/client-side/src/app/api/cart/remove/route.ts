import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma"
import { createCorsHeaders } from "../route";
import { validateCsrf } from '@/shared/lib/security/csrf';
import { z } from 'zod';

const RemoveSchema = z.object({ cartItemId: z.number().int().positive() });

export async function POST(req: NextRequest) {
    if (!validateCsrf(req)) {
        return NextResponse.json({ success: false, error: 'Invalid CSRF token' }, { status: 403, headers: createCorsHeaders(req) });
    }
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
