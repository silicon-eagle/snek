import type { GameConfig, GameSession, GameStatus, GridCoordinate } from "../../core/types/gameTypes";

interface RenderPalette {
    background: string;
    grid: string;
    snake: string;
    food: string;
}

const DEFAULT_PALETTE: RenderPalette = {
    background: "#05070a",
    grid: "#1a1e24",
    snake: "#3ce46f",
    food: "#ff5b57"
};

const LOSS_PALETTE: RenderPalette = {
    background: "#2a0808",
    grid: "#5c1515",
    snake: "#ff7d7d",
    food: "#ff4b4b"
};

export function getPaletteForStatus(status: GameStatus): Readonly<RenderPalette> {
    return status === "lost" ? LOSS_PALETTE : DEFAULT_PALETTE;
}

/**
 * Draws the minimal snake scene onto a square HTML canvas.
 */
export class CanvasRenderer {
    private readonly context: CanvasRenderingContext2D;

    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly config: GameConfig
    ) {
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("2d canvas context is required");
        }

        this.context = context;
        this.resize(480);
    }

    /**
     * Resizes the backing canvas to a square pixel size.
     */
    public resize(pixelSize: number): void {
        const size = Math.max(160, Math.floor(pixelSize));
        this.canvas.width = size;
        this.canvas.height = size;
    }

    /**
     * Renders the full frame for the provided game session.
     */
    public render(session: GameSession): void {
        const { context } = this;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const palette = getPaletteForStatus(session.status);

        context.clearRect(0, 0, width, height);
        context.fillStyle = palette.background;
        context.fillRect(0, 0, width, height);

        this.drawGrid(palette);
        this.drawFood(session.food.position, palette);
        this.drawSnake(session.snake.segments, palette);
    }

    /**
     * Draws grid lines for row and column boundaries.
     */
    private drawGrid(palette: Readonly<RenderPalette>): void {
        const { context } = this;
        const cellWidth = this.canvas.width / this.config.cols;
        const cellHeight = this.canvas.height / this.config.rows;

        context.beginPath();
        context.strokeStyle = palette.grid;
        context.lineWidth = 1;

        for (let x = 0; x <= this.config.cols; x += 1) {
            const px = x * cellWidth;
            context.moveTo(px, 0);
            context.lineTo(px, this.canvas.height);
        }

        for (let y = 0; y <= this.config.rows; y += 1) {
            const py = y * cellHeight;
            context.moveTo(0, py);
            context.lineTo(this.canvas.width, py);
        }

        context.stroke();
    }

    /**
     * Draws each snake segment as a filled grid cell.
     */
    private drawSnake(segments: GridCoordinate[], palette: Readonly<RenderPalette>): void {
        const { context } = this;
        const cellWidth = this.canvas.width / this.config.cols;
        const cellHeight = this.canvas.height / this.config.rows;

        context.fillStyle = palette.snake;
        for (const segment of segments) {
            context.fillRect(segment.x * cellWidth, segment.y * cellHeight, cellWidth, cellHeight);
        }
    }

    /**
     * Draws the active food position as a filled grid cell.
     */
    private drawFood(position: GridCoordinate, palette: Readonly<RenderPalette>): void {
        const { context } = this;
        const cellWidth = this.canvas.width / this.config.cols;
        const cellHeight = this.canvas.height / this.config.rows;

        context.fillStyle = palette.food;
        context.fillRect(position.x * cellWidth, position.y * cellHeight, cellWidth, cellHeight);
    }
}
