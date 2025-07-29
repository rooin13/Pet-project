// pages/api/products/index.ts
import { prisma } from "@/shared/lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        minPrice = "0",
        maxPrice = "1000000",
        sort,
        ...filters
    } = req.query;

    try {
        const where: Prisma.ProductWhereInput = {
            price: {
                gte: Number(minPrice),
                lte: Number(maxPrice),
            },
            AND: Object.entries(filters).map(([field, value]) => ({
                [field]: {
                    in: Array.isArray(value) ? value : [value],
                },
            })),
        };

        const orderBy =
            sort === "price-asc"
                ? { price: "asc" as Prisma.SortOrder }
                : sort === "price-desc"
                    ? { price: "desc" as Prisma.SortOrder }
                    : undefined;

        const products = await prisma.product.findMany({
            where,
            orderBy,
        });

        return res.status(200).json(products);
    } catch (e) {
        console.error("[products API]", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}
