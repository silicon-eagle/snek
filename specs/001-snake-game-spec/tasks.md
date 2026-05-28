# Tasks: Minimal Snake Game

**Input**: Greenfield specification from /specs/001-snake-game-spec/spec.md

**Prerequisites**: plan.md (required), spec.md (required), data-model.md, quickstart.md

**Tests**: Required. This scope uses unit and integration tests for keyboard-only minimal gameplay.

**Organization**: Tasks are grouped by build phase from foundation through validation.

**Toolchain Standard**: pnpm, tsc, tsx, eslint, prettier, vitest, vite

## Phase 1: Foundation

**Purpose**: Establish the minimal project skeleton and core boundaries.

- [ ] T001 Define minimal domain and session types in src/core/types/gameTypes.ts (running/won/lost, snake, food, score, tick)
- [ ] T002 Define deterministic grid helpers and food placement primitives in src/core/state/foodSpawner.ts and related state utilities
- [ ] T003 Create lifecycle boundaries for session updates in src/core/state/sessionReducer.ts and src/core/session/tickScheduler.ts
- [ ] T004 Create app shell entry points in src/app/bootstrap.tsx and src/app/GameShell.tsx

**Checkpoint**: The foundation clearly defines state, lifecycle flow, and app bootstrap boundaries.

---

## Phase 2: Core Gameplay Runtime

**Purpose**: Implement deterministic snake rules and session behavior.

- [ ] T005 Implement snake movement and growth rules in src/core/rules/snakeRules.ts
- [ ] T006 Implement terminal-condition evaluation in src/core/rules/terminalConditions.ts (wall collision, self collision, full-grid win)
- [ ] T007 Implement session engine orchestration in src/core/session/gameSession.ts (tick loop + state transitions)
- [ ] T008 Implement reset flow in src/core/session/gameSession.ts and src/core/state/sessionReducer.ts (fresh running session on demand)
- [ ] T009 Implement arrow-key-only controller in src/controls/keyboard/keyboardController.ts (ignore non-arrow input, reject immediate reverse)

**Checkpoint**: Gameplay runs deterministically with keyboard input and a reliable reset path.

---

## Phase 3: Minimal UI Surface

**Purpose**: Deliver the intentional minimal interaction surface.

- [ ] T010 Implement square-grid rendering in src/rendering/canvas/canvasRenderer.ts (grid, snake, food only)
- [ ] T011 Implement minimal shell layout in src/app/GameShell.tsx and src/app/gameShell.css (centered square grid + single reset button)
- [ ] T012 Wire automatic game start on initial load in src/app/bootstrap.tsx and src/app/GameShell.tsx
- [ ] T013 Wire reset button to immediate new running session in src/app/GameShell.tsx

**Checkpoint**: The visible UI is exactly a square grid and one reset button.

---

## Phase 4: Test Coverage (Required)

**Purpose**: Validate behavior and lock the minimal scope.

- [ ] T014 [P] Add reducer/session unit tests in tests/unit/core/sessionReducer.test.ts and tests/unit/core/gameSessionFixtures.ts
- [ ] T015 [P] Add snake-rule unit tests in tests/unit/rules/snakeRules.test.ts (movement, growth, collisions)
- [ ] T016 [P] Add keyboard input unit tests for arrow-only behavior and reverse-direction guard
- [ ] T017 [P] Add integration test for auto-start lifecycle in tests/integration/session-lifecycle/manualKeyboardFlow.test.ts
- [ ] T018 [P] Add integration test for reset behavior from running and terminal states in tests/integration/session-lifecycle/resetFlow.test.ts
- [ ] T019 [P] Add integration test asserting minimal UI surface in tests/integration/session-lifecycle/minimalUiSurface.test.ts

**Checkpoint**: Tests confirm keyboard-only control, auto-start, reset behavior, and minimal UI constraints.

---

## Phase 5: Documentation and Validation

**Purpose**: Align docs and complete quality gates for design-to-build handoff.

- [ ] T020 Document user flow in specs/001-snake-game-spec/quickstart.md and README.md (auto-start, arrow keys, reset)
- [ ] T021 Document architecture and data model in specs/001-snake-game-spec/plan.md and specs/001-snake-game-spec/data-model.md
- [ ] T022 Run quality gates with pnpm format, pnpm lint, pnpm typecheck, pnpm test, and pnpm test:integration; record results in specs/001-snake-game-spec/checklists/quickstart-validation.md

---

## Dependencies & Execution Order

- Phase 1 must complete before all other phases.
- Phase 2 depends on Phase 1.
- Phase 3 depends on Phase 2.
- Phase 4 depends on Phases 2 and 3.
- Phase 5 depends on Phases 1-4.

### Parallel Execution Guidance

- T014, T015, T016, T017, T018, and T019 can run in parallel after Phase 3.
- T020 and T021 can run in parallel once behavior is stable.

## Implementation Strategy

1. Build the smallest complete runtime foundation.
2. Implement deterministic gameplay and controls.
3. Deliver the minimal UI shell and lifecycle behavior.
4. Validate with tests and quality gates.
