/**
 * Utilities for working with product images.
 */

import { Product } from "@prisma/client";

export const defaultImage = {
    url: "/placeholder.png",
    alt: "Default product image",
};

/**
 * Returns the first image URL from an array or fallback.
 */
export function getImageSrc(images: unknown, fallback = defaultImage.url): string {
    if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string" && images[0]) {
        return images[0];
    }
    return fallback;
}

/** ч
 * Returns an array of valid image URLs from a Product object.
 */
export function getProductImagesUrls(product: Product): string[] {
    return Array.isArray(product.imagesUrl)
        ? product.imagesUrl.filter((u): u is string => typeof u === "string")
        : [];
}

/**
 * Returns up to `maxImages` images as objects with { url, alt }.
 */
export function getProductImages(product: Product, maxImages = 4) {
    const images = getProductImagesUrls(product);
    return images.length
        ? images.slice(0, maxImages).map((url) => ({ url, alt: product.name }))
        : [defaultImage];
}
