import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, vi } from "vitest";

type CanvasContextMock = {
    beginPath: ReturnType<typeof vi.fn>;
    clearRect: ReturnType<typeof vi.fn>;
    fillRect: ReturnType<typeof vi.fn>;
    lineTo: ReturnType<typeof vi.fn>;
    moveTo: ReturnType<typeof vi.fn>;
    stroke: ReturnType<typeof vi.fn>;
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
};

const contextMock: CanvasContextMock = {
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

export function getCanvasContextMock(): CanvasContextMock {
    return contextMock;
}

class ResizeObserverMock {
    public observe(): void {}

    public unobserve(): void {}

    public disconnect(): void {}
}

beforeAll(() => {
    globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        value: vi.fn(() => contextMock)
    });
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
});
