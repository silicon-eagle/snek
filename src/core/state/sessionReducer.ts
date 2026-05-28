import { advanceSnake, getNextHeadPosition, isTurnAllowed } from "../rules/snakeRules";
import { isOutOfBounds, isSelfCollision, isWinState } from "../rules/terminalConditions";
import { createDeterministicFoodPosition, isSameCoordinate } from "./foodSpawner";
import type { GameConfig, GameSession, SessionAction } from "../types/gameTypes";

let sessionCounter = 0;

/**
 * Generates monotonic session identifiers for local runtime usage.
 */
function nextSessionId(): string {
    sessionCounter += 1;
    return `session-${sessionCounter}`;
}

/**
 * Creates the default three-segment snake centered on the grid.
 */
function createInitialSegments(config: GameConfig) {
    const centerY = Math.floor(config.rows / 2);
    const centerX = Math.floor(config.cols / 2);

    return [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
    ];
}

/**
 * Resets the session-id counter for deterministic tests.
 */
export function resetSessionCounterForTests(): void {
    sessionCounter = 0;
}

/**
 * Builds a fresh running session with default snake placement and food.
 */
export function createInitialSession(config: GameConfig): GameSession {
    const segments = createInitialSegments(config);

    return {
        id: nextSessionId(),
        status: "running",
        score: 0,
        tick: 0,
        config,
        snake: {
            segments,
            heading: "right",
            pendingGrowth: 0
        },
        food: {
            position: createDeterministicFoodPosition(config, segments)
        }
    };
}

/**
 * Applies one session action and returns the next immutable session state.
 */
export function reduceSession(session: GameSession, action: SessionAction): GameSession {
    if (action.type === "RESET") {
        return createInitialSession(session.config);
    }

    if (action.type === "TURN") {
        if (session.status !== "running") {
            return session;
        }

        if (!isTurnAllowed(session.snake.heading, action.direction)) {
            return session;
        }

        return {
            ...session,
            snake: {
                ...session.snake,
                heading: action.direction
            }
        };
    }

    if (session.status !== "running") {
        return session;
    }

    const currentHead = session.snake.segments[0];
    if (!currentHead) {
        return {
            ...session,
            status: "lost"
        };
    }

    const nextHead = getNextHeadPosition(currentHead, session.snake.heading);
    const ateFood = isSameCoordinate(nextHead, session.food.position);

    const collisionBody =
        session.snake.pendingGrowth > 0 || ateFood
            ? session.snake.segments
            : session.snake.segments.slice(0, session.snake.segments.length - 1);

    if (isOutOfBounds(nextHead, session.config) || isSelfCollision(nextHead, collisionBody)) {
        return {
            ...session,
            status: "lost",
            tick: session.tick + 1
        };
    }

    const nextSnake = advanceSnake(session.snake, nextHead, ateFood);
    const nextScore = session.score + (ateFood ? 1 : 0);
    const nextTick = session.tick + 1;
    const won = isWinState(nextSnake.segments.length, session.config);

    if (won) {
        return {
            ...session,
            snake: nextSnake,
            score: nextScore,
            tick: nextTick,
            status: "won"
        };
    }

    if (!ateFood) {
        return {
            ...session,
            snake: nextSnake,
            tick: nextTick
        };
    }

    return {
        ...session,
        snake: nextSnake,
        score: nextScore,
        tick: nextTick,
        food: {
            position: createDeterministicFoodPosition(session.config, nextSnake.segments)
        }
    };
}
