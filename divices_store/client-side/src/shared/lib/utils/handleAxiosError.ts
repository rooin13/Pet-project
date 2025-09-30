import { AxiosError, isAxiosError } from "axios";

/**
 * `handleAxiosError` standardizes Axios errors into human-readable messages.
 * It checks if the error is an AxiosError and maps common HTTP status codes
 * to clear messages. Always throws an Error.
 * 
 * Usage example:
 * try {
 *   await apiCall();
 * } catch (error) {
 *   handleAxiosError(error);
 * }
 */
export function handleAxiosError(error: unknown): never {
    if (isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
            case 400:
                throw new Error("Bad Request");
            case 401:
                throw new Error("User is not authorized");
            case 403:
                throw new Error("Access forbidden");
            case 404:
                throw new Error("Resource not found");
            case 500:
                throw new Error("Internal server error");
            default:
                throw new Error(error.message || "Unknown error occurred");
        }
    }

    // For non-Axios errors
    throw error instanceof Error ? error : new Error("Unknown error occurred");
}
