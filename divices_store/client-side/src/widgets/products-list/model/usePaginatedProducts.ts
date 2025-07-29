import { useEffect, useRef, useState } from "react";
import { Api } from "@/shared/lib/api/client/client";
import { Product } from "@prisma/client";

type Filters = Record<string, string[]>;

export const usePaginatedProducts = (
    slug: string,
    filters: Filters = {}
) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastBatchStart, setLastBatchStart] = useState(0);
    const observerRef = useRef(null);
    const limit = 20;

    // Сброс при смене категории или фильтров
    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
    }, [slug, JSON.stringify(filters)]); // JSON.stringify чтобы следить за глубокими изменениями фильтров

    useEffect(() => {
        if (!hasMore) return;

        const load = async () => {
            setIsLoading(true);
            try {
                const data = await Api.byCategory.byCategory(slug, page, limit, filters);

                if (data.length === 0) setHasMore(false);

                setLastBatchStart((page) => (page === 1 ? 0 : products.length));
                setProducts((prev) => (page === 1 ? data : [...prev, ...data]));
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [slug, page, JSON.stringify(filters)]);

    useEffect(() => {
        if (isLoading || !hasMore) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setPage((p) => p + 1);
            },
            { threshold: 1 }
        );

        const el = observerRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [isLoading, hasMore]);

    return {
        products,
        isLoading,
        hasMore,
        observerRef,
        lastBatchStart,
    };
};
