import { TProduct } from "@/entities/product/model/schema";

export interface ICartItem {
    id: number;
    product: TProduct;
    quantity: number;
}