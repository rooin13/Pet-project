import axios from "axios"
import { instance } from "../common/instance";
import { Product } from "@prisma/client"

export const search = async (query: string) => {

    const data = await instance.get<Product>("/products/search", {
        params: {
            query: query
        }
    })

    return data.data;
}