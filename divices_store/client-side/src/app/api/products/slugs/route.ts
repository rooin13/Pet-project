// /app/api/products/all-slugs/route.ts
import { prisma } from "@/shared/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const products = await prisma.product.findMany({
        select: {
            name: true,
        },
    });

    return NextResponse.json(products);
}