import { loginSchema, registerSchema } from "./schema";
import { z } from "zod";

export type RegisterDataType = z.infer<typeof registerSchema>;
export type LoginDataType = z.infer<typeof loginSchema>;