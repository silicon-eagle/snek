# Feature Specification: Minimal Snake Game

**Feature Branch**: `[001-run-pre-spec-hook]`

**Created**: 2026-05-28

**Status**: Draft (Greenfield Design)

**Input**: User direction: "Minimal UI only: square grid, keyboard arrows only, auto-start, reset only, minimal code and abstractions."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Play Snake With Arrow Keys Only (Priority: P1)

As a player, I want to control the snake using only arrow keys so gameplay is clean and distraction-free.

**Why this priority**: Keyboard-only manual play is the full product scope for the initial release.

**Independent Test**: Load the game, verify it starts automatically, steer using arrow keys, and confirm valid win/lose behavior.

**Acceptance Scenarios**:

1. **Given** the game loads, **When** initialization completes, **Then** the snake session starts automatically without pressing start.
2. **Given** the player presses arrow keys, **When** input is processed, **Then** only valid direction changes are applied.
3. **Given** the snake reaches food, **When** the tick resolves, **Then** the snake grows and score logic updates internally.
4. **Given** the snake collides with wall or itself, **When** the tick resolves, **Then** the session enters terminal state until reset.

---

### User Story 2 - Reset Quickly and Continue (Priority: P2)

As a player, I want one reset button so I can immediately restart without extra controls.

**Why this priority**: Reset is the only control action besides arrow-key movement.

**Independent Test**: Press reset during running and terminal states, verify new session starts immediately.

**Acceptance Scenarios**:

1. **Given** a running session, **When** reset is pressed, **Then** a fresh session starts immediately.
2. **Given** a won/lost session, **When** reset is pressed, **Then** a fresh running session starts without page reload.

---

### Edge Cases

- Rapid arrow-key input bursts during consecutive ticks.
- OS-level key-repeat while holding one arrow key.
- Illegal immediate reverse-direction inputs.
- Repeated reset presses in quick succession.
- Viewport resize while preserving a square game grid.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST auto-start a new game session when the app loads.
- **FR-002**: UI MUST contain only a square game grid and a single reset button.
- **FR-003**: System MUST accept movement input from keyboard arrow keys only.
- **FR-004**: System MUST ignore all non-arrow movement keys and must not render on-screen arrow buttons.
- **FR-005**: System MUST prevent immediate reverse-direction turns.
- **FR-006**: System MUST keep gameplay rules for food, growth, win, and lose outcomes deterministic.
- **FR-007**: System MUST provide only one manual control action: reset.
- **FR-008**: System MUST NOT expose start, pause, resume, stop, mode toggle, or autoplay controls in UI.
- **FR-009**: UI MUST NOT render HUD text, status text, score text, or instructional text during gameplay.
- **FR-010**: Implementation MUST minimize unnecessary abstractions and keep logic paths direct and small.

### Architecture & Tooling Constraints _(mandatory)_

- **AT-001**: The project MUST use pnpm as the package manager for dependency management and script execution.
- **AT-002**: The project MUST use tsc as the authoritative type-checking step and treat type errors as blocking.
- **AT-003**: The project MUST use tsx for running TypeScript utility scripts directly during development workflows.
- **AT-004**: The project MUST use eslint for linting TypeScript and React code before merge.
- **AT-005**: The project MUST use prettier for formatting and formatting checks.
- **AT-006**: The project MUST use vitest as the primary automated test runner for unit and integration-oriented suites.
- **AT-007**: The project MUST use vite as the application development server and build pipeline.

### User Experience Consistency Requirements _(mandatory)_

- **UX-001**: The visible layout MUST remain minimal: centered square grid plus reset button only.
- **UX-002**: Keyboard arrow behavior MUST be consistent across supported desktop browsers.
- **UX-003**: Reset action MUST be immediately responsive and predictable.
- **UX-004**: No extra UI chrome (HUD, overlays, control panels) may appear.

### Performance Requirements _(mandatory)_

- **PRF-001**: During normal gameplay on default settings, the game MUST maintain median frame rate of at least 55 FPS.
- **PRF-002**: The 95th percentile input-to-visible-movement latency in manual mode MUST be 100 ms or lower.
- **PRF-003**: Reset action MUST restore a fresh running session in under 100 ms in local test runs.

### Key Entities _(include if feature involves data)_

- **GameConfig**: Immutable runtime settings (rows, cols, tickMs).
- **SnakeState**: Ordered segments, heading, pending growth.
- **FoodState**: Current food coordinate.
- **GameSession**: Session status, snake, food, score, tick.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of app loads start gameplay automatically without a start button.
- **SC-002**: 100% of movement input coverage in tests uses arrow keys only.
- **SC-003**: 100% of reset actions in tests produce a fresh running session.
- **SC-004**: No UI element other than the grid and reset button appears in integration tests.

## Assumptions

- Initial release scope is manual keyboard gameplay only.
- Autoplay, touch controls, embedding lifecycle UI, soundtrack controls, and mode toggles are deferred.
- Single-player local session only; no backend persistence.
