"use client";

import { useEffect, useRef } from "react";

/**
 * Хук для автоматической подгрузки контента при прокрутке до конца списка
 * Использует Intersection Observer API
 */
export function useInfiniteScroll(
    onLoadMore: () => void,
    hasMore: boolean,
    isLoading: boolean
) {
    const observerTarget = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const target = observerTarget.current;
        if (!target || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            {
                root: null,
                rootMargin: "100px", // Загружаем заранее, когда до конца еще 100px
                threshold: 0.1,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [onLoadMore, hasMore, isLoading]);

    return observerTarget;
}

