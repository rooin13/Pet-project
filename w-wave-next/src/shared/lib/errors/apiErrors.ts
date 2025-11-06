// централизованная обработка ошибок API (80%)

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public fields?: Record<string, string[]>) {
        super(400, message, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}

export class AuthError extends AppError {
    constructor(message: string = "Unauthorized") {
        super(401, message, "AUTH_ERROR");
        this.name = "AuthError";
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden") {
        super(403, message, "FORBIDDEN");
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Not found") {
        super(404, message, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = "Too many requests") {
        super(429, message, "RATE_LIMIT");
        this.name = "RateLimitError";
    }
}

export class ExternalAPIError extends AppError {
    constructor(
        public service: string,
        message: string,
        statusCode: number = 502
    ) {
        super(statusCode, `${service}: ${message}`, "EXTERNAL_API_ERROR");
        this.name = "ExternalAPIError";
    }
}

// helper для обработки ошибок в API routes
export function handleApiError(error: unknown): {
    status: number;
    body: { error: string; code?: string; fields?: Record<string, string[]> };
} {
    console.error("API Error:", error);

    if (error instanceof ValidationError) {
        return {
            status: error.statusCode,
            body: {
                error: error.message,
                code: error.code,
                fields: error.fields,
            },
        };
    }

    if (error instanceof AppError) {
        return {
            status: error.statusCode,
            body: {
                error: error.message,
                code: error.code,
            },
        };
    }

    if (error instanceof Error) {
        return {
            status: 500,
            body: {
                error:
                    process.env.NODE_ENV === "production"
                        ? "Internal server error"
                        : error.message,
                code: "INTERNAL_ERROR",
            },
        };
    }

    return {
        status: 500,
        body: {
            error: "Unknown error",
            code: "UNKNOWN_ERROR",
        },
    };
}

