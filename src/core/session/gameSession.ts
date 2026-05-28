import { TickScheduler } from "./tickScheduler";
import { createInitialSession, reduceSession } from "../state/sessionReducer";
import type { Direction, GameConfig, GameSession, SessionAction } from "../types/gameTypes";

type SessionListener = (session: GameSession) => void;

/**
 * Coordinates reducer updates, tick scheduling, and state subscriptions.
 */
export class GameSessionController {
    private readonly scheduler: TickScheduler;
    private readonly listeners = new Set<SessionListener>();
    private session: GameSession;

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
        this.dispatch({ type: "RESET" });
    }

    /**
     * Runs one reducer step and notifies listeners on state changes.
     */
    private dispatch(action: SessionAction): void {
        const nextSession = reduceSession(this.session, action);

        if (nextSession === this.session) {
            return;
        }

        this.session = nextSession;
        this.notify();
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
