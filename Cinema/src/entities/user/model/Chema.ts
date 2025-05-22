import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    surname: z.string().min(2),
    name: z.string().min(2),
});

export type User = z.infer<typeof userSchema>;