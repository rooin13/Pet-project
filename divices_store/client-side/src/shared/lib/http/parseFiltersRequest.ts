import { getFiltersFromUrl } from "@/features/filtration/model/utils/queryString";
import { Category } from "@/entities/filter/config/filterFieldMap";

export const parseFiltersRequest = (url: URL) => {
    const { query, page, limit, filters } = getFiltersFromUrl(url);

    return {
        category: query.toLowerCase() as Category,
        page,
        limit,
        filters,
    };
};
