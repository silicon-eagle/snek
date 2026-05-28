/**
 * Runs a fixed-interval callback for driving game ticks.
 */
export class TickScheduler {
    private timerId: ReturnType<typeof setInterval> | null = null;

    public constructor(private readonly tickMs: number) {}

    /**
     * Starts scheduling ticks if not already running.
     */
    public start(onTick: () => void): void {
        if (this.timerId !== null) {
            return;
        }

        this.timerId = setInterval(onTick, this.tickMs);
    }

    /**
     * Stops scheduling ticks.
     */
    public stop(): void {
        if (this.timerId === null) {
            return;
        }

        clearInterval(this.timerId);
        this.timerId = null;
    }

    /**
     * Reports whether the scheduler currently has an active timer.
     */
    public isRunning(): boolean {
        return this.timerId !== null;
    }
}
