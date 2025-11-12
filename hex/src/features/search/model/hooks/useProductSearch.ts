import { useState, ChangeEvent } from "react";
import { Product } from "@prisma/client";
import { Api } from "@/shared/lib/api/common/client";

export const useProductSearch = () => {
    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setFilteredProducts([]);
            return;
        }

        try {
            const products = await Api.products.search(value);
            setFilteredProducts(
                products ? (Array.isArray(products) ? products : [products]) : []
            );
        } catch (error) {
            console.error("Search error:", error);
            setFilteredProducts([]);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setFilteredProducts([]);
    };

    return {
        query,
        filteredProducts,
        handleSearch,
        clearSearch,
        hasResults: filteredProducts.length > 0,
    };
};

