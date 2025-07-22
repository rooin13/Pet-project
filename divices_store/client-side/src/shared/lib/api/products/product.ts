import { instance } from "../instance"
import { Product } from "@prisma/client"

export const searchFirst = async (query: string): Promise<Product | null> => {
    const { data } = await instance.get<Product>("/products/by-slug", {
        params: {
            query,
        },
    })

    return data
}