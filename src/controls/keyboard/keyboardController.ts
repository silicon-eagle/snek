import { isOppositeDirection } from "../../core/rules/snakeRules";
import type { Direction } from "../../core/types/gameTypes";

const ARROW_TO_DIRECTION: Record<string, Direction> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
};

/**
 * Translates keyboard events into valid game turn requests.
 */
export class KeyboardController {
    private readonly onKeyDown = (event: KeyboardEvent) => {
        const nextDirection = ARROW_TO_DIRECTION[event.key];
        if (!nextDirection) {
            return;
        }

        event.preventDefault();

        const currentDirection = this.getCurrentDirection();
        if (isOppositeDirection(currentDirection, nextDirection)) {
            return;
        }

        this.onDirection(nextDirection);
    };

    public constructor(
        private readonly getCurrentDirection: () => Direction,
        private readonly onDirection: (direction: Direction) => void
    ) {}

    /**
     * Registers global key listeners for arrow-key movement input.
     */
    public attach(): void {
        window.addEventListener("keydown", this.onKeyDown);
    }

    /**
     * Removes previously registered key listeners.
     */
    public detach(): void {
        window.removeEventListener("keydown", this.onKeyDown);
    }
}
