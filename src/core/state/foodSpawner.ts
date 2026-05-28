import type { GameConfig, GridCoordinate } from "../types/gameTypes";

/**
 * Compares two grid coordinates for exact equality.
 */
export function isSameCoordinate(a: GridCoordinate, b: GridCoordinate): boolean {
    return a.x === b.x && a.y === b.y;
}

/**
 * Creates a stable hash key for grid coordinate lookups.
 */
function coordinateKey(point: GridCoordinate): string {
    return `${point.x},${point.y}`;
}

/**
 * Picks the first free grid cell in scan order for deterministic food placement.
 */
export function createDeterministicFoodPosition(config: GameConfig, snakeSegments: GridCoordinate[]): GridCoordinate {
    const occupied = new Set(snakeSegments.map(coordinateKey));

    for (let y = 0; y < config.rows; y += 1) {
        for (let x = 0; x < config.cols; x += 1) {
            const candidate = { x, y };
            if (!occupied.has(coordinateKey(candidate))) {
                return candidate;
            }
        }
    }

    return snakeSegments[0] ?? { x: 0, y: 0 };
}
