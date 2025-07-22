export function getRatingBgColor(rating: number): string {
    const clamped = Math.min(Math.max(rating, 1), 10);
    const percent = (clamped - 1) / 9;

    const hue = 0 + percent * 120;
    const h = Math.round(hue);

    return `hsl(${h}, 55%, 50%)`;
}