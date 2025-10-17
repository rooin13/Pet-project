import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma/prisma";

export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug) {
        return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imagesUrl: true,
            description: true,
            brand: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            variations: { select: { id: true, color: true, size: true, price: true } },
        },
    });

    if (!product) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(product, {
        headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
    });
}