import type { Variation, Product } from "@prisma/client";

// Используем Product напрямую
export type VariationWithProduct = Variation & {
    product: Product;
};

export type CartItem = {
    quantity: number;
    variation: VariationWithProduct;
};

export type CartItemWithVariation = {
    id: number;
    quantity: number;
    variation: VariationWithProduct;
};

export interface CartResponse {
    items: CartItemWithVariation[];
    totalAmount: number;
}
