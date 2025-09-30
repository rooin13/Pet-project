import { prisma } from "@/shared/lib/prisma/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const allProducts = await prisma.product.findMany()

    const response = NextResponse.json(allProducts)

    return NextResponse.json(response, {
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