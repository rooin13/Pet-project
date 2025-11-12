"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useWatchFilters = () => {
    const router = useRouter();
    const { priceRange, selectedOptions, sortBy } = useSelector(
        (state: RootState) => state.filters
    );

    useEffect(() => {
        const params = new URLSearchParams();

        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());

        Object.entries(selectedOptions).forEach(([field, values]) => {
            values.forEach((val) => {
                params.append(field, val);
            });
        });

        if (sortBy) params.set("sort", sortBy);

        router.push(`?${params.toString()}`, { scroll: false });
    }, [priceRange, selectedOptions, sortBy]);
};
