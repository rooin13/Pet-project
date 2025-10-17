// src/app/api/products/by-category/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getFilteredProducts } from "@/features/filtration/model/api/getFilteredProducts";

export async function GET(req: NextRequest) {
    const products = await getFilteredProducts({ url: req.nextUrl });

    return NextResponse.json(products, {
        headers: {
            ...createCorsHeaders(req),
            'Cache-Control': 'public, max-age=30, s-maxage=60',
        },
    });
}

const ALLOWED_ORIGINS = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL || '',
]);

function createCorsHeaders(req: NextRequest) {
    const origin = req.headers.get('origin') || '';
    const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : '';
    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
    };
    if (allow) headers['Access-Control-Allow-Origin'] = allow;
    return headers;
}

export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: createCorsHeaders(req),
    });
}
