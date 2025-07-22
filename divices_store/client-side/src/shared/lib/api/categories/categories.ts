import { instance } from "../instance"
import { Category, Product } from "@prisma/client"

export const categories = async (): Promise<Category[] | null> => {
    const { data } = await instance.get<Category[]>("/categories", {

    })

    return data
}