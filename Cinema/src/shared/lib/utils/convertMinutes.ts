export function convertMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, ' ')}h ${String(mins).padStart(2, '0')}m`;
}