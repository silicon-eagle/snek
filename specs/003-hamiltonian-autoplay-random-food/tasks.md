# Tasks: Hamiltonian Autoplay With Random Food

**Input**: Design documents from /specs/003-hamiltonian-autoplay-random-food/

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required for this feature by constitution and plan gates. Every story includes unit, integration, and regression coverage for changed behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: [ID] [P?] [Story] Description

- [P]: Can run in parallel (different files, no dependencies)
- [Story]: Story label for story-phase tasks only (US1, US2, US3)
- Every task includes explicit file path(s)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared scaffolding for strategy modules and deterministic test support.

- [X] T001 Create autoplay strategy module scaffolding in src/core/strategy/hamiltonianCycle.ts and src/core/strategy/autoplayController.ts
- [X] T002 [P] Add autoplay/random-spawn shared constants in src/core/session/sessionConstants.ts
- [X] T003 [P] Extend deterministic test fixture helpers for seeded random behavior in tests/unit/core/gameSessionFixtures.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core control-mode and route plumbing required by all user stories.

**⚠️ CRITICAL**: No user story implementation begins until this phase is complete.

- [X] T004 Add control mode and Hamiltonian route state types in src/core/types/gameTypes.ts
- [X] T005 [P] Add coordinate-index utilities and route key helpers in src/core/strategy/hamiltonianCycle.ts
- [X] T006 [P] Refactor food spawn API for injectable RNG and free-cell selection in src/core/state/foodSpawner.ts
- [X] T007 Add session reducer control-owner/action scaffolding in src/core/state/sessionReducer.ts
- [X] T008 Add controller lifecycle scaffolding for autonomous default rounds in src/core/session/gameSession.ts
- [X] T009 Expose control/status observability hooks in src/app/GameShell.tsx and src/app/gameShell.css

**Checkpoint**: Foundation complete; story work can proceed.

---

## Phase 3: User Story 1 - Autonomous Hamiltonian Play (Priority: P1) 🎯 MVP

**Goal**: Snake follows Hamiltonian autoplay by default and consumes randomly spawned food safely.

**Independent Test**: Start a fresh session without keyboard input; verify route-following autoplay plus random food spawning on free cells.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T010 [P] [US1] Add Hamiltonian cycle integrity unit tests in tests/unit/strategy/hamiltonianCycle.test.ts
- [X] T011 [P] [US1] Add random food spawn eligibility/distribution unit tests in tests/unit/core/foodSpawnerRandom.test.ts
- [X] T012 [P] [US1] Add unattended autoplay integration scenario in tests/integration/session-lifecycle/autoplayTakeoverFlow.test.ts

### Implementation for User Story 1

- [X] T013 [US1] Implement full-board Hamiltonian cycle generation/validation in src/core/strategy/hamiltonianCycle.ts
- [X] T014 [US1] Implement autoplay next-step direction resolver in src/core/strategy/autoplayController.ts
- [X] T015 [US1] Integrate autonomous step selection into tick resolution in src/core/state/sessionReducer.ts
- [X] T016 [US1] Implement uniform random free-cell food spawning in src/core/state/foodSpawner.ts
- [X] T017 [US1] Wire route initialization and default autonomous mode in src/core/state/sessionReducer.ts and src/core/session/gameSession.ts
- [X] T018 [US1] Align route and spawn contracts in specs/003-hamiltonian-autoplay-random-food/contracts/hamiltonian-route-contract.md and specs/003-hamiltonian-autoplay-random-food/contracts/food-spawn-contract.md

**Checkpoint**: US1 should run autonomously from startup and progress safely with random food.

---

## Phase 4: User Story 2 - Keyboard Interception Takeover (Priority: P2)

**Goal**: Valid arrow input intercepts autonomous mode and hands control to the player predictably.

**Independent Test**: During autoplay, press a valid arrow key and verify manual takeover by the next movement tick while invalid inputs do not switch modes.

### Tests for User Story 2 (REQUIRED) ⚠️

- [X] T019 [P] [US2] Add control handoff unit tests for valid/invalid interception in tests/unit/strategy/autoplayController.test.ts
- [X] T020 [P] [US2] Add reducer takeover transition/regression tests in tests/unit/core/sessionReducer.test.ts
- [X] T021 [US2] Add takeover integration flow tests in tests/integration/session-lifecycle/autoplayTakeoverFlow.test.ts

### Implementation for User Story 2

- [X] T022 [US2] Implement valid interception control-mode transition logic in src/core/state/sessionReducer.ts
- [X] T023 [US2] Preserve autonomous mode for invalid interception inputs in src/controls/keyboard/keyboardController.ts and src/core/state/sessionReducer.ts
- [X] T024 [US2] Keep manual mode active until round end/reset in src/core/state/sessionReducer.ts
- [X] T025 [US2] Expose control owner observability markers for UI/tests in src/app/GameShell.tsx
- [X] T026 [US2] Align handoff and restart-default contract details in specs/003-hamiltonian-autoplay-random-food/contracts/control-handoff-contract.md

