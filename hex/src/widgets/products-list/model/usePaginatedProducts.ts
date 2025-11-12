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
    const controllerRef = useRef<AbortController | null>(null);

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

        const sp = params.toString();
        console.log('[usePaginatedProducts] build searchParams', {
            categorySlug,
            filters,
            sortBy,
            page,
            limit,
            priceRange,
            sp,
        });
        return sp;
    }, [categorySlug, filters, sortBy, page, limit, priceRange]);

    // Базовые параметры (без page) — для детерминированного сброса
    const baseParams = useMemo(() => {
        const params = new URLSearchParams();
        params.set("sort", sortBy);
        params.set("query", categorySlug);
        params.set("limit", String(limit));
        params.set("minPrice", String(priceRange[0]));
        params.set("maxPrice", String(priceRange[1]));
        Object.entries(filters).forEach(([key, values]) => {
            values.forEach(val => params.append(key, val));
        });
        return params.toString();
    }, [categorySlug, filters, sortBy, limit, priceRange]);

    // ⚠️ Сброс при смене фильтров или цены
    useEffect(() => {
        if (!initialized) return;
        console.log('[usePaginatedProducts] reset on baseParams change', { baseParams });
        // отменяем текущий запрос если есть
        try { controllerRef.current?.abort(); } catch { }
        isFetchingRef.current = false;
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setLastBatchStart(0);
    }, [baseParams, initialized]);

    // 🚀 Получение данных
    useEffect(() => {
        if (!initialized) return; // не fetch пока фильтры/цена не подтянулись
        if (!hasMore) return;
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        setIsLoading(true);
        setIsError(false);

        const controller = new AbortController();
        controllerRef.current = controller;
        const url = `/api/products/by-category?${searchParams}`;
        console.log('[usePaginatedProducts] fetch start', { url, page });
        fetch(url, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load products");
                return res.json();
            })
            .then((newProducts: Product[]) => {
                console.log('[usePaginatedProducts] fetch success', { count: newProducts.length, page });
                setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
                if (newProducts.length < limit) setHasMore(false);
                setLastBatchStart(prev => (page === 1 ? 0 : prev));
                // после загрузки первой страницы переключаемся на page=2
                if (page === 1 && newProducts.length > 0) {
                    console.log('[usePaginatedProducts] setPage -> 2 after first load');
                    setPage(2);
                }
            })
            .catch((e) => {
                if (e?.name !== 'AbortError') {
                    console.log('[usePaginatedProducts] fetch error', e);
                    setIsError(true);
                }
            })
            .finally(() => {
                isFetchingRef.current = false;
                setIsLoading(false);
                console.log('[usePaginatedProducts] fetch end', { pageNext: page });
            });

        return () => controller.abort();
    }, [searchParams, page, hasMore, initialized]);

    // 📦 Инфини скролл
    useEffect(() => {
        if (isLoading || !hasMore) return;
        // Не даём наблюдателю инкрементить во время первой загрузки (page=1)
        if (page <= 1) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    console.log('[usePaginatedProducts] observer intersect -> increment page');
                    setPage(p => p + 1);
                }
            },
            { threshold: 1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [isLoading, hasMore, page]);

    return { products, isLoading, isError, hasMore, observerRef, lastBatchStart };
};
