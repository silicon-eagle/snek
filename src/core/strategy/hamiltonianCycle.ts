import type { GameConfig, GridCoordinate, HamiltonianRouteState } from "../types/gameTypes";

/**
 * Canonical string key used for route index lookups.
 */
export function getRouteCellKey(point: GridCoordinate): string {
    return `${point.x},${point.y}`;
}

/**
 * Builds a direct route index map from cell key to cycle step.
 */
export function buildRouteIndex(cycle: readonly GridCoordinate[]): Record<string, number> {
    const index: Record<string, number> = {};

    cycle.forEach((cell, step) => {
        index[getRouteCellKey(cell)] = step;
    });

    return index;
}

/**
 * Resolves a cycle step from coordinate using a precomputed route index.
 */
export function getRouteStepByCell(indexByCell: Record<string, number>, point: GridCoordinate): number | null {
    const step = indexByCell[getRouteCellKey(point)];
    return typeof step === "number" ? step : null;
}

/**
 * Wraps route step values into the active cycle range.
 */
export function getWrappedRouteStep(step: number, cycleLength: number): number {
    if (cycleLength <= 0) {
        return 0;
    }

    const wrapped = step % cycleLength;
    return wrapped < 0 ? wrapped + cycleLength : wrapped;
}

/**
 * Returns true when two cells are orthogonally adjacent with wrap-through borders.
 */
export function areAdjacentWithWrap(a: GridCoordinate, b: GridCoordinate, config: GameConfig): boolean {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);

    const horizontalAdjacent = dy === 0 && (dx === 1 || dx === config.cols - 1);
    const verticalAdjacent = dx === 0 && (dy === 1 || dy === config.rows - 1);

    return horizontalAdjacent || verticalAdjacent;
}

/**
 * Builds a row-serpentine cycle for boards with an even row count.
 */
function buildRowSerpentineCycle(config: GameConfig): GridCoordinate[] {
    const cycle: GridCoordinate[] = [];

    for (let y = 0; y < config.rows; y += 1) {
        if (y % 2 === 0) {
            for (let x = 0; x < config.cols; x += 1) {
                cycle.push({ x, y });
            }
            continue;
        }

        for (let x = config.cols - 1; x >= 0; x -= 1) {
            cycle.push({ x, y });
        }
    }

    return cycle;
}

/**
 * Builds a column-serpentine cycle for boards with an even column count.
 */
function buildColumnSerpentineCycle(config: GameConfig): GridCoordinate[] {
    const cycle: GridCoordinate[] = [];

    for (let x = 0; x < config.cols; x += 1) {
        if (x % 2 === 0) {
            for (let y = 0; y < config.rows; y += 1) {
                cycle.push({ x, y });
            }
            continue;
        }

        for (let y = config.rows - 1; y >= 0; y -= 1) {
            cycle.push({ x, y });
        }
    }

    return cycle;
}

/**
 * Validates cycle coverage, uniqueness, continuity, and closure.
 */
export function isValidHamiltonianCycle(cycle: readonly GridCoordinate[], config: GameConfig): boolean {
    const expectedLength = config.rows * config.cols;
    if (cycle.length !== expectedLength || expectedLength === 0) {
        return false;
    }

    const seen = new Set<string>();
    for (const cell of cycle) {
        if (cell.x < 0 || cell.x >= config.cols || cell.y < 0 || cell.y >= config.rows) {
            return false;
        }

        const key = getRouteCellKey(cell);
        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
    }

    for (let step = 0; step < cycle.length; step += 1) {
        const current = cycle[step]!;
        const next = cycle[(step + 1) % cycle.length]!;
        if (!areAdjacentWithWrap(current, next, config)) {
            return false;
        }
    }

    return true;
}

/**
 * Creates a full Hamiltonian route state for supported boards.
 */
export function createHamiltonianRouteState(config: GameConfig, head: GridCoordinate): HamiltonianRouteState {
    const supportsCycle = config.rows > 1 && config.cols > 1 && (config.rows % 2 === 0 || config.cols % 2 === 0);
    if (!supportsCycle) {
        return createUnsupportedRouteState(config);
    }

    const cycle = config.rows % 2 === 0 ? buildRowSerpentineCycle(config) : buildColumnSerpentineCycle(config);
    if (!isValidHamiltonianCycle(cycle, config)) {
        return createUnsupportedRouteState(config);
    }

    const indexByCell = buildRouteIndex(cycle);
    const headStep = getRouteStepByCell(indexByCell, head);

    return {
        cycle,
        indexByCell,
        currentRouteStep: headStep ?? 0,
        supported: true
    };
}

/**
 * Returns the phase-2 foundational route state for unsupported autoplay boards.
 */
export function createUnsupportedRouteState(_config: GameConfig): HamiltonianRouteState {
    void _config;

    return {
        cycle: [],
        indexByCell: {},
        currentRouteStep: 0,
        supported: false
    };
}
