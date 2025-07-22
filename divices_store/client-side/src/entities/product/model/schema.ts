import { z } from "zod"

export const VariationSchema = z.object({
    id: z.number(),
    color: z.string(),
    size: z.string().optional(), // только для клавиатур
    price: z.number().optional(), // может отличаться от базовой
})

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
})

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imagesUrl: z.array(z.string()),
    category: CategorySchema,
    categoryId: z.number(),
    variations: z.array(VariationSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
})


export type TVariation = z.infer<typeof VariationSchema>;
export type TCategory = z.infer<typeof CategorySchema>;
export type TProduct = z.infer<typeof ProductSchema>;