/**
 * Делаем первую букву строки заглавной, остальное — как есть.
 * @param str — исходная строка
 * @returns строка с заглавной первой буквой
 */
export function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
