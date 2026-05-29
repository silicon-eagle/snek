import { getRouteStepByCell, getWrappedRouteStep } from "./hamiltonianCycle";
import type { Direction, GameConfig, GridCoordinate, HamiltonianRouteState } from "../types/gameTypes";

export interface AutoplayStep {
    direction: Direction;
    nextRouteStep: number;
}

/**
 * Resolves the direction needed to move between adjacent cells with wrap semantics.
 */
export function resolveDirectionBetweenCells(
    from: GridCoordinate,
    to: GridCoordinate,
    config: GameConfig
): Direction | null {
    if (to.x === from.x && to.y === (from.y - 1 + config.rows) % config.rows) {
        return "up";
    }

    if (to.x === from.x && to.y === (from.y + 1) % config.rows) {
        return "down";
    }

    if (to.y === from.y && to.x === (from.x - 1 + config.cols) % config.cols) {
        return "left";
    }

    if (to.y === from.y && to.x === (from.x + 1) % config.cols) {
        return "right";
    }

    return null;
}

/**
 * Reads the next cycle cell from route state using an explicit step value.
 */
export function getNextCycleCell(route: HamiltonianRouteState, currentStep: number): GridCoordinate | null {
    if (!route.supported || route.cycle.length === 0) {
        return null;
    }

    const nextStep = getWrappedRouteStep(currentStep + 1, route.cycle.length);
    return route.cycle[nextStep] ?? null;
}

/**
 * Resolves the next autoplay movement decision for the current snake head.
 */
export function createAutoplayStep(
    route: HamiltonianRouteState,
    head: GridCoordinate,
    config: GameConfig
): AutoplayStep | null {
    if (!route.supported || route.cycle.length === 0) {
        return null;
    }

    const currentStep = getRouteStepByCell(route.indexByCell, head);
    if (currentStep === null) {
        return null;
    }

    const nextCell = getNextCycleCell(route, currentStep);
    if (!nextCell) {
        return null;
    }

    const direction = resolveDirectionBetweenCells(head, nextCell, config);
    if (!direction) {
        return null;
    }

    return {
        direction,
        nextRouteStep: getWrappedRouteStep(currentStep + 1, route.cycle.length)
    };
}

/**
 * Backward-compatible alias for callers that still reference scaffold naming.
 */
export function createAutoplayStepScaffold(
    route: HamiltonianRouteState,
    head: GridCoordinate,
    config: GameConfig
): AutoplayStep | null {
    return createAutoplayStep(route, head, config);
}
