import { prisma } from "@/shared/lib/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGIN = "http://26.78.240.194:3000"

function createCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
}

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query") || ""

    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
        },
        take: 3,
    })

    // Возвращаем именно массив products и добавляем CORS-заголовки
    return NextResponse.json(products, {
        headers: { ...createCorsHeaders(), 'Cache-Control': 'public, max-age=30, s-maxage=120' },
    })
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: createCorsHeaders(),
    })
}
