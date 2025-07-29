import { Product } from "@prisma/client";
import qs from "qs";
import { instance } from "../instance";

export const byCategory = async (
    slug: string,
    page: number,
    limit: number,
    filters?: Record<string, string[]>
): Promise<Product[]> => {
    const params: Record<string, any> = {
        query: slug,
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
    };

    const queryString = qs.stringify(params, { arrayFormat: "repeat" });
    // arrayFormat: "repeat" — будет сериализовывать массивы как key=val1&key=val2

    const { data } = await instance.get<Product[]>(`/products/by-category?${queryString}`);

    return data;
};
