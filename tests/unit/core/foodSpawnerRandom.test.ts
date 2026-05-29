import { describe, expect, it } from "vitest";
import {
    createFoodState,
    createRandomFoodPosition,
    getCoordinateKey,
    listFreeCells
} from "../../../src/core/state/foodSpawner";
import type { GameConfig, GridCoordinate } from "../../../src/core/types/gameTypes";
import { createSeededRandom, createSequenceRandom } from "./gameSessionFixtures";

const CONFIG: GameConfig = {
    rows: 4,
    cols: 4,
    tickMs: 120
};

const BASE_SNAKE: GridCoordinate[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
];

describe("foodSpawner random behavior", () => {
    it("spawns only on free cells", () => {
        const freeSet = new Set(listFreeCells(CONFIG, BASE_SNAKE).map(getCoordinateKey));
        const random = createSeededRandom(1234);

        for (let i = 0; i < 100; i += 1) {
            const food = createRandomFoodPosition(CONFIG, BASE_SNAKE, random);
            expect(freeSet.has(getCoordinateKey(food))).toBe(true);
        }
    });

    it("uses the only free cell when one remains", () => {
        const snakeSegments: GridCoordinate[] = [];
        for (let y = 0; y < CONFIG.rows; y += 1) {
            for (let x = 0; x < CONFIG.cols; x += 1) {
                if (x === CONFIG.cols - 1 && y === CONFIG.rows - 1) {
                    continue;
                }

                snakeSegments.push({ x, y });
            }
        }

        const food = createRandomFoodPosition(CONFIG, snakeSegments, createSeededRandom(42));
        expect(food).toEqual({ x: CONFIG.cols - 1, y: CONFIG.rows - 1 });
    });

    it("shows non-deterministic spread across multiple free cells", () => {
        const random = createSeededRandom(98);
        const seen = new Set<string>();

        for (let i = 0; i < 200; i += 1) {
            const food = createRandomFoodPosition(CONFIG, BASE_SNAKE, random);
            seen.add(getCoordinateKey(food));
        }

        expect(seen.size).toBeGreaterThan(3);
    });

    it("builds random food state metadata correctly", () => {
        const state = createFoodState(CONFIG, BASE_SNAKE, {
            strategy: "random",
            randomSource: createSequenceRandom([0, 0.5, 0.9])
        });

        expect(state.source).toBe("randomFree");
        expect(state.freeCellCount).toBe(CONFIG.rows * CONFIG.cols - BASE_SNAKE.length);
    });
});
