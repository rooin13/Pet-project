import { Category, Product } from "@prisma/client";

export const PAGES = {
    CATEGORY: (category: Category) => `/shop/c/${category.name.toLocaleLowerCase()}`,
    PRUDUCT: (product: Product) => `/shop/p/${product.slug}`,

}