import { instance } from "../instance"
import { Product } from "@prisma/client"

export const byCategory = async (query: string): Promise<Product[]> => {
    const data = await instance.get<Product[]>("/products/by-category", {
        params: {
            query,
        },
    })

    return data.data
}