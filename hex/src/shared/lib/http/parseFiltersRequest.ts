import { getFiltersFromUrl } from "@/features/filtration";
import { type Category } from "@/entities/filter";

export const parseFiltersRequest = (url: URL) => {
    const { query, page, limit, filters } = getFiltersFromUrl(url);

    return {
        category: query.toLowerCase() as Category,
        page,
        limit,
        filters,
    };
};
