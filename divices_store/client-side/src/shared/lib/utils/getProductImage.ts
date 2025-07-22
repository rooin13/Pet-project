import { Prisma, Product } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma/prisma";

export function getProductImages(product: Product) {
    const images = Array.isArray(product.imagesUrl) ? product.imagesUrl : [];
    return images.length
        ? images
            .filter((u): u is string => typeof u === "string")
            .slice(0, 4)
            .map((url) => ({ url, alt: product.name }))
        : [defaultImage];
}





export const defaultImage = {
    url: "https://your-site.com/default.jpg",
    alt: "Default product image",
};