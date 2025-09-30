import { NextApiRequestCookies } from "next/dist/server/api-utils";

import { prisma } from "@/shared/lib/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createCorsHeaders } from "../route";

export async function POST(req: NextRequest) {
    const { cartItemId, quantity } = await req.json();

    const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });

    return NextResponse.json({ success: true, updatedItem }, { headers: createCorsHeaders() });
}
