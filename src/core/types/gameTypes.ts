export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "running" | "won" | "lost";

export type ControlOwner = "autonomous" | "manual";

export type FoodSpawnSource = "deterministicScan" | "randomFree";

export interface GameConfig {
    rows: number;
    cols: number;
    tickMs: number;
}

export interface GridCoordinate {
    x: number;
    y: number;
}

export interface SnakeState {
    segments: GridCoordinate[];
    heading: Direction;
    pendingGrowth: number;
}

export interface FoodState {
    position: GridCoordinate;
    freeCellCount: number;
    source: FoodSpawnSource;
}

export interface ControlModeState {
    owner: ControlOwner;
    switchedAtTick: number | null;
}

export interface HamiltonianRouteState {
    cycle: GridCoordinate[];
    indexByCell: Record<string, number>;
    currentRouteStep: number;
    supported: boolean;
}

export interface GameSession {
    id: string;
    status: GameStatus;
    score: number;
    tick: number;
    config: GameConfig;
    controlMode: ControlModeState;
    snake: SnakeState;
    food: FoodState;
    route: HamiltonianRouteState;
}

export interface LossRecoveryState {
    activeSessionId: string;
    lossDetectedAtMs: number;
    restartDelayMs: number;
    restartDueAtMs: number;
    pending: boolean;
}

export type SessionAction =
    | {
          type: "TURN";
          direction: Direction;
      }
    | {
          type: "SET_CONTROL_OWNER";
          owner: ControlOwner;
          switchedAtTick?: number | null;
      }
    | {
          type: "TICK";
      }
    | {
          type: "RESET";
      };

export const DEFAULT_CONFIG: GameConfig = {
    rows: 20,
    cols: 20,
    tickMs: 120
};
