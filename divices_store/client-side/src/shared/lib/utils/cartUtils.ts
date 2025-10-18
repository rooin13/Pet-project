// Утилиты для работы с корзиной и расчетами

export const SHIPPING_CONFIG = {
    FEE: 15,
    FREE_THRESHOLD: 39,
} as const;

/**
 * Расчет стоимости доставки
 */
export const calculateShipping = (subtotal: number): number => {
    return subtotal > SHIPPING_CONFIG.FREE_THRESHOLD ? 0 : SHIPPING_CONFIG.FEE;
};

/**
 * Расчет итоговой суммы заказа
 */
export const calculateOrderTotal = (subtotal: number): number => {
    const shipping = calculateShipping(subtotal);
    return subtotal + shipping;
};

/**
 * Форматирование цены
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

/**
 * Проверка на бесплатную доставку
 */
export const hasFreeShipping = (subtotal: number): boolean => {
    return subtotal > SHIPPING_CONFIG.FREE_THRESHOLD;
};

