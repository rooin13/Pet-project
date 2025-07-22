import { AxiosError, isAxiosError } from "axios";

export function handleAxiosError(error: unknown): never {
    if (isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
            case 400:
                throw new Error("Неверный запрос");
            case 401:

                throw new Error("Пользователь не авторизован");
            case 403:
                throw new Error("Нет доступа");
            case 404:
                throw new Error("Ресурс не найден");
            case 500:
                throw new Error("Ошибка сервера");
            default:
                throw new Error(error.message || "Неизвестная ошибка");
        }
    }

    // В случае других ошибок (не axios)
    throw error instanceof Error ? error : new Error("Неизвестная ошибка");
}
