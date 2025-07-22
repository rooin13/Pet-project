import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email(),
    favorites: z.array(z.number()),
    surname: z.string().min(2),
    name: z.string().min(2),
});

export type User = z.infer<typeof userSchema>;