import { z } from "zod";
import { loginSchema, signupSchema, usernameSchema } from "./schema";

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type UsernameFormData = z.infer<typeof usernameSchema>;
