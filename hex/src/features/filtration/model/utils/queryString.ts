
import { ParsedFilters } from "../types";

export function getFiltersFromUrl(url: URL): ParsedFilters {
    const searchParams = url.searchParams;

    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = (searchParams.get("sort") || "popular") as ParsedFilters["sort"];
    const minPrice = Number(searchParams.get("minPrice") || "0");
    const maxPrice = Number(searchParams.get("maxPrice") || "1000");

    const filters: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
        if (["query", "page", "limit", "sort", "minPrice", "maxPrice"].includes(key)) continue;
        if (!filters[key]) filters[key] = [];
        filters[key].push(value);
    }

    return { query, page, limit, sort, filters, minPrice, maxPrice };
}

