import { prisma } from "@/shared/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_FILTER_FIELD_MAP, Category } from "@/entities/filter/config/fieldMap";
import { RelationKey } from "@/entities/filter/config/delegates";
import { getRelationKeyByLabel } from "@/entities/filter/lib/getRelationKeyByLabel";
import { RELATION_TYPE } from "@/features/filtration/model/config/relationType";

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    const query = url.searchParams.get("query") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const filters: Record<string, string[]> = {};
    for (const [key, value] of url.searchParams.entries()) {
        if (["query", "page", "limit"].includes(key)) continue;
        if (!filters[key]) filters[key] = [];
        filters[key].push(value);
    }

    // Базовое условие - фильтр по категории
    const where: any = {
        category: {
            name: {
                equals: query,
                mode: "insensitive",
            },
        },
    };

    const category = query.toLowerCase() as Category;


    const relationNameByLabel = getRelationKeyByLabel(category);


    const directFields = ["brandId", "price", "someOtherField"];

    for (const [label, values] of Object.entries(filters)) {
        const relationKey = Object.entries(CATEGORY_FILTER_FIELD_MAP[category] || {}).find(
            ([key, val]) => val === label
        )?.[0] as RelationKey | undefined;

        if (!relationKey) continue;

        const relationType = RELATION_TYPE[relationKey];

        where[relationKey] = relationType === "many"
            ? { some: { name: { in: values } } }
            : { name: { in: values } };
    }


    const products = await prisma.product.findMany({
        where,
        include: {
            category: true,
            variations: true,
            // Включи все связи, которые есть в мапе для данной категории,
            // чтобы Prisma подтягивал связанные данные
            ...Object.keys(CATEGORY_FILTER_FIELD_MAP[category] || {}).reduce(
                (acc, key) => {
                    acc[key] = true;
                    return acc;
                },
                {} as Record<string, boolean>
            ),
        },
        skip,
        take: limit,
    });

    return NextResponse.json(products, {
        headers: createCorsHeaders(),
    });
}

const ALLOWED_ORIGIN = "http://26.78.240.194:3000";

function createCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
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