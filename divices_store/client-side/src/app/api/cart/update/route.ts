import { NextApiRequestCookies } from "next/dist/server/api-utils";

import { prisma } from "@/shared/lib/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createCorsHeaders } from "../route";
import { validateCsrf } from '@/shared/lib/security/csrf';
import { z } from 'zod';

const UpdateSchema = z.object({ cartItemId: z.number().int().positive(), quantity: z.number().int().positive().max(50) });

export async function POST(req: NextRequest) {
    if (!validateCsrf(req)) {
        return NextResponse.json({ success: false, error: 'Invalid CSRF token' }, { status: 403, headers: createCorsHeaders(req) });
    }
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
