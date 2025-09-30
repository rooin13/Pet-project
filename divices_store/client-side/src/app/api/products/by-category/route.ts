// src/app/api/products/by-category/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getFilteredProducts } from "@/features/filtration/model/api/getFilteredProducts";

export async function GET(req: NextRequest) {
    const products = await getFilteredProducts({ url: req.nextUrl });

    return NextResponse.json(products, {
        headers: createCorsHeaders(),
    });
}

function createCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": "http://26.78.240.194:3000",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: createCorsHeaders(),
    });
}
