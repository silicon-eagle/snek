import { fireEvent, render, screen } from "@testing-library/react";
import { act, createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { GameShell } from "../../../src/app/GameShell";
import { GameSessionController } from "../../../src/core/session/gameSession";
import { LOSS_RESTART_DELAY_MS } from "../../../src/core/session/sessionConstants";
import { DEFAULT_CONFIG } from "../../../src/core/types/gameTypes";

describe("reset flow", () => {
    it("auto-restarts after the configured loss delay", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(DEFAULT_CONFIG);
        render(createElement(GameShell, { controller }));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;
        const resetButton = screen.getByRole("button", { name: "Reset" });

        expect(frame).toHaveAttribute("data-session-status", "running");
        expect(frame).toHaveAttribute("data-control-owner", "autonomous");

        fireEvent.keyDown(window, { key: "ArrowUp" });
        act(() => {
            vi.advanceTimersByTime(DEFAULT_CONFIG.tickMs);
        });

        expect(frame).toHaveAttribute("data-control-owner", "manual");

        act(() => {
            controller.forceLossForTests();
        });

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
        expect(frame).toHaveAttribute("data-control-owner", "autonomous");

        act(() => {
            vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS + 500);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");
        controller.dispose();
    });

    it("resets immediately from the loss delay window", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(DEFAULT_CONFIG);
        render(createElement(GameShell, { controller }));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;
        const resetButton = screen.getByRole("button", { name: "Reset" });

        expect(frame).toHaveAttribute("data-session-status", "running");
        expect(frame).toHaveAttribute("data-control-owner", "autonomous");

        fireEvent.keyDown(window, { key: "ArrowUp" });
        act(() => {
            vi.advanceTimersByTime(DEFAULT_CONFIG.tickMs);
        });
        expect(frame).toHaveAttribute("data-control-owner", "manual");

        act(() => {
            controller.forceLossForTests();
        });
        expect(frame).toHaveAttribute("data-session-status", "lost");

        fireEvent.click(resetButton);
        expect(frame).toHaveAttribute("data-session-status", "running");
        expect(frame).toHaveAttribute("data-control-owner", "autonomous");

        act(() => {
            vi.advanceTimersByTime(LOSS_RESTART_DELAY_MS + 1000);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");
        expect(frame).toHaveAttribute("data-control-owner", "autonomous");
        controller.dispose();
    });

    it("ignores movement input while waiting for auto-restart", () => {
        vi.useFakeTimers();
        const controller = new GameSessionController(DEFAULT_CONFIG);
        render(createElement(GameShell, { controller }));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        act(() => {
            controller.forceLossForTests();
        });
        expect(frame).toHaveAttribute("data-session-status", "lost");

        fireEvent.keyDown(window, { key: "ArrowUp" });
        fireEvent.keyDown(window, { key: "ArrowRight" });
        fireEvent.keyDown(window, { key: "ArrowDown" });

        act(() => {
            vi.advanceTimersByTime(DEFAULT_CONFIG.tickMs * 8);
        });

        expect(frame).toHaveAttribute("data-session-status", "lost");
        controller.dispose();
    });
});
