import { advanceSnake, getNextHeadPosition, isTurnAllowed, wrapCoordinateToBounds } from "../rules/snakeRules";
import { isBoundaryLoss, isSelfCollision, isWinState } from "../rules/terminalConditions";
import { CONTROL_OWNER_AUTONOMOUS, CONTROL_OWNER_MANUAL } from "../session/sessionConstants";
import { createAutoplayStep } from "../strategy/autoplayController";
import { createHamiltonianRouteState, getRouteStepByCell } from "../strategy/hamiltonianCycle";
import { createFoodState, isSameCoordinate } from "./foodSpawner";
import type { GameConfig, GameSession, GridCoordinate, HamiltonianRouteState, SessionAction } from "../types/gameTypes";

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
 * Syncs route position metadata with the latest head coordinate when available.
 */
function syncRouteStep(route: HamiltonianRouteState, head: GridCoordinate): HamiltonianRouteState {
    const nextStep = getRouteStepByCell(route.indexByCell, head);
    if (nextStep === null || nextStep === route.currentRouteStep) {
        return route;
    }

    return {
        ...route,
        currentRouteStep: nextStep
    };
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
    const route = createHamiltonianRouteState(config, segments[0]!);
    const food = createFoodState(config, segments, { strategy: "random" });

    return {
        id: nextSessionId(),
        status: "running",
        score: 0,
        tick: 0,
        config,
        controlMode: {
            owner: CONTROL_OWNER_AUTONOMOUS,
            switchedAtTick: null
        },
        snake: {
            segments,
            heading: "right",
            pendingGrowth: 0
        },
        food,
        route
    };
}

/**
 * Applies one session action and returns the next immutable session state.
 */
export function reduceSession(session: GameSession, action: SessionAction): GameSession {
    if (action.type === "RESET") {
        return createInitialSession(session.config);
    }

    if (action.type === "SET_CONTROL_OWNER") {
        const switchedAtTick = action.switchedAtTick ?? session.controlMode.switchedAtTick;
        if (session.controlMode.owner === action.owner && session.controlMode.switchedAtTick === switchedAtTick) {
            return session;
        }

        return {
            ...session,
            controlMode: {
                owner: action.owner,
                switchedAtTick
            }
        };
    }

    if (action.type === "TURN") {
        if (session.status !== "running") {
            return session;
        }

        if (!isTurnAllowed(session.snake.heading, action.direction)) {
            return session;
        }

        const nextControlMode =
            session.controlMode.owner === CONTROL_OWNER_MANUAL
                ? session.controlMode
                : {
                      owner: CONTROL_OWNER_MANUAL,
                      switchedAtTick: session.tick + 1
                  };

        return {
            ...session,
            controlMode: nextControlMode,
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

    let nextHeading = session.snake.heading;
    let nextRoute = session.route;

    if (session.controlMode.owner === CONTROL_OWNER_AUTONOMOUS) {
        const autoplayStep = createAutoplayStep(session.route, currentHead, session.config);
        if (autoplayStep) {
            nextHeading = autoplayStep.direction;
            nextRoute = {
                ...session.route,
                currentRouteStep: autoplayStep.nextRouteStep
            };
        }
    }

    const candidateHead = getNextHeadPosition(currentHead, nextHeading);
    const nextHead = wrapCoordinateToBounds(candidateHead, session.config);
    nextRoute = syncRouteStep(nextRoute, nextHead);
    const ateFood = isSameCoordinate(nextHead, session.food.position);

    const collisionBody =
        session.snake.pendingGrowth > 0 || ateFood
            ? session.snake.segments
            : session.snake.segments.slice(0, session.snake.segments.length - 1);

    if (isBoundaryLoss(candidateHead, session.config, true) || isSelfCollision(nextHead, collisionBody)) {
        return {
            ...session,
            status: "lost",
            tick: session.tick + 1,
            route: nextRoute,
            snake: {
                ...session.snake,
                heading: nextHeading
            }
        };
    }

    const nextSnake = advanceSnake(session.snake, nextHead, ateFood);
    const nextScore = session.score + (ateFood ? 1 : 0);
    const nextTick = session.tick + 1;
    const won = isWinState(nextSnake.segments.length, session.config);

    if (won) {
        return {
            ...session,
            snake: {
                ...nextSnake,
                heading: nextHeading
            },
            score: nextScore,
            tick: nextTick,
            status: "won",
            route: nextRoute
        };
    }

    if (!ateFood) {
        return {
            ...session,
            snake: {
                ...nextSnake,
                heading: nextHeading
            },
            tick: nextTick,
            route: nextRoute
        };
    }

    return {
        ...session,
        snake: {
            ...nextSnake,
            heading: nextHeading
        },
        score: nextScore,
        tick: nextTick,
        route: nextRoute,
        food: createFoodState(session.config, nextSnake.segments, { strategy: "random" })
    };
}
