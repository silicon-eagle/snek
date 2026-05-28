# Tasks: Snake Game Application

**Input**: Design documents from `/specs/001-snake-game-spec/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are REQUIRED. Every user story includes unit, integration, and regression or contract coverage for changed behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

**Detail Level**: Each task includes concrete deliverables and verification expectations so implementation can proceed without additional decomposition.

**Toolchain Standard**: pnpm (package manager), tsc (type checks), tsx (run TypeScript scripts), eslint (lint), prettier (format), vitest (tests), vite (dev/build).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project tooling and base application entry points.

- [ ] T001 Initialize project scripts and dependency manifest in package.json (use pnpm scripts: dev/build/preview/typecheck/lint/format/format:check/test/test:integration/test:contract, pin core dependencies, and set Node engine constraints)
- [ ] T002 Configure strict TypeScript compiler settings in tsconfig.json (enable strict mode, noImplicitAny, noUncheckedIndexedAccess, path aliases, and noEmit typecheck flow via tsc)
- [ ] T003 [P] Configure Vite + React build setup in vite.config.ts and index.html (wire React plugin, source aliasing, and vite dev server defaults for local gameplay testing)
- [ ] T004 [P] Configure linting and formatting rules in eslint.config.js and .prettierrc (enforce eslint and prettier consistency, React/TypeScript best practices, and fail-on-error lint behavior)
- [ ] T005 Create React bootstrap and shell entry points in src/app/bootstrap.tsx and src/app/GameShell.tsx (render root app shell, attach canvas host container, and expose app-level providers)
- [ ] T006 [P] Configure vitest and Playwright runners in vitest.config.ts and playwright.config.ts (set test projects, browser targets, reporter output, and coverage collection defaults)
- [ ] T007 [P] Create shared test setup utilities in tests/setup/vitest.setup.ts and tests/setup/playwright.setup.ts (add fake timer helpers, canvas mocks, reusable deterministic fixture bootstrapping, and tsx-ready script helpers)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core architecture that blocks all user stories until complete.

**Critical**: No user story work starts until this phase is complete.

- [ ] T008 Define core domain types and enums in src/core/types/gameTypes.ts (cover GameSession, GridCoordinate, SnakeState, FoodState, ControlState, AutoplayState, and terminal reason enums)
- [ ] T009 [P] Implement fixed tick scheduler in src/core/session/tickScheduler.ts (support start/pause/resume/stop controls, fixed-step updates, and bounded catch-up behavior)
- [ ] T010 [P] Implement immutable session reducer in src/core/state/sessionReducer.ts (handle lifecycle actions, movement ticks, mode changes, score updates, and deterministic state transitions)
- [ ] T011 [P] Implement snake movement and collision rules in src/core/rules/snakeRules.ts (advance head/tail, reject invalid reversals, and detect self-collision/boundary exits)
- [ ] T012 [P] Implement grid coordinate and occupancy helpers in src/core/rules/gridUtils.ts (compute legal neighbors, occupancy maps, and free-cell queries for spawning)
- [ ] T013 Implement session orchestrator composition in src/core/session/gameSession.ts (compose scheduler, reducer, rules, and side-effect hooks into a single tick-driven session engine)
- [ ] T014 [P] Implement canvas renderer primitives in src/rendering/canvas/canvasRenderer.ts (draw board, snake, food, overlays, and support device pixel ratio scaling)
- [ ] T015 [P] Implement HUD view-model mapping in src/ui/hud/hudViewModel.ts (map engine state to display-friendly values for status, score, mode, and terminal messages)
- [ ] T016 Implement keyboard and touch input adapters in src/controls/keyboard/keyboardController.ts and src/controls/touch/touchController.ts (normalize inputs into one command queue with shared validation)
- [ ] T017 Implement optional soundtrack service with fallback handling in src/audio/soundtrackService.ts (support play/pause/mute, browser autoplay restrictions, and no-audio fallback path)
- [ ] T018 [P] Create deterministic state fixtures for tests in tests/unit/core/gameSessionFixtures.ts (provide reusable seeded states for idle/running/won/lost and mode-switch boundaries)
- [ ] T019 Add foundational unit tests for reducer and rule invariants in tests/unit/core/sessionReducer.test.ts and tests/unit/rules/snakeRules.test.ts (verify deterministic updates and action sequencing under vitest)

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Play Classic Snake Manually (Priority: P1)

**Goal**: Deliver complete manual gameplay with explicit win/lose outcomes and score progression.

**Independent Test**: Start a session, play via keyboard and on-screen controls, verify growth/score updates, verify lose on self-collision or boundary exit, and verify win on full-board occupancy.

### Tests for User Story 1 (REQUIRED)

- [ ] T020 [P] [US1] Add unit tests for win and lose terminal conditions in tests/unit/core/terminalConditions.test.ts (cover full-grid win, self-bite lose, and boundary-exit lose)
- [ ] T021 [P] [US1] Add unit tests for food spawn and growth behavior in tests/unit/rules/foodAndGrowth.test.ts (verify spawn on unoccupied cells only and growth/score consistency)
- [ ] T022 [P] [US1] Add integration test for manual keyboard gameplay flow in tests/integration/session-lifecycle/manualKeyboardFlow.test.ts (run complete session with start/pause/resume/restart transitions)
- [ ] T023 [P] [US1] Add integration test for on-screen control gameplay flow in tests/integration/session-lifecycle/manualTouchFlow.test.ts (validate touch controls, no reverse-direction edge cases, and terminal outcomes)

### Implementation for User Story 1

- [ ] T024 [P] [US1] Implement terminal outcome evaluator in src/core/rules/terminalConditions.ts (return status plus reason code and stop conditions for won/lost states)
- [ ] T025 [P] [US1] Implement food placement service in src/core/state/foodSpawner.ts (select free cell deterministically and emit win-ready signal when grid is fully occupied)
- [ ] T026 [US1] Integrate manual input queue into tick updates in src/core/session/gameSession.ts (apply one validated direction per tick and preserve deterministic order)
- [ ] T027 [US1] Implement manual play HUD component in src/ui/hud/GameHud.tsx (display score, mode, status, and terminal reason text)
- [ ] T028 [US1] Implement on-screen manual controls UI in src/ui/controls/ManualControls.tsx (add accessible directional controls with visual active-state feedback)
- [ ] T029 [US1] Wire manual play session lifecycle and restart actions in src/app/GameShell.tsx (implement start/pause/resume/restart/end actions and connect to shell controls)

**Checkpoint**: User Story 1 is independently playable and testable.

---

## Phase 4: User Story 2 - Let the Game Autoplay to Completion (Priority: P2)

**Goal**: Deliver deterministic autoplay using Hamiltonian traversal with full-session completion behavior.

**Independent Test**: Enable autoplay from a new session and verify deterministic, non-colliding progression to win.

### Tests for User Story 2 (REQUIRED)

- [ ] T030 [P] [US2] Add unit tests for Hamiltonian cycle validity in tests/unit/autoplay/hamiltonianCycle.test.ts (ensure cycle covers each cell once and only legal adjacent moves)
- [ ] T031 [P] [US2] Add unit tests for strategy determinism guarantees in tests/unit/autoplay/strategyDeterminism.test.ts (assert identical input snapshot produces identical move output)
- [ ] T032 [P] [US2] Add integration test for autoplay win journey in tests/integration/session-lifecycle/autoplayWinFlow.test.ts (run autoplay from new session to full-grid win)
- [ ] T033 [P] [US2] Add contract test for strategy input/output rules in tests/contract/strategy/strategyContract.test.ts (verify required fields, legal directions, and invalid-output handling)

### Implementation for User Story 2

- [ ] T034 [P] [US2] Implement Hamiltonian cycle builder in src/autoplay/hamiltonian/buildCycle.ts (generate traversal order for supported board dimensions and validate cycle integrity)
- [ ] T035 [P] [US2] Implement autoplay strategy adapter in src/autoplay/strategy/hamiltonianStrategy.ts (convert current session snapshot into next deterministic direction)
- [ ] T036 [US2] Integrate autoplay decision pipeline into session orchestrator in src/core/session/gameSession.ts (resolve move source by mode and handle fallback on invalid strategy output)
- [ ] T037 [US2] Implement autoplay mode toggle component in src/ui/controls/AutoplayToggle.tsx (show current mode and prevent invalid toggles during non-running states)
- [ ] T038 [US2] Add strategy diagnostics metadata provider in src/autoplay/strategy/strategyDiagnostics.ts (capture cycle index, decision latency, and fallback reasons)

**Checkpoint**: User Story 2 autoplay is independently functional and testable.

---

## Phase 5: User Story 3 - Switch Between Player Control and Autoplay (Priority: P3)

**Goal**: Deliver deterministic mode handoff between manual and autoplay without resetting game state.

**Independent Test**: Toggle modes repeatedly in one session and verify continuity of board state, score, and control responsiveness.

### Tests for User Story 3 (REQUIRED)

- [ ] T039 [P] [US3] Add integration test for autoplay-to-manual takeover in tests/integration/control-handoff/autoplayToManual.test.ts (verify ownership switches on tick boundary and input immediately becomes effective)
- [ ] T040 [P] [US3] Add integration test for manual-to-autoplay handoff in tests/integration/control-handoff/manualToAutoplay.test.ts (verify queued manual input is safely resolved before autoplay resumes)
- [ ] T041 [P] [US3] Add regression test for no-reset handoff behavior in tests/integration/control-handoff/noResetRegression.test.ts (assert score, snake length, and board state persist across multiple toggles)

### Implementation for User Story 3

- [ ] T042 [P] [US3] Implement control ownership state machine in src/controls/mode-switch/controlOwnership.ts (model requested/current mode and pending transition states)
- [ ] T043 [US3] Enforce tick-boundary mode transitions in src/core/session/gameSession.ts (apply mode changes only after current tick resolution to avoid race conditions)
- [ ] T044 [US3] Implement mode transition status banner in src/ui/hud/ModeStatusBanner.tsx (show clear transition feedback for manual/autoplay ownership changes)
- [ ] T045 [US3] Wire mode switching actions and state in src/app/GameShell.tsx (connect UI actions to ownership state machine and HUD presentation)

**Checkpoint**: User Story 3 handoff is independently functional and testable.

---

## Phase 6: User Story 4 - Embed the Game in a Larger Website (Priority: P4)

**Goal**: Deliver a stable host integration surface for initialization, control, callbacks, and teardown.

**Independent Test**: Mount game in host container, run lifecycle operations, validate callbacks/snapshots, destroy, and remount cleanly.

### Tests for User Story 4 (REQUIRED)

- [ ] T046 [P] [US4] Add contract tests for embed lifecycle operations in tests/contract/embed/lifecycleContract.test.ts (verify create/start/pause/resume/restart/destroy semantics and idempotence guarantees)
- [ ] T047 [P] [US4] Add contract tests for snapshot and callback payloads in tests/contract/embed/snapshotContract.test.ts (verify required snapshot fields and onStateChange/onModeChange/onWin/onLose/onError behavior)
- [ ] T048 [P] [US4] Add integration test for mount-destroy-remount lifecycle in tests/integration/session-lifecycle/embedLifecycleFlow.test.ts (confirm no listener/timer leaks across repeated mount cycles)

### Implementation for User Story 4

- [ ] T049 [P] [US4] Implement embeddable module factory API in src/integration/embed/createSnakeGame.ts (accept container/config/callbacks and return runtime control methods)
- [ ] T050 [P] [US4] Implement host callback and error dispatcher in src/integration/embed/embedCallbacks.ts (normalize callback payloads and standardize recoverable vs non-recoverable errors)
- [ ] T051 [US4] Implement deterministic teardown cleanup in src/integration/lifecycle/destroySession.ts (release scheduler loops, event listeners, and audio resources)
- [ ] T052 [US4] Export public embed API contract in src/integration/embed/index.ts (export typed surface matching embed-contract expectations)
- [ ] T053 [US4] Document embed API usage and constraints in docs/embed-api.md (include initialization examples, lifecycle flow, and host integration caveats)

**Checkpoint**: User Story 4 embedding is independently functional and testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening tasks across all stories.

- [ ] T054 [P] Update product and usage documentation in README.md and specs/001-snake-game-spec/quickstart.md (document manual play, autoplay, mode handoff, embedding workflow, and standardized pnpm tool commands)
- [ ] T055 Run full lint/typecheck/format remediation in package.json, tsconfig.json, eslint.config.js, and .prettierrc (resolve violations and ensure clean `pnpm typecheck`, `pnpm lint`, and `pnpm format:check` runs)
- [ ] T056 Validate UX consistency checklist outputs in tests/integration/session-lifecycle/uxConsistencyChecklist.md (capture keyboard vs touch behavior and desktop/mobile parity evidence)
- [ ] T057 Optimize frame-timing hotspots in src/rendering/canvas/canvasRenderer.ts and src/core/session/tickScheduler.ts (profile and reduce frame drops under sustained load)
- [ ] T058 [P] Add automated performance budget regression suite in tests/integration/session-lifecycle/performanceBudget.test.ts (measure FPS, input latency, and memory growth against approved thresholds)
- [ ] T059 Execute quickstart validation and record evidence in specs/001-snake-game-spec/checklists/quickstart-validation.md (log pnpm commands run, results, and onboarding-time observations)
- [ ] T060 Harden host-facing input validation paths in src/integration/embed/createSnakeGame.ts and src/integration/embed/embedCallbacks.ts (guard invalid config, callback failures, and lifecycle misuse)

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): No dependencies.
- Phase 2 (Foundational): Depends on Phase 1 and blocks all user stories.
- Phase 3 (US1): Depends on Phase 2.
- Phase 4 (US2): Depends on Phase 2.
- Phase 5 (US3): Depends on Phase 3 and Phase 4.
- Phase 6 (US4): Depends on Phase 3.
- Phase 7 (Polish): Depends on completion of all targeted user stories.

### User Story Dependencies

- US1 (P1): Starts after foundational completion and provides MVP value.
- US2 (P2): Starts after foundational completion and is independently testable.
- US3 (P3): Requires US1 and US2 control paths to exist for handoff validation.
- US4 (P4): Requires US1 baseline gameplay and then validates host embedding contract.

### Within Each User Story

- Write tests first and verify they fail before implementing behavior.
- Implement domain logic before UI wiring.
- Complete integration and regression checks before closing the story.

---

## Parallel Execution Examples

### User Story 1

```bash
# Run in parallel:
Task T020 in tests/unit/core/terminalConditions.test.ts
Task T021 in tests/unit/rules/foodAndGrowth.test.ts
Task T022 in tests/integration/session-lifecycle/manualKeyboardFlow.test.ts
Task T023 in tests/integration/session-lifecycle/manualTouchFlow.test.ts
```

### User Story 2

```bash
# Run in parallel:
Task T030 in tests/unit/autoplay/hamiltonianCycle.test.ts
Task T031 in tests/unit/autoplay/strategyDeterminism.test.ts
Task T034 in src/autoplay/hamiltonian/buildCycle.ts
Task T035 in src/autoplay/strategy/hamiltonianStrategy.ts
```

### User Story 3

```bash
# Run in parallel:
Task T039 in tests/integration/control-handoff/autoplayToManual.test.ts
Task T040 in tests/integration/control-handoff/manualToAutoplay.test.ts
Task T042 in src/controls/mode-switch/controlOwnership.ts
```

### User Story 4

```bash
# Run in parallel:
Task T046 in tests/contract/embed/lifecycleContract.test.ts
Task T047 in tests/contract/embed/snapshotContract.test.ts
Task T049 in src/integration/embed/createSnakeGame.ts
Task T050 in src/integration/embed/embedCallbacks.ts
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tests and implementation in Phase 3.
3. Validate manual play win/lose behavior end-to-end.
4. Demo or ship MVP.

### Incremental Delivery

1. Deliver US1 for playable baseline.
2. Deliver US2 for deterministic autoplay.
3. Deliver US3 for control handoff.
4. Deliver US4 for host embedding.
5. Run Phase 7 polish before final release.

### Parallel Team Strategy

1. Team completes setup and foundational phases together.
2. After Phase 2:
   - Engineer A: US1 manual gameplay.
   - Engineer B: US2 autoplay strategy.
3. After US1 and US2:
   - Engineer C: US3 control handoff.
   - Engineer D: US4 embedding contract.
4. Team converges on Phase 7 hardening.
