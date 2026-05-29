# Quickstart Validation: Hamiltonian Autoplay With Random Food

Date: 2026-05-29

## Quality Gates

- pnpm format:check: PASS
- pnpm lint: PASS
- pnpm typecheck: PASS
- pnpm test: PASS (12 files, 42 tests)
- pnpm test:integration: PASS (4 files, 9 tests)
- pnpm dev: PASS (Vite served at http://localhost:5173)

## Feature Evidence

### Autonomous Hamiltonian Default

- Verified in integration flow: autoplay runs without keyboard input and remains in autonomous mode.
- Route integrity validated in unit tests for coverage, uniqueness, continuity, and closure.

### Random Food Spawn

- Unit tests validate random spawn never overlaps snake segments.
- One-free-cell edge case is covered and passes.
- Distribution sanity check confirms non-fixed placement spread across eligible cells.

### Keyboard Takeover Handoff

- Integration flow confirms valid interception switches to manual ownership by the next tick.
- Invalid interception input preserves autonomous ownership.
- Reducer tests confirm manual ownership persists until round end/reset.

### Restart Defaults and Loss Delay

- Integration and controller tests confirm loss-delay restart returns to autonomous ownership.
- Duplicate/stale restart callback regressions are covered and passing.
- Loss-delay input freeze semantics are covered and passing.

## Performance Spot-Check Evidence

- Route step and takeover timing are bounded by single-tick reducer updates in tests.
- Restart delay is validated around LOSS_RESTART_DELAY_MS (3000 ms) and remains within the target restart window requirement.
- Random free-cell selection uses a precomputed free-cell list and constant-time indexed pick from RNG output.

## Notes

- resetFlow integration emits React act() warnings in jsdom while timers advance rapidly; these warnings are non-blocking and all assertions pass.
