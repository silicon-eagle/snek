import { describe, expect, it } from "vitest";
import {
    advanceSnake,
    getNextHeadPosition,
    isOppositeDirection,
    isTurnAllowed,
    wrapCoordinateToBounds
} from "../../../src/core/rules/snakeRules";

describe("snakeRules", () => {
    it("calculates next head position from heading", () => {
        expect(getNextHeadPosition({ x: 3, y: 3 }, "up")).toEqual({ x: 3, y: 2 });
        expect(getNextHeadPosition({ x: 3, y: 3 }, "down")).toEqual({ x: 3, y: 4 });
        expect(getNextHeadPosition({ x: 3, y: 3 }, "left")).toEqual({ x: 2, y: 3 });
        expect(getNextHeadPosition({ x: 3, y: 3 }, "right")).toEqual({ x: 4, y: 3 });
    });

    it("knows opposite direction pairs", () => {
        expect(isOppositeDirection("up", "down")).toBe(true);
        expect(isOppositeDirection("left", "right")).toBe(true);
        expect(isOppositeDirection("up", "left")).toBe(false);
    });

    it("allows only non-opposite turns", () => {
        expect(isTurnAllowed("right", "up")).toBe(true);
        expect(isTurnAllowed("right", "left")).toBe(false);
        expect(isTurnAllowed("right", "right")).toBe(false);
    });

    it("grows the snake when food is eaten", () => {
        const snake = {
            segments: [
                { x: 5, y: 5 },
                { x: 4, y: 5 },
                { x: 3, y: 5 }
            ],
            heading: "right" as const,
            pendingGrowth: 0
        };

        const grown = advanceSnake(snake, { x: 6, y: 5 }, true);
        const moved = advanceSnake(grown, { x: 7, y: 5 }, false);

        expect(grown.segments).toHaveLength(4);
        expect(moved.segments).toHaveLength(4);
    });

    it("wraps coordinates to the opposite border", () => {
        const config = { rows: 6, cols: 8, tickMs: 100 };

        expect(wrapCoordinateToBounds({ x: 8, y: 2 }, config)).toEqual({ x: 0, y: 2 });
        expect(wrapCoordinateToBounds({ x: -1, y: 2 }, config)).toEqual({ x: 7, y: 2 });
        expect(wrapCoordinateToBounds({ x: 3, y: 6 }, config)).toEqual({ x: 3, y: 0 });
        expect(wrapCoordinateToBounds({ x: 3, y: -1 }, config)).toEqual({ x: 3, y: 5 });
    });
});
