/**
 * `slugifyName` converts a string into a URL-friendly slug.
 * It removes invalid characters, trims spaces, replaces spaces with dashes,
 * and collapses multiple dashes into one.
 * Example: slugifyName("My Product Name!") -> "my-product-name"
 */


export function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/\-+/g, "-");
}
