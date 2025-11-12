export interface FilterOption {
    field: string;
    title: string;
    label: string;
}

export interface FilterGroupProps {
    title: string;
    options: { label: string; value: string }[];
}


export type DelegateType = {
    findMany: (args: {
        where: any;
        distinct: string[];
        select: { name: true };
    }) => Promise<{ name: string }[]>;
};
const SORT_OPTIONS = ["popular", "price-asc", "price-desc"] as const;
export type SortOption = typeof SORT_OPTIONS[number];


export interface ParsedFilters {
    minPrice: number;
    maxPrice: number;

    query: string;
    page: number;
    limit: number;
    filters: Record<string, string[]>;
    sort: "price-asc" | "price-desc" | "popular";
}