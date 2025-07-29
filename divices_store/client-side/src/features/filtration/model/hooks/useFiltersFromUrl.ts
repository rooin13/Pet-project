"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFiltersFromUrl, setPriceRange, setSortBy, toggleOption } from "@/features/filtration/model/slice";

export const useFiltersFromUrl = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (!searchParams || initialized.current) return;

        const minPrice = Number(searchParams.get("minPrice")) || 0;
        const maxPrice = Number(searchParams.get("maxPrice")) || 1000;
        dispatch(setPriceRange([minPrice, maxPrice]));

        const sortBy = searchParams.get("sort");
        if (sortBy === "price-asc" || sortBy === "price-desc") {
            dispatch(setSortBy(sortBy));
        } else {
            dispatch(setSortBy(null));
        }

        const paramsMap: Record<string, string[]> = {};
        searchParams.forEach((value, key) => {
            if (key === "minPrice" || key === "maxPrice" || key === "sort") return;
            if (!paramsMap[key]) paramsMap[key] = [];
            paramsMap[key].push(value);
        });

        console.log("Filter params parsed from URL:", paramsMap);

        dispatch(setFiltersFromUrl(paramsMap)); // Устанавливаем фильтры целиком

        initialized.current = true;
    }, [searchParams, dispatch]);

};
