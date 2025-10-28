// максимальное смещение (в px)
const MAX_OFFSETS = [100, 180, 140, 120];

// когда каждая колонка стартует (0-1)
const PHASES = [0, 0.25, 0.5, 0.75];

// направление (1 = вниз, -1 = вверх)
const DIRECTIONS = [1, -1, 1, -1];

// скорость движения
const FREQUENCIES = [1.0, 1.15, 0.95, 1.1];

export const getParallaxOffset = (
    colIndex: number,
    scrollProgress: number
): number => {
    const phase = PHASES[colIndex];
    const direction = DIRECTIONS[colIndex];
    const frequency = FREQUENCIES[colIndex];

    let adjustedProgress = scrollProgress - phase;
    adjustedProgress = Math.max(0, Math.min(1, adjustedProgress));

    const wave = Math.sin(adjustedProgress * Math.PI * frequency);
    const envelope = Math.sin(scrollProgress * Math.PI);
    const curve = wave * envelope * direction;

    return curve * MAX_OFFSETS[colIndex];
};

