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
        expect(next.controlMode.owner).toBe("autonomous");
    });

    it("switches to manual ownership on valid interception", () => {
        const session = createRunningSession();
        const next = reduceSession(session, { type: "TURN", direction: "up" });

        expect(next.controlMode.owner).toBe("manual");
        expect(next.controlMode.switchedAtTick).toBe(session.tick + 1);
        expect(next.snake.heading).toBe("up");
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

    it("wraps across the border instead of losing", () => {
        const smallConfig: GameConfig = { rows: 4, cols: 4, tickMs: 100 };
        let session = createInitialSession(smallConfig);

        session = reduceSession(session, { type: "SET_CONTROL_OWNER", owner: "manual" });

        for (let step = 0; step < 2; step += 1) {
            session = reduceSession(session, { type: "TICK" });
        }

        expect(session.status).toBe("running");
        expect(session.snake.segments[0]).toEqual({ x: 0, y: 2 });
    });

    it("transitions to lost when wrapped head overlaps the body", () => {
        const config: GameConfig = { rows: 5, cols: 5, tickMs: 100 };
        const session = {
            ...createInitialSession(config),
            status: "running" as const,
            snake: {
                segments: [
                    { x: 4, y: 2 },
                    { x: 0, y: 2 },
                    { x: 0, y: 3 }
                ],
                heading: "right" as const,
                pendingGrowth: 0
            },
            food: {
                position: { x: 1, y: 1 },
                freeCellCount: 22,
                source: "deterministicScan" as const
            }
        };

        const next = reduceSession(session, { type: "TICK" });

        expect(session.status).toBe("running");
        expect(next.status).toBe("lost");
        expect(next.tick).toBe(session.tick + 1);
    });

    it("creates a fresh running session on reset", () => {
        let session = createRunningSession();
        session = reduceSession(session, { type: "TURN", direction: "up" });
        session = reduceSession(session, { type: "TICK" });
        session = reduceSession(session, { type: "RESET" });

        expect(session.status).toBe("running");
        expect(session.controlMode.owner).toBe("autonomous");
        expect(session.score).toBe(0);
        expect(session.tick).toBe(0);
    });

    it("keeps manual ownership active until round end", () => {
        let session = createRunningSession();
        session = reduceSession(session, { type: "TURN", direction: "up" });

        for (let step = 0; step < 5; step += 1) {
            session = reduceSession(session, { type: "TICK" });
            expect(session.controlMode.owner).toBe("manual");
        }
    });
});
