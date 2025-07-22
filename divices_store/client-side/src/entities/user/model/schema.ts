
import { z } from "zod";
import { fa } from "zod/v4/locales";

export const userSchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(2),
    password: z.string().min(6),
    verified: z.date(),
    favorites: z.array(z.string()).optional(),
});


export type User = z.infer<typeof userSchema>;