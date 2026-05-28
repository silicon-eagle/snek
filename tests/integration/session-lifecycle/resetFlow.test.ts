import { fireEvent, render, screen } from "@testing-library/react";
import { act, createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { GameShell } from "../../../src/app/GameShell";

describe("reset flow", () => {
    it("resets from running and terminal states", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;
        const resetButton = screen.getByRole("button", { name: "Reset" });

        expect(frame).toHaveAttribute("data-session-status", "running");

        fireEvent.click(resetButton);
        expect(frame).toHaveAttribute("data-session-status", "running");

        act(() => {
            vi.advanceTimersByTime(2500);
        });

        expect(frame).toHaveAttribute("data-session-status", "lost");

        fireEvent.click(resetButton);
        expect(frame).toHaveAttribute("data-session-status", "running");
    });
});
