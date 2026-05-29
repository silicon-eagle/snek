import { TickScheduler } from "./tickScheduler";
import { LOSS_RESTART_DELAY_MS } from "./sessionConstants";
import { createInitialSession, reduceSession } from "../state/sessionReducer";
import type { Direction, GameConfig, GameSession, LossRecoveryState, SessionAction } from "../types/gameTypes";

type SessionListener = (session: GameSession) => void;
type TimeoutHandle = ReturnType<typeof setTimeout>;

/**
 * Coordinates reducer updates, tick scheduling, and state subscriptions.
 */
export class GameSessionController {
    private readonly scheduler: TickScheduler;
    private readonly listeners = new Set<SessionListener>();
    private session: GameSession;
    private restartTimeoutId: TimeoutHandle | null = null;
    private lossRecovery: LossRecoveryState | null = null;

    public constructor(config: GameConfig) {
        this.scheduler = new TickScheduler(config.tickMs);
        this.session = createInitialSession(config);
    }

    /**
     * Starts the ticking loop and emits the current snapshot.
     */
    public start(): void {
        if (!this.scheduler.isRunning()) {
            this.scheduler.start(() => {
                this.dispatch({ type: "TICK" });
            });
        }

        this.notify();
    }

    /**
     * Stops ticking and releases all listeners.
     */
    public dispose(): void {
        this.scheduler.stop();
        this.cancelPendingRestart();
        this.listeners.clear();
    }

    /**
     * Registers a listener and immediately emits the current session.
     */
    public subscribe(listener: SessionListener): () => void {
        this.listeners.add(listener);
        listener(this.session);

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Returns the latest session snapshot.
     */
    public getSnapshot(): GameSession {
        return this.session;
    }

    /**
     * Applies a direction change action.
     */
    public turn(direction: Direction): void {
        this.dispatch({ type: "TURN", direction });
    }

    /**
     * Resets to a newly initialized running session.
     */
    public reset(): void {
        this.cancelPendingRestart();
        this.dispatch({ type: "RESET" });
    }

    /**
     * Exposes recovery metadata for timing-focused tests.
     */
    public getLossRecoveryState(): LossRecoveryState | null {
        return this.lossRecovery;
    }

    /**
     * Runs one reducer step and notifies listeners on state changes.
     */
    private dispatch(action: SessionAction): void {
        const previousSession = this.session;
        const nextSession = reduceSession(this.session, action);

        if (nextSession === this.session) {
            return;
        }

        this.session = nextSession;
        this.syncRecoveryLifecycle(previousSession, nextSession, action);
        this.notify();
    }

    /**
     * Keeps delayed restart scheduling in sync with status transitions.
     */
    private syncRecoveryLifecycle(previousSession: GameSession, nextSession: GameSession, action: SessionAction): void {
        if (action.type === "RESET") {
            this.cancelPendingRestart();
            return;
        }

        if (previousSession.status !== "lost" && nextSession.status === "lost") {
            this.scheduleAutoRestart(nextSession);
            return;
        }

        if (previousSession.status === "lost" && nextSession.status !== "lost") {
            this.cancelPendingRestart();
        }
    }

    /**
     * Schedules one automatic reset for the current loss event.
     */
    private scheduleAutoRestart(lostSession: GameSession): void {
        this.cancelPendingRestart();

        const lossDetectedAtMs = Date.now();
        this.lossRecovery = {
            activeSessionId: lostSession.id,
            lossDetectedAtMs,
            restartDelayMs: LOSS_RESTART_DELAY_MS,
            restartDueAtMs: lossDetectedAtMs + LOSS_RESTART_DELAY_MS,
            pending: true
        };

        this.restartTimeoutId = setTimeout(() => {
            if (!this.lossRecovery || this.lossRecovery.activeSessionId !== lostSession.id) {
                return;
            }

            if (this.session.id !== lostSession.id || this.session.status !== "lost") {
                this.cancelPendingRestart();
                return;
            }

            this.dispatch({ type: "RESET" });
        }, LOSS_RESTART_DELAY_MS);
    }

    /**
     * Cancels any pending delayed restart and clears metadata.
     */
    private cancelPendingRestart(): void {
        if (this.restartTimeoutId !== null) {
            clearTimeout(this.restartTimeoutId);
            this.restartTimeoutId = null;
        }

        this.lossRecovery = null;
    }

    /**
     * Broadcasts the current session to all subscribers.
     */
    private notify(): void {
        for (const listener of this.listeners) {
            listener(this.session);
        }
    }
}
