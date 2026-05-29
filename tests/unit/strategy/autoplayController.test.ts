import { describe, expect, it } from "vitest";
import { createAutoplayStep, resolveDirectionBetweenCells } from "../../../src/core/strategy/autoplayController";
import { createHamiltonianRouteState, createUnsupportedRouteState } from "../../../src/core/strategy/hamiltonianCycle";
import type { GameConfig } from "../../../src/core/types/gameTypes";

const CONFIG: GameConfig = {
    rows: 8,
    cols: 8,
    tickMs: 120
};

describe("autoplayController", () => {
    it("resolves wrap-aware directions", () => {
        expect(resolveDirectionBetweenCells({ x: 0, y: 0 }, { x: 7, y: 0 }, CONFIG)).toBe("left");
        expect(resolveDirectionBetweenCells({ x: 7, y: 0 }, { x: 0, y: 0 }, CONFIG)).toBe("right");
        expect(resolveDirectionBetweenCells({ x: 0, y: 0 }, { x: 0, y: 7 }, CONFIG)).toBe("up");
        expect(resolveDirectionBetweenCells({ x: 0, y: 7 }, { x: 0, y: 0 }, CONFIG)).toBe("down");
    });

    it("creates autoplay steps from Hamiltonian route state", () => {
        const head = { x: 4, y: 4 };
        const route = createHamiltonianRouteState(CONFIG, head);

        const step = createAutoplayStep(route, head, CONFIG);

        expect(step).not.toBeNull();
        expect(step?.nextRouteStep).toBeGreaterThanOrEqual(0);
    });

    it("returns null for unsupported route states", () => {
        const route = createUnsupportedRouteState(CONFIG);
        const step = createAutoplayStep(route, { x: 1, y: 1 }, CONFIG);

        expect(step).toBeNull();
    });
});
