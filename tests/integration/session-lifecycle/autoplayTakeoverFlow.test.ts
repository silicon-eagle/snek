import { fireEvent, render, screen } from "@testing-library/react";
import { act, createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { GameShell } from "../../../src/app/GameShell";
import { DEFAULT_CONFIG } from "../../../src/core/types/gameTypes";

function advanceTicks(tickCount: number): void {
    act(() => {
        vi.advanceTimersByTime(tickCount * DEFAULT_CONFIG.tickMs);
    });
}

describe("autoplay takeover flow", () => {
    it("runs in autonomous mode by default without keyboard input", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        expect(frame).toHaveAttribute("data-control-owner", "autonomous");

        advanceTicks(10);

        expect(frame).toHaveAttribute("data-control-owner", "autonomous");
        expect(frame).toHaveAttribute("data-session-status", "running");
    });

    it("switches to manual control after valid interception input", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        expect(frame).toHaveAttribute("data-control-owner", "autonomous");

        fireEvent.keyDown(window, { key: "ArrowUp" });
        advanceTicks(1);

        expect(frame).toHaveAttribute("data-control-owner", "manual");

        advanceTicks(8);
        expect(frame).toHaveAttribute("data-control-owner", "manual");
    });

    it("keeps autonomous mode for invalid interception input", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        fireEvent.keyDown(window, { key: "ArrowLeft" });
        fireEvent.keyDown(window, { key: "a" });
        advanceTicks(2);

        expect(frame).toHaveAttribute("data-control-owner", "autonomous");
    });
});