**Checkpoint**: US2 takeover behavior should be independently reliable and testable.

---

## Phase 5: User Story 3 - Restart Returns to Autoplay (Priority: P3)

**Goal**: Every startup and post-loss restart returns the game to autonomous Hamiltonian mode.

**Independent Test**: Take manual control, lose, and verify delayed restart returns to autonomous default mode.

### Tests for User Story 3 (REQUIRED) ⚠️

- [X] T027 [P] [US3] Add startup/restart default-autonomous unit tests in tests/unit/core/gameSessionController.test.ts
- [X] T028 [P] [US3] Add loss-delay restart-autonomous integration tests in tests/integration/session-lifecycle/resetFlow.test.ts

### Implementation for User Story 3

- [X] T029 [US3] Ensure round initialization always resets control owner to autonomous in src/core/state/sessionReducer.ts
- [X] T030 [US3] Ensure delayed auto-restart seeds autonomous mode in src/core/session/gameSession.ts
- [X] T031 [US3] Preserve loss-delay input freeze semantics with control modes in src/core/session/gameSession.ts and src/core/state/sessionReducer.ts
- [X] T032 [US3] Update restart-default validation steps in specs/003-hamiltonian-autoplay-random-food/quickstart.md

**Checkpoint**: US3 restart behavior should be independently verifiable for both autonomous and manual-loss paths.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, docs, and performance/validation evidence.

- [X] T033 [P] Add duplicate-restart and stale-control regression coverage in tests/unit/core/gameSessionController.test.ts and tests/integration/session-lifecycle/resetFlow.test.ts
- [X] T034 [P] Update behavior summary docs in README.md and specs/003-hamiltonian-autoplay-random-food/quickstart.md
- [X] T035 Run quality gates and record outcomes in specs/003-hamiltonian-autoplay-random-food/checklists/quickstart-validation.md
- [X] T036 Record autoplay and takeover performance spot-check evidence in specs/003-hamiltonian-autoplay-random-food/checklists/quickstart-validation.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): no dependencies
- Foundational (Phase 2): depends on Phase 1 and blocks all stories
- US1 (Phase 3): depends on Phase 2
- US2 (Phase 4): depends on Phase 2 and US1 autoplay foundation
- US3 (Phase 5): depends on Phase 2 and restart/control behavior from US1-US2
- Polish (Phase 6): depends on completion of selected user stories

### User Story Dependencies

- US1 (P1): first deliverable and MVP core
- US2 (P2): depends on US1 autoplay behavior for interception handoff
- US3 (P3): depends on autonomous defaults and control transitions from US1-US2

Recommended story order: US1 → US2 → US3.

### Within Each Story

- Write tests first and confirm failures.
- Implement core logic after tests.
- Update contracts/docs for the story before checkpoint.

---

## Parallel Opportunities

- Setup: T002 and T003 can run in parallel.
- Foundational: T005 and T006 can run in parallel.
- US1: T010, T011, and T012 can run in parallel.
- US2: T019 and T020 can run in parallel.
- US3: T027 and T028 can run in parallel.
- Polish: T033 and T034 can run in parallel.

### Parallel Example: User Story 1

- Task T010: tests/unit/strategy/hamiltonianCycle.test.ts
- Task T011: tests/unit/core/foodSpawnerRandom.test.ts
- Task T012: tests/integration/session-lifecycle/autoplayTakeoverFlow.test.ts

### Parallel Example: User Story 2

- Task T019: tests/unit/strategy/autoplayController.test.ts
- Task T020: tests/unit/core/sessionReducer.test.ts

### Parallel Example: User Story 3

- Task T027: tests/unit/core/gameSessionController.test.ts
- Task T028: tests/integration/session-lifecycle/resetFlow.test.ts

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently.
4. Demo/deploy MVP with default autonomous gameplay.

### Incremental Delivery

1. Deliver US1 (autoplay + random food).
2. Deliver US2 (manual interception takeover).
3. Deliver US3 (restart default autonomy).
4. Complete polish and performance evidence.

### Parallel Team Strategy

1. Team completes Phase 1-2 together.
2. Then split work:
   - Developer A: US1
   - Developer B: US2
   - Developer C: US3 after US1-US2 baseline merges
3. Rejoin for Phase 6 hardening.

---

## Notes

- [P] tasks denote file-level independence and no blocking dependency on incomplete tasks.
- Story labels maintain direct traceability from spec user stories to implementation work.
- Tasks are intentionally specific so they can be executed directly by an implementation agent.
