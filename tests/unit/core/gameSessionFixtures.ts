import { createInitialSession, resetSessionCounterForTests } from "../../../src/core/state/sessionReducer";
import type { GameConfig, GameSession } from "../../../src/core/types/gameTypes";

export const TEST_CONFIG: GameConfig = {
    rows: 8,
    cols: 8,
    tickMs: 100
};

export function createRunningSession(config: GameConfig = TEST_CONFIG): GameSession {
    resetSessionCounterForTests();
    return createInitialSession(config);
}
