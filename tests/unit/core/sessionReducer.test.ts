import { describe, expect, it } from "vitest";
import { createInitialSession, reduceSession } from "../../../src/core/state/sessionReducer";
import { isSameCoordinate } from "../../../src/core/state/foodSpawner";
import type { GameConfig } from "../../../src/core/types/gameTypes";
import { createRunningSession } from "./gameSessionFixtures";

describe("sessionReducer", () => {
    it("creates a running session with food outside the snake", () => {
        const session = createRunningSession();
        expect(session.status).toBe("running");

        const overlap = session.snake.segments.some((segment) => isSameCoordinate(segment, session.food.position));
        expect(overlap).toBe(false);
    });

    it("rejects immediate reverse turns", () => {
        const session = createRunningSession();
        const next = reduceSession(session, { type: "TURN", direction: "left" });
        expect(next.snake.heading).toBe("right");
    });

    it("moves the head forward on each tick", () => {
        const session = createRunningSession();
        const next = reduceSession(session, { type: "TICK" });

        expect(next.snake.segments[0]).toEqual({
            x: session.snake.segments[0]!.x + 1,
            y: session.snake.segments[0]!.y
        });
        expect(next.tick).toBe(1);
    });

    it("transitions to lost on wall collision", () => {
        const smallConfig: GameConfig = { rows: 4, cols: 4, tickMs: 100 };
        let session = createInitialSession(smallConfig);

        for (let step = 0; step < 4; step += 1) {
            session = reduceSession(session, { type: "TICK" });
        }

        expect(session.status).toBe("lost");
    });

    it("creates a fresh running session on reset", () => {
        let session = createRunningSession();
        session = reduceSession(session, { type: "TICK" });
        session = reduceSession(session, { type: "RESET" });

        expect(session.status).toBe("running");
        expect(session.score).toBe(0);
        expect(session.tick).toBe(0);
    });
});
