import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(6, "Password must be at least 6 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

