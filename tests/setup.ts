import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, vi } from "vitest";

class ResizeObserverMock {
    public observe(): void {}

    public unobserve(): void {}

    public disconnect(): void {}
}

beforeAll(() => {
    globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

    const contextMock = {
        beginPath: vi.fn(),
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        lineTo: vi.fn(),
        moveTo: vi.fn(),
        stroke: vi.fn(),
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 1
    };

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        value: vi.fn(() => contextMock)
    });
});

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});
