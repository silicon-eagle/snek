import { describe, expect, it, vi } from "vitest";
import { GameSessionController } from "../../../src/core/session/gameSession";
import { LOSS_RESTART_DELAY_MS } from "../../../src/core/session/sessionConstants";
import { TEST_CONFIG } from "./gameSessionFixtures";

function advanceTicks(tickCount: number): void {
    vi.advanceTimersByTime(tickCount * TEST_CONFIG.tickMs);
}

function forceDeterministicLoss(controller: GameSessionController): void {
    controller.forceLossForTests();
}

describe("GameSessionController", () => {
    it("starts in running state and notifies subscribers", () => {
        const controller = new GameSessionController(TEST_CONFIG);
        const observedStatuses: string[] = [];

        const unsubscribe = controller.subscribe((session) => {
            observedStatuses.push(session.status);
        });

        controller.start();

        expect(observedStatuses.at(-1)).toBe("running");
        expect(controller.getControlOwner()).toBe("autonomous");

        unsubscribe();
        controller.dispose();
    });

    it("returns to autonomous mode after manual-loss auto-restart", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(TEST_CONFIG);

        controller.start();
        controller.turn("up");
        advanceTicks(1);

        expect(controller.getControlOwner()).toBe("manual");

        forceDeterministicLoss(controller);
        expect(controller.getSnapshot().status).toBe("lost");

        vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS);

        expect(controller.getSnapshot().status).toBe("running");
        expect(controller.getControlOwner()).toBe("autonomous");

        controller.dispose();
    });

    it("keeps recovery metadata empty while no loss happened", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(TEST_CONFIG);

        controller.start();

        expect(controller.getLossRecoveryState()).toBeNull();

        controller.dispose();
    });

    it("schedules a delayed restart after loss and restarts once", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(TEST_CONFIG);

        controller.start();
        forceDeterministicLoss(controller);

        expect(controller.getSnapshot().status).toBe("lost");
        expect(controller.getLossRecoveryState()).not.toBeNull();

        vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS - 1);
        expect(controller.getSnapshot().status).toBe("lost");

        vi.advanceTimersByTime(1);
        expect(controller.getSnapshot().status).toBe("running");
        expect(controller.getLossRecoveryState()).toBeNull();

        controller.dispose();
    });

    it("cancels pending restart when reset is pressed during loss delay", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(TEST_CONFIG);

        controller.start();
        forceDeterministicLoss(controller);

        expect(controller.getSnapshot().status).toBe("lost");
        expect(controller.getLossRecoveryState()).not.toBeNull();

        controller.reset();
        const resetSessionId = controller.getSnapshot().id;

        expect(controller.getSnapshot().status).toBe("running");
        expect(controller.getLossRecoveryState()).toBeNull();

        vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS + 2000);
        expect(controller.getSnapshot().status).toBe("running");
        expect(controller.getSnapshot().id).toBe(resetSessionId);

        controller.dispose();
    });

    it("ignores stale restart callback after manual reset", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(TEST_CONFIG);

        controller.start();
        forceDeterministicLoss(controller);

        expect(controller.getSnapshot().status).toBe("lost");

        controller.reset();
        const resetSessionId = controller.getSnapshot().id;

        vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS + 5);

        expect(controller.getSnapshot().status).toBe("running");
        expect(controller.getSnapshot().id).toBe(resetSessionId);
        expect(controller.getControlOwner()).toBe("autonomous");

        controller.dispose();
    });

    it("triggers only one auto-restart for a single loss event", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(TEST_CONFIG);
        const observedSessionIds: string[] = [];

        controller.subscribe((session) => {
            observedSessionIds.push(session.id);
        });
        controller.start();

        forceDeterministicLoss(controller);
        const lostSessionId = controller.getSnapshot().id;

        vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS);

        const restartedSessionId = controller.getSnapshot().id;
        expect(restartedSessionId).not.toBe(lostSessionId);

        vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS * 2);
        expect(controller.getSnapshot().id).toBe(restartedSessionId);

        const uniqueSessionIds = [...new Set(observedSessionIds)];
        expect(uniqueSessionIds).toHaveLength(2);

        controller.dispose();
    });
});
