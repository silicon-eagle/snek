# Quickstart: Hamiltonian Autoplay With Random Food

## Purpose

Validate the feature behavior for:

- autonomous Hamiltonian-cycle default control
- random food placement on unoccupied cells
- keyboard interception takeover to manual control
- startup and post-loss restart returning to autonomous mode

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

Open the local URL from Vite.

## 3. Validate Default Autonomous Behavior

1. Reload the app.
2. Confirm the snake starts moving without manual input.
3. Observe that movement follows a repeatable board-covering route.

## 4. Validate Random Food Placement

1. Observe food at round start and after multiple food consumptions.
2. Confirm food always appears on unoccupied cells.
3. Confirm food placement is not fixed to deterministic scan order behavior.

## 5. Validate Manual Interception Takeover

1. While autonomous mode is active, press a valid arrow key.
2. Confirm control switches to manual by the next movement tick.
3. Confirm invalid interception input does not trigger mode handoff.
4. Continue movement for several ticks and confirm manual ownership persists.

## 6. Validate Loss and Restart Defaults

1. Trigger a loss from autonomous mode and from manual mode in separate runs.
2. Confirm loss-red state appears and holds during delay.
3. Confirm restart begins in about 3 seconds (target window: 2.5 to 3.5 seconds).
4. Confirm the restarted session returns to autonomous default mode.
5. Confirm movement input during loss-delay does not change game state before restart.

## 7. Run Automated Tests

Run:

- pnpm test
- pnpm test:integration

Recommended focus:

- Hamiltonian route construction and next-step tests
- random food placement constraints and distribution sanity checks
- control handoff timing and restart-default mode tests

## 8. Performance Spot Check

1. Run several long unattended autonomous rounds.
2. Confirm stable rendering responsiveness and no visible stutter.
3. Confirm repeated takeover events remain responsive by next tick.
