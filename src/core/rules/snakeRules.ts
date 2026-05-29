import type { Direction, GameConfig, GridCoordinate, SnakeState } from "../types/gameTypes";

const DIRECTION_DELTA: Record<Direction, GridCoordinate> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

/**
 * Returns true when two directions are exact opposites.
 */
export function isOppositeDirection(current: Direction, next: Direction): boolean {
    return (
        (current === "up" && next === "down") ||
        (current === "down" && next === "up") ||
        (current === "left" && next === "right") ||
        (current === "right" && next === "left")
    );
}

/**
 * Validates whether a turn can be applied to the current heading.
 */
export function isTurnAllowed(current: Direction, next: Direction): boolean {
    if (current === next) {
        return false;
    }

    return !isOppositeDirection(current, next);
}

/**
 * Computes the next head coordinate using the active heading.
 */
export function getNextHeadPosition(head: GridCoordinate, heading: Direction): GridCoordinate {
    const delta = DIRECTION_DELTA[heading];
    return {
        x: head.x + delta.x,
        y: head.y + delta.y
    };
}

/**
 * Wraps coordinates around grid borders to the opposite side.
 */
export function wrapCoordinateToBounds(point: GridCoordinate, config: GameConfig): GridCoordinate {
    const wrappedX = ((point.x % config.cols) + config.cols) % config.cols;
    const wrappedY = ((point.y % config.rows) + config.rows) % config.rows;

    return {
        x: wrappedX,
        y: wrappedY
    };
}

/**
 * Advances snake segments by one tick and applies growth when needed.
 */
export function advanceSnake(snake: SnakeState, nextHead: GridCoordinate, ateFood: boolean): SnakeState {
    const segments = [nextHead, ...snake.segments];
    let growthBank = snake.pendingGrowth + (ateFood ? 1 : 0);

    if (growthBank > 0) {
        growthBank -= 1;
    } else {
        segments.pop();
    }

    return {
        ...snake,
        segments,
        pendingGrowth: growthBank
    };
}
