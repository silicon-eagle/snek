import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KeyboardController } from "../../../src/controls/keyboard/keyboardController";
import type { Direction } from "../../../src/core/types/gameTypes";

describe("KeyboardController", () => {
    it("accepts arrow keys only and rejects reverse direction", () => {
        let heading: Direction = "right";
        const turns: Direction[] = [];

        const keyboard = new KeyboardController(
            () => heading,
            (nextDirection) => {
                heading = nextDirection;
                turns.push(nextDirection);
            }
        );

        keyboard.attach();

        fireEvent.keyDown(window, { key: "ArrowUp" });
        fireEvent.keyDown(window, { key: "ArrowDown" });
        fireEvent.keyDown(window, { key: "a" });
        fireEvent.keyDown(window, { key: "ArrowLeft" });

        keyboard.detach();

        expect(turns).toEqual(["up", "left"]);
    });
});
