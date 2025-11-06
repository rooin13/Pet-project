import { NextRequest } from "next/server";
import { RateLimitError } from "../errors";

// simple in-memory rate limiter (для production используй Redis)
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
    req: NextRequest,
    options: { maxRequests: number; windowMs: number } = {
        maxRequests: 10,
        windowMs: 60000,
    }
): void {
    // получаем IP или user ID
    const identifier =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "anonymous";

    const now = Date.now();
    const windowStart = now - options.windowMs;

    // очистка старых записей
    for (const [key, value] of requests.entries()) {
        if (value.resetAt < windowStart) {
            requests.delete(key);
        }
    }

    const current = requests.get(identifier);

    if (!current) {
        requests.set(identifier, { count: 1, resetAt: now + options.windowMs });
        return;
    }

    if (current.resetAt < now) {
        requests.set(identifier, { count: 1, resetAt: now + options.windowMs });
        return;
    }

    if (current.count >= options.maxRequests) {
        throw new RateLimitError(
            `Too many requests. Try again in ${Math.ceil((current.resetAt - now) / 1000)}s`
        );
    }

    current.count++;
}

