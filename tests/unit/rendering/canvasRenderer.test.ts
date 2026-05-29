import { describe, expect, it } from "vitest";
import { createInitialSession } from "../../../src/core/state/sessionReducer";
import { CanvasRenderer, getPaletteForStatus } from "../../../src/rendering/canvas/canvasRenderer";
import { getCanvasContextMock } from "../../setup";

describe("CanvasRenderer", () => {
    it("selects the loss palette for lost status", () => {
        const runningPalette = getPaletteForStatus("running");
        const lossPalette = getPaletteForStatus("lost");

        expect(lossPalette).not.toEqual(runningPalette);
        expect(lossPalette.background).not.toBe(runningPalette.background);
        expect(lossPalette.grid).not.toBe(runningPalette.grid);
        expect(lossPalette.snake).not.toBe(runningPalette.snake);
        expect(lossPalette.food).not.toBe(runningPalette.food);
    });

    it("renders loss-state frame using loss palette colors", () => {
        const config = { rows: 8, cols: 8, tickMs: 120 };
        const canvas = document.createElement("canvas");
        const renderer = new CanvasRenderer(canvas, config);
        const context = getCanvasContextMock();
        const usedFillStyles: string[] = [];

        context.fillRect.mockImplementation(() => {
            usedFillStyles.push(context.fillStyle);
        });

        const runningSession = createInitialSession(config);
        const lostSession = {
            ...runningSession,
            status: "lost" as const
        };

        renderer.render(lostSession);

        const lossPalette = getPaletteForStatus("lost");
        expect(usedFillStyles).toContain(lossPalette.background);
        expect(usedFillStyles).toContain(lossPalette.snake);
        expect(usedFillStyles).toContain(lossPalette.food);
    });
});
