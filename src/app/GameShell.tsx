import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardController } from "../controls/keyboard/keyboardController";
import { GameSessionController } from "../core/session/gameSession";
import { DEFAULT_CONFIG, type GameStatus } from "../core/types/gameTypes";
import { CanvasRenderer } from "../rendering/canvas/canvasRenderer";

/**
 * Keeps the canvas square by syncing renderer size with the frame container.
 */
function useGridResize(
    frameRef: React.RefObject<HTMLDivElement>,
    rendererRef: React.MutableRefObject<CanvasRenderer | null>,
    onResizeRender: () => void
): void {
    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) {
            return;
        }

        const applyResize = () => {
            const renderer = rendererRef.current;
            if (!renderer) {
                return;
            }

            const size = Math.min(frame.clientWidth, frame.clientHeight);
            renderer.resize(size);
            onResizeRender();
        };

        applyResize();

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(applyResize);
            observer.observe(frame);

            return () => {
                observer.disconnect();
            };
        }

        window.addEventListener("resize", applyResize);

        return () => {
            window.removeEventListener("resize", applyResize);
        };
    }, [frameRef, onResizeRender, rendererRef]);
}

/**
 * Renders the minimal snake UI: game grid plus reset button.
 */
export function GameShell(): JSX.Element {
    const frameRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const controllerRef = useRef<GameSessionController | null>(null);
    const rendererRef = useRef<CanvasRenderer | null>(null);
    const [status, setStatus] = useState<GameStatus>("running");

    /**
     * Re-renders the canvas from the latest in-memory game snapshot.
     */
    const renderFromSnapshot = useCallback(() => {
        const controller = controllerRef.current;
        const renderer = rendererRef.current;
        if (!controller || !renderer) {
            return;
        }

        renderer.render(controller.getSnapshot());
    }, []);

    useGridResize(frameRef, rendererRef, renderFromSnapshot);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const controller = new GameSessionController(DEFAULT_CONFIG);
        const renderer = new CanvasRenderer(canvas, DEFAULT_CONFIG);
        const keyboard = new KeyboardController(
            () => controller.getSnapshot().snake.heading,
            (direction) => controller.turn(direction)
        );

        controllerRef.current = controller;
        rendererRef.current = renderer;

        const unsubscribe = controller.subscribe((session) => {
            setStatus(session.status);
            renderer.render(session);
        });

        keyboard.attach();
        controller.start();

        return () => {
            unsubscribe();
            keyboard.detach();
            controller.dispose();

            controllerRef.current = null;
            rendererRef.current = null;
        };
    }, []);

    /**
     * Resets the current session and starts a fresh running game.
     */
    const onReset = useCallback(() => {
        controllerRef.current?.reset();
    }, []);

    return (
        <main className="game-shell">
            <div className="grid-frame" ref={frameRef} data-session-status={status}>
                <canvas className="game-canvas" ref={canvasRef} aria-label="game-grid" />
            </div>
            <button type="button" className="reset-button" onClick={onReset}>
                Reset
            </button>
        </main>
    );
}
