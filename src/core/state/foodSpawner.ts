import { FOOD_SPAWN_SOURCE_RANDOM_FREE } from "../session/sessionConstants";
import type { FoodState, GameConfig, GridCoordinate } from "../types/gameTypes";

export type RandomSource = () => number;

/**
 * Compares two grid coordinates for exact equality.
 */
export function isSameCoordinate(a: GridCoordinate, b: GridCoordinate): boolean {
    return a.x === b.x && a.y === b.y;
}

/**
 * Creates a stable hash key for grid coordinate lookups.
 */
export function getCoordinateKey(point: GridCoordinate): string {
    return `${point.x},${point.y}`;
}

/**
 * Lists all currently free cells that are not occupied by snake segments.
 */
export function listFreeCells(config: GameConfig, snakeSegments: GridCoordinate[]): GridCoordinate[] {
    const occupied = new Set(snakeSegments.map(getCoordinateKey));
    const freeCells: GridCoordinate[] = [];

    for (let y = 0; y < config.rows; y += 1) {
        for (let x = 0; x < config.cols; x += 1) {
            const candidate = { x, y };
            if (!occupied.has(getCoordinateKey(candidate))) {
                freeCells.push(candidate);
            }
        }
    }

    return freeCells;
}

/**
 * Selects the first free cell for deterministic test-friendly spawn behavior.
 */
export function createDeterministicFoodPosition(config: GameConfig, snakeSegments: GridCoordinate[]): GridCoordinate {
    const freeCells = listFreeCells(config, snakeSegments);
    return freeCells[0] ?? snakeSegments[0] ?? { x: 0, y: 0 };
}

/**
 * Selects one free cell using an injectable random source.
 */
export function createRandomFoodPosition(
    config: GameConfig,
    snakeSegments: GridCoordinate[],
    randomSource: RandomSource = Math.random
): GridCoordinate {
    const freeCells = listFreeCells(config, snakeSegments);
    if (freeCells.length === 0) {
        return snakeSegments[0] ?? { x: 0, y: 0 };
    }

    const raw = randomSource();
    const normalized = Number.isFinite(raw) ? raw - Math.floor(raw) : 0;
    const index = Math.min(freeCells.length - 1, Math.floor(normalized * freeCells.length));
    return freeCells[index] ?? freeCells[0]!;
}

/**
 * Builds a full food state snapshot with deterministic or random placement.
 */
export function createFoodState(
    config: GameConfig,
    snakeSegments: GridCoordinate[],
    options?: {
        strategy?: "deterministic" | "random";
        randomSource?: RandomSource;
    }
): FoodState {
    const freeCells = listFreeCells(config, snakeSegments);
    const strategy = options?.strategy ?? "deterministic";

    if (freeCells.length === 0) {
        return {
            position: snakeSegments[0] ?? { x: 0, y: 0 },
            freeCellCount: 0,
            source: FOOD_SPAWN_SOURCE_RANDOM_FREE
        };
    }

    if (strategy === "random") {
        return {
            position: createRandomFoodPosition(config, snakeSegments, options?.randomSource),
            freeCellCount: freeCells.length,
            source: FOOD_SPAWN_SOURCE_RANDOM_FREE
        };
    }

    return {
        position: freeCells[0]!,
        freeCellCount: freeCells.length,
        source: "deterministicScan"
    };
}
