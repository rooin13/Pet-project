import { useState, useEffect, useRef, useMemo } from "react";
import { Product } from "@prisma/client";

interface Filters {
    [key: string]: string[];
}

interface Params {
    categorySlug: string;
    filters: Filters;
    sortBy: "price-asc" | "price-desc" | "popular";
    limit?: number;
    priceRange: [number, number];
    initialized?: boolean; // проверка, что фильтры из URL подтянулись
}

export const usePaginatedProducts = ({
    categorySlug,
    filters,
    sortBy,
    limit = 12,
    priceRange,
    initialized = true,
}: Params) => {
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastBatchStart, setLastBatchStart] = useState(0);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);

    // 🧠 Мемоизируем параметры запроса
    const searchParams = useMemo(() => {
        const params = new URLSearchParams();
        params.set("sort", sortBy);
        params.set("query", categorySlug);
        params.set("limit", String(limit));
        params.set("page", String(page));
        params.set("minPrice", String(priceRange[0]));
        params.set("maxPrice", String(priceRange[1]));

        Object.entries(filters).forEach(([key, values]) => {
            values.forEach(val => params.append(key, val));
        });

        return params.toString();
    }, [categorySlug, filters, sortBy, page, limit, priceRange]);

    // ⚠️ Сброс при смене фильтров или цены
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setLastBatchStart(0);
    }, [categorySlug, JSON.stringify(filters), sortBy, JSON.stringify(priceRange)]);

    // 🚀 Получение данных
    useEffect(() => {
        if (!initialized) return; // не fetch пока фильтры/цена не подтянулись
        if (!hasMore) return;
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        setIsLoading(true);
        setIsError(false);

        const controller = new AbortController();
        fetch(`/api/products/by-category?${searchParams}`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load products");
                return res.json();
            })
            .then((newProducts: Product[]) => {
                setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
                if (newProducts.length < limit) setHasMore(false);
                setLastBatchStart(page === 1 ? 0 : products.length);
                // не увеличиваем страницу автоматически — следующий fetch по intersect
            })
            .catch((e) => {
                if (e?.name !== 'AbortError') setIsError(true);
            })
            .finally(() => {
                isFetchingRef.current = false;
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [searchParams, page, hasMore, initialized]);

    // 📦 Инфини скролл
    useEffect(() => {
        if (isLoading || !hasMore) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setPage(p => p + 1);
            },
            { threshold: 1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [isLoading, hasMore]);

    return { products, isLoading, isError, hasMore, observerRef, lastBatchStart };
};
