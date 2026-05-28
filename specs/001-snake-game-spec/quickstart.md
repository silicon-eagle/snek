# Quickstart: Minimal Snake Game

## Purpose

Validate minimal product behavior:

- square grid only
- arrow-key input only
- auto-start on load
- reset-only control

## Prerequisites

- Node.js 20+
- pnpm 9+
- Desktop browser with keyboard support

## 1. Install and Check Tooling

1. Install dependencies.
2. Confirm quality gates run.

Example commands:

- pnpm install
- pnpm lint
- pnpm format:check
- pnpm typecheck

## 2. Run App

1. Start dev server.
2. Open the app URL.

Example command:

- pnpm dev

## 3. Validate Minimal UI

1. Confirm only two visible elements exist:
    - square game grid
    - reset button
2. Confirm no HUD/status text, no arrow button controls, and no pause/stop/start controls.

## 4. Validate Keyboard-Only Gameplay

1. Confirm game begins automatically on load.
2. Control movement with arrow keys only.
3. Confirm non-arrow keys do not affect movement.
4. Confirm immediate reverse direction is rejected.

## 5. Validate Reset

1. Press reset while running and confirm fresh game starts immediately.
2. Reach terminal state and press reset again.
3. Confirm fresh running session starts without reload.

## 6. Run Automated Tests

- pnpm test
- pnpm test:integration

## 7. Performance Spot Check

1. Play for several minutes with arrow keys.
2. Confirm responsive input and stable rendering.
