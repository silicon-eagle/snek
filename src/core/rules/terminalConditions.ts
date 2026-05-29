import type { GameConfig, GridCoordinate } from "../types/gameTypes";

/**
 * Returns true when a point is outside the playable grid.
 */
export function isOutOfBounds(point: GridCoordinate, config: GameConfig): boolean {
    return point.x < 0 || point.y < 0 || point.x >= config.cols || point.y >= config.rows;
}

/**
 * Reports whether crossing a boundary should end the session.
 */
export function isBoundaryLoss(point: GridCoordinate, config: GameConfig, wrapsEnabled: boolean): boolean {
    if (wrapsEnabled) {
        return false;
    }

    return isOutOfBounds(point, config);
}

/**
 * Returns true when the head overlaps any existing snake segment.
 */
export function isSelfCollision(head: GridCoordinate, segments: GridCoordinate[]): boolean {
    return segments.some((segment) => segment.x === head.x && segment.y === head.y);
}

/**
 * Returns true when the snake fills the entire grid.
 */
export function isWinState(snakeLength: number, config: GameConfig): boolean {
    return snakeLength >= config.rows * config.cols;
}
