import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { GameShell } from "../../../src/app/GameShell";

describe("minimal UI surface", () => {
    it("renders only the grid canvas and one reset button", () => {
        const { container } = render(createElement(GameShell));

        const canvases = container.querySelectorAll("canvas");
        const buttons = screen.getAllByRole("button");

        expect(canvases).toHaveLength(1);
        expect(buttons).toHaveLength(1);
        expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();

        expect(screen.queryByText(/score/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/game over/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/start/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/stop/i)).not.toBeInTheDocument();
    });
});
