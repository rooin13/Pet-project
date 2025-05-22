import { loginSchema, registerSchema } from "./shema";
import { z } from "zod";

export type RegisterDataType = z.infer<typeof registerSchema>;
export type LoginDataType = z.infer<typeof loginSchema>;