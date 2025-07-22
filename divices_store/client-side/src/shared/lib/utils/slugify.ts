export function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // пробелы → 1 тире
        .replace(/[^a-z0-9\-]/g, "") // убрать всё кроме латиницы, цифр и тире
        .replace(/\-+/g, "-"); // убрать повторяющиеся тире
}
