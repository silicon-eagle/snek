export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "running" | "won" | "lost";

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
}

export interface GameSession {
    id: string;
    status: GameStatus;
    score: number;
    tick: number;
    config: GameConfig;
    snake: SnakeState;
    food: FoodState;
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
