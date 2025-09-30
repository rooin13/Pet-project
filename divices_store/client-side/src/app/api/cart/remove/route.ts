import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma"
import { createCorsHeaders } from "../route";

export async function POST(req: NextRequest) {
    const { cartItemId } = await req.json();

    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });

    return NextResponse.json({ success: true }, { headers: createCorsHeaders(req) });
}
