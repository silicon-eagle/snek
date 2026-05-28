# Research: Minimal Snake Game

## Decision 1: Canvas + React for Initial Build

Decision: Use React for app bootstrap and lifecycle, and render the game in a Canvas-based square grid.

Rationale: This keeps rendering efficient while supporting the intended minimal UI surface.

Alternatives considered:

- DOM-grid rendering: simpler visually, but less efficient for frequent updates.
- Rich HUD and control panels: not selected for initial release scope.

## Decision 2: Keyboard Arrow Input Only

Decision: Accept only arrow keys for movement and ignore all other movement inputs.

Rationale: Enforces a single interaction model and removes ambiguity.

Alternatives considered:

- WASD or touch controls: deferred to future exploration.

## Decision 3: Auto-Start + Reset-Only Session Control

Decision: Session starts automatically when app mounts; only one UI action exists: reset.

Rationale: Removes control complexity and matches requested behavior.

Alternatives considered:

- Start/pause/resume/stop lifecycle controls: deferred to avoid unnecessary UI and logic overhead.

## Decision 4: Minimal Core State Surface

Decision: Define essential session state only (running/won/lost, snake, food, score, tick) for the initial implementation.

Rationale: Directly supports the "minimal code and abstractions" requirement.

Alternatives considered:

- Broader mode and autoplay state models: deferred due to added complexity.

## Decision 5: Test Strategy Focused on Minimal Behavior

Decision: Keep unit and integration tests focused on keyboard movement, auto-start, reset, and minimal UI assertions.

Rationale: Test coverage should enforce the reduced product surface instead of legacy features.

Alternatives considered:

- Expanding required gates to autoplay and embedding suites: deferred from initial release.

## Decision 6: Standardized Toolchain Remains

Decision: Keep pnpm + tsc + tsx + eslint + prettier + vitest + vite.

Rationale: Tool consistency is still valuable even with reduced feature scope.
