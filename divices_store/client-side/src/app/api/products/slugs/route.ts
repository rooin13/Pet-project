// /app/api/products/all-slugs/route.ts
import { prisma } from "@/shared/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const slugs = await prisma.product.findMany({
        select: { slug: true },
    });

    return NextResponse.json(slugs, {
        headers: { 'Cache-Control': 'public, max-age=300, s-maxage=600' },
    });
}