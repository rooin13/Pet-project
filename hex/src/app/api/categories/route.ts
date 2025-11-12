
import { prisma } from "@/shared/lib/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories, {
        headers: { ...createCorsHeaders(), 'Cache-Control': 'public, max-age=300, s-maxage=600' },
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