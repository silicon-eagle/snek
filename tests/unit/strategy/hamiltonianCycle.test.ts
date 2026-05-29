import { describe, expect, it } from "vitest";
import {
    createHamiltonianRouteState,
    getRouteStepByCell,
    getRouteCellKey,
    isValidHamiltonianCycle
} from "../../../src/core/strategy/hamiltonianCycle";
import type { GameConfig, GridCoordinate } from "../../../src/core/types/gameTypes";

function uniqueCellCount(cycle: readonly GridCoordinate[]): number {
    return new Set(cycle.map(getRouteCellKey)).size;
}

describe("hamiltonianCycle", () => {
    it("builds a valid full-board cycle for supported board sizes", () => {
        const config: GameConfig = { rows: 20, cols: 20, tickMs: 120 };
        const head = { x: 10, y: 10 };

        const route = createHamiltonianRouteState(config, head);

        expect(route.supported).toBe(true);
        expect(route.cycle).toHaveLength(config.rows * config.cols);
        expect(uniqueCellCount(route.cycle)).toBe(config.rows * config.cols);
        expect(isValidHamiltonianCycle(route.cycle, config)).toBe(true);
    });

    it("tracks the route step for the provided head coordinate", () => {
        const config: GameConfig = { rows: 8, cols: 8, tickMs: 120 };
        const head = { x: 3, y: 5 };

        const route = createHamiltonianRouteState(config, head);
        const headStep = getRouteStepByCell(route.indexByCell, head);

        expect(headStep).not.toBeNull();
        expect(route.currentRouteStep).toBe(headStep);
    });

    it("marks odd x odd boards as unsupported", () => {
        const config: GameConfig = { rows: 5, cols: 5, tickMs: 120 };
        const route = createHamiltonianRouteState(config, { x: 2, y: 2 });

        expect(route.supported).toBe(false);
        expect(route.cycle).toHaveLength(0);
        expect(route.indexByCell).toEqual({});
    });
});
