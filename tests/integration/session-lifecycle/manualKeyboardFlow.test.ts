import { render, screen } from "@testing-library/react";
import { act, createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { GameShell } from "../../../src/app/GameShell";

describe("manual keyboard flow", () => {
    it("auto-starts in running state on initial load", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        expect(frame).not.toBeNull();
        expect(frame).toHaveAttribute("data-session-status", "running");

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");
    });

    it("keeps running after crossing the right border", () => {
        vi.useFakeTimers();
        render(createElement(GameShell));

        const canvas = screen.getByLabelText("game-grid");
        const frame = canvas.parentElement;

        expect(frame).toHaveAttribute("data-session-status", "running");

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        expect(frame).toHaveAttribute("data-session-status", "running");
    });
});
