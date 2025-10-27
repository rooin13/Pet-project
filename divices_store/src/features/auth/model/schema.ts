import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    repeatPassword: z.string().min(6),
    surname: z.string().min(2),
    name: z.string().min(2),
}).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
});



export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

