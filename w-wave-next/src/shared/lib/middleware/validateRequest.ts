import { NextRequest } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors";

// helper для валидации тела запроса с помощью Zod
export async function validateRequestBody<T>(
    req: NextRequest,
    schema: ZodSchema<T>
): Promise<T> {
    try {
        const body = await req.json();
        return schema.parse(body);
    } catch (error) {
        if (error instanceof ZodError) {
            const fields: Record<string, string[]> = {};
            error.issues.forEach((err) => {
                const path = err.path.join(".");
                if (!fields[path]) {
                    fields[path] = [];
                }
                fields[path].push(err.message);
            });
            throw new ValidationError("Validation failed", fields);
        }
        throw new ValidationError("Invalid request body");
    }
}

// helper для валидации query параметров
export function validateQuery<T>(
    req: NextRequest,
    schema: ZodSchema<T>
): T {
    try {
        const params = Object.fromEntries(req.nextUrl.searchParams);
        return schema.parse(params);
    } catch (error) {
        if (error instanceof ZodError) {
            const fields: Record<string, string[]> = {};
            error.issues.forEach((err) => {
                const path = err.path.join(".");
                if (!fields[path]) {
                    fields[path] = [];
                }
                fields[path].push(err.message);
            });
            throw new ValidationError("Invalid query parameters", fields);
        }
        throw new ValidationError("Invalid query parameters");
    }
}

