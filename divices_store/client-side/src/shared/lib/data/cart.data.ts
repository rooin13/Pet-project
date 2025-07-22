import { ICartItem } from "@/widgets/cart/cart-item/model/type";

import { products } from "./product.data"

export const cartItemData: ICartItem[] = [
    {
        id: 1,
        product:
            products[0]
        ,
        quantity: 1,
    },
    {
        id: 2,
        product:
            products[4]
        ,
        quantity: 2,
    },

    {
        id: 3,
        product:
            products[8]
        ,
        quantity: 3,
    },


]