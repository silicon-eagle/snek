import { createInitialSession, resetSessionCounterForTests } from "../../../src/core/state/sessionReducer";
import type { GameConfig, GameSession } from "../../../src/core/types/gameTypes";

export type DeterministicRandom = () => number;

export const TEST_CONFIG: GameConfig = {
    rows: 8,
    cols: 8,
    tickMs: 100
};

export function createRunningSession(config: GameConfig = TEST_CONFIG): GameSession {
    resetSessionCounterForTests();
    return createInitialSession(config);
}

/**
 * Creates a deterministic pseudo-random generator for repeatable tests.
 */
export function createSeededRandom(seed = 1): DeterministicRandom {
    let state = Math.floor(Math.abs(seed)) % 2147483647;
    if (state === 0) {
        state = 1;
    }

    return () => {
        state = (state * 48271) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

/**
 * Creates a deterministic generator that cycles through provided values.
 */
export function createSequenceRandom(values: number[]): DeterministicRandom {
    if (values.length === 0) {
        return () => 0;
    }

    let index = 0;
    return () => {
        const value = values[index % values.length] ?? 0;
        index += 1;
        return value;
    };
}
