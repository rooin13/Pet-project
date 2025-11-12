import { prisma } from "@/shared/lib/prisma/prisma";
import { type Category } from "@/entities/filter";
import { getFiltersFromUrl } from "../utils/queryString";
import { buildWhereClause, buildIncludeClause } from "../utils/filtersQuery";
import { ParsedFilters } from "../types";

type SortOption = "price-asc" | "price-desc" | "popular";

interface Params {
    url: URL;
}

export async function getFilteredProducts({ url }: Params) {
    const { query, page, limit, filters, sort, minPrice, maxPrice }: ParsedFilters = getFiltersFromUrl(url);

    const category = query.toLowerCase() as Category;
    const skip = (page - 1) * limit;

    // 🔹 Добавляем цену в where
    const where = {
        ...buildWhereClause(category, query, filters),
        price: {
            gte: minPrice,
            lte: maxPrice,
        },
    };

    // Отдаём только необходимые поля для листинга (без тяжёлых связей)
    const select = {
        id: true,
        name: true,
        slug: true,
        price: true,
        imagesUrl: true,
        brandId: true,
    } as const;

    let orderBy: { [key: string]: "asc" | "desc" } | undefined = undefined;

    if (sort === "price-asc") {
        orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
        orderBy = { price: "desc" };
    } else if (sort === "popular") {
        orderBy = { createdAt: "desc" };
    }

    const products = await prisma.product.findMany({
        where,
        select,
        orderBy,
        skip,
        take: limit,
    });

    return products;
}
