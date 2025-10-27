// Утилиты для форматирования данных

/**
 * Форматирование цены с валютой
 */
export const formatPrice = (price: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(price);
};

/**
 * Форматирование цены без знака валюты
 */
export const formatPriceSimple = (price: number): string => {
    return `$${price.toFixed(0)}.99`;
};

/**
 * Форматирование даты
 */
export const formatDate = (date: Date | string): string => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
};

/**
 * Форматирование телефона
 */
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};

/**
 * Генерация slug из строки
 */
export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

