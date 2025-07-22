import { instance } from "../instance";
import { Product } from "@prisma/client";

// Тип с только нужным полем
type ProductSlug = Pick<Product, "name">;

export const getAllSlugs = async (): Promise<ProductSlug[]> => {
    const { data } = await instance.get<ProductSlug[]>("/products/all-slugs");
    return data;
};