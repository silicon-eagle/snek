# Quickstart: Snake Wraparound Recovery

## Purpose

Validate the feature behavior for:

- automatic startup
- border wrap-through movement
- full red loss visual mode
- delayed automatic restart with reset override

## Feature Summary

- Gameplay starts automatically on app load with no manual start control.
- Crossing any border wraps the snake to the opposite edge lane.
- A loss immediately switches the game surface to a red visual state.
- Automatic restart begins about 3 seconds after loss unless reset is pressed first.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Desktop browser with keyboard input

## 1. Install and Verify Tooling

Run:

- pnpm install
- pnpm lint
- pnpm typecheck

## 2. Start the App

Run:

- pnpm dev

Open the local Vite URL and keep browser devtools optional for timing checks.

## 3. Validate Automatic Startup

1. Reload the page.
2. Confirm the game session is immediately in running state.
3. Confirm no manual start action is required.

## 4. Validate Border Wrap-Through

1. Steer the snake into each boundary (left, right, top, bottom).
2. Confirm head position reappears at opposite border lane each time.
3. Confirm movement cadence and heading continue without interruption.
4. Confirm wrapping into occupied body results in loss.

## 5. Validate Loss-Red and Auto-Restart

1. Cause a collision loss.
2. Confirm gameplay surface switches to red theme immediately.
3. During delay window, press arrow keys and confirm board state does not advance.
4. Wait for automatic restart and confirm fresh running session begins in about 3 seconds (target window: 2.5 to 3.5 seconds).

## 6. Validate Reset Override During Delay

1. Cause a loss.
2. Press reset before the delay ends.
3. Confirm immediate fresh running session starts.
4. Confirm no second auto-restart fires from the canceled timer after the original delay window elapses.

## 7. Run Automated Tests

Run:

- pnpm test
- pnpm test:integration

Recommended focus additions for this feature:

- reducer/rules wrap behavior tests
- session orchestration delayed restart timer tests
- integration tests for loss-red and restart timing window

## 8. Performance Spot Check

1. Play for several minutes with frequent border wrapping.
2. Confirm smooth rendering and responsive input.
3. Repeat several loss cycles and confirm consistent 3-second recovery behavior.
