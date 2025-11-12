// src/features/filtration/model/hooks/useFiltersFromUrl.ts
import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { setFiltersFromUrl, setPriceRange } from "../slice";
import { getFiltersFromUrl } from "../utils/queryString";
import { usePathname, useSearchParams } from "next/navigation";
import { ParsedFilters } from "../types";

export function useFiltersFromUrl() {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!searchParams || typeof window === "undefined") return;

        const url = new URL(window.location.href);
        const parsed: ParsedFilters = getFiltersFromUrl(url);

        dispatch(setFiltersFromUrl(parsed.filters));
        dispatch(setPriceRange([parsed.minPrice, parsed.maxPrice]));
    }, [pathname, searchParams, dispatch]);

}
