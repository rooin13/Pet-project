import { userSchema } from "@/entities/user/model/schema"
import { prisma } from "@/shared/lib/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query") || ""

    const products = await prisma.product.findFirst({
        where: {
            name: {
                contains: query,
                mode: "insensitive"
            }
        },

    })


    return NextResponse.json(products, {
        headers: createCorsHeaders(),
    })
}

const ALLOWED_ORIGIN = "http://26.78.240.194:3000"

function createCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: createCorsHeaders(),
    })
}