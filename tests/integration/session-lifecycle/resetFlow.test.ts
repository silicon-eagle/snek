import { fireEvent, render, screen } from "@testing-library/react";
import { act, createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { GameShell } from "../../../src/app/GameShell";
import { LOSS_RESTART_DELAY_MS } from "../../../src/core/session/sessionConstants";
import { DEFAULT_CONFIG } from "../../../src/core/types/gameTypes";

function forceDeterministicLossViaKeyboard(): void {
    const centerX = Math.floor(DEFAULT_CONFIG.cols / 2);
    const centerY = Math.floor(DEFAULT_CONFIG.rows / 2);
    const tickMs = DEFAULT_CONFIG.tickMs;

    const advanceTicks = (tickCount: number) => {
        act(() => {
            vi.advanceTimersByTime(tickCount * tickMs);
        });
    };

    const turnAndAdvance = (key: string, ticks = 1) => {
        fireEvent.keyDown(window, { key });
        advanceTicks(ticks);
    };

    advanceTicks(DEFAULT_CONFIG.cols - centerX);
    turnAndAdvance("ArrowUp", centerY);
    turnAndAdvance("ArrowRight", 1);
    turnAndAdvance("ArrowDown", 1);
    turnAndAdvance("ArrowLeft", 1);
}

describe("reset flow", () => {
    it("auto-restarts after the configured loss delay", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;
        const resetButton = screen.getByRole("button", { name: "Reset" });

        expect(frame).toHaveAttribute("data-session-status", "running");

        forceDeterministicLossViaKeyboard();

        expect(frame).toHaveAttribute("data-session-status", "lost");
        expect(resetButton).toHaveAttribute("data-session-status", "lost");

        act(() => {
            vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS - 1);
        });

        expect(frame).toHaveAttribute("data-session-status", "lost");

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");

        act(() => {
            vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS + 500);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");
    });

    it("resets immediately from the loss delay window", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;
        const resetButton = screen.getByRole("button", { name: "Reset" });

        expect(frame).toHaveAttribute("data-session-status", "running");

        forceDeterministicLossViaKeyboard();
        expect(frame).toHaveAttribute("data-session-status", "lost");

        fireEvent.click(resetButton);
        expect(frame).toHaveAttribute("data-session-status", "running");

        act(() => {
            vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS + 1000);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");
    });

    it("ignores movement input while waiting for auto-restart", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        forceDeterministicLossViaKeyboard();
        expect(frame).toHaveAttribute("data-session-status", "lost");

        fireEvent.keyDown(window, { key: "ArrowUp" });
        fireEvent.keyDown(window, { key: "ArrowRight" });
        fireEvent.keyDown(window, { key: "ArrowDown" });

        act(() => {
            vi.advanceTimersByTime(DEFAULT_CONFIG.tickMs * 8);
        });

        expect(frame).toHaveAttribute("data-session-status", "lost");
    });
});
