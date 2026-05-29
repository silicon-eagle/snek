# Tasks: Snake Wraparound Recovery

**Input**: Design documents from /specs/002-snake-autostart-wrap-restart/

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by this feature scope (constitution + plan + quickstart); each user story includes unit/integration coverage.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared constants and test harness support used by all stories.

- [X] T001 Create shared recovery constants in src/core/session/sessionConstants.ts
- [X] T002 [P] Extend canvas/test environment mocks for palette assertions in tests/setup.ts
- [X] T003 [P] Create controller lifecycle test scaffold in tests/unit/core/gameSessionController.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish cross-story plumbing for lifecycle timing and status-driven rendering.

**⚠️ CRITICAL**: No user story work begins until these are complete.

- [X] T004 Add shared lifecycle metadata types for loss recovery in src/core/types/gameTypes.ts
- [X] T005 Implement cancellable timeout lifecycle helpers in src/core/session/gameSession.ts
- [X] T006 Add status-aware render branch scaffolding in src/rendering/canvas/canvasRenderer.ts
- [X] T007 Expose status-driven styling hooks in src/app/GameShell.tsx and src/app/gameShell.css

**Checkpoint**: Foundation ready; user stories can proceed.

---

## Phase 3: User Story 1 - Wrap Through Borders (Priority: P1) 🎯 MVP

**Goal**: Snake movement wraps across all board edges while preserving deterministic collision behavior.

**Independent Test**: Move through each boundary and verify opposite-side continuation without unintended session termination.

### Tests for User Story 1

- [X] T008 [P] [US1] Add wrap-direction rule coverage in tests/unit/rules/snakeRules.test.ts
- [X] T009 [P] [US1] Add reducer wrap and post-wrap collision cases in tests/unit/core/sessionReducer.test.ts
- [X] T010 [US1] Add boundary traversal integration scenario in tests/integration/session-lifecycle/manualKeyboardFlow.test.ts

### Implementation for User Story 1

- [X] T011 [US1] Implement wrapped-coordinate resolver logic in src/core/rules/snakeRules.ts
- [X] T012 [US1] Apply wrapped-head movement pipeline in src/core/state/sessionReducer.ts
- [X] T013 [US1] Update boundary terminal helpers for wrap-aware behavior in src/core/rules/terminalConditions.ts
- [X] T014 [US1] Align border-wrap behavior notes in specs/002-snake-autostart-wrap-restart/contracts/session-lifecycle-contract.md

**Checkpoint**: US1 is independently playable and verifiable.

---

## Phase 4: User Story 2 - Start Automatically (Priority: P2)

**Goal**: Game starts automatically on app load and auto-starts again after post-loss delay.

**Independent Test**: Load app and confirm running state immediately, then lose once and verify automatic restart starts a new running session after delay.

### Tests for User Story 2

- [X] T015 [P] [US2] Add delayed restart scheduling and cancellation tests in tests/unit/core/gameSessionController.test.ts
- [X] T016 [P] [US2] Add auto-start and auto-restart timing integration test in tests/integration/session-lifecycle/resetFlow.test.ts

### Implementation for User Story 2

- [X] T017 [US2] Implement post-loss delayed auto-restart scheduling in src/core/session/gameSession.ts
- [X] T018 [US2] Cancel pending auto-restart on manual reset in src/core/session/gameSession.ts
- [X] T019 [US2] Apply shared recovery delay constants in src/core/session/sessionConstants.ts and src/core/session/gameSession.ts
- [X] T020 [US2] Update lifecycle validation steps in specs/002-snake-autostart-wrap-restart/quickstart.md

**Checkpoint**: US2 auto-start lifecycle works independently.

---

## Phase 5: User Story 3 - Red Loss State With Timed Restart (Priority: P3)

**Goal**: Entire gameplay surface turns red on loss, remains frozen during delay, then returns to normal after restart.

**Independent Test**: Trigger loss, confirm full red visuals and input freeze, then confirm automatic restart restores normal running state.

### Tests for User Story 3

- [X] T021 [P] [US3] Add loss-freeze input integration coverage in tests/integration/session-lifecycle/resetFlow.test.ts
- [X] T022 [P] [US3] Add renderer palette-mode unit tests in tests/unit/rendering/canvasRenderer.test.ts

### Implementation for User Story 3

- [X] T023 [US3] Implement loss-red palette rendering for background/grid/snake/food in src/rendering/canvas/canvasRenderer.ts
- [X] T024 [US3] Apply loss-red frame/canvas/button styling in src/app/gameShell.css
- [X] T025 [US3] Wire status-derived visual hooks for shell and canvas in src/app/GameShell.tsx
- [X] T026 [US3] Sync loss-red contract details in specs/002-snake-autostart-wrap-restart/contracts/visual-loss-state-contract.md

**Checkpoint**: US3 loss feedback and timed recovery are independently verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, regression hardening, and documentation closure.

- [X] T027 [P] Add duplicate-restart regression checks in tests/unit/core/gameSessionController.test.ts and tests/integration/session-lifecycle/resetFlow.test.ts
- [X] T028 [P] Update feature behavior summary in README.md and specs/002-snake-autostart-wrap-restart/quickstart.md
- [X] T029 Run quality gates and record outcomes in specs/002-snake-autostart-wrap-restart/checklists/quickstart-validation.md
- [X] T030 Record performance budget spot-check evidence in specs/002-snake-autostart-wrap-restart/checklists/quickstart-validation.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2.
- **Phase 5 (US3)**: Depends on Phase 2 and on US2 lifecycle timing behavior (T017-T019).
- **Phase 6 (Polish)**: Depends on completion of selected user stories.

### User Story Dependency Graph

- **US1 (P1)**: Independent after Foundational; recommended first for MVP.
- **US2 (P2)**: Independent after Foundational.
- **US3 (P3)**: Requires US2 delayed-restart lifecycle behavior.

Recommended completion order: **US1 → US2 → US3**.

### Within Each User Story

- Write and run test tasks first; confirm failures before implementation.
- Implement core logic next.
- Complete docs/contract sync last within that story.

---

## Parallel Execution Opportunities

- **Setup**: T002 and T003 can run in parallel.
- **US1**: T008 and T009 can run in parallel.
- **US2**: T015 and T016 can run in parallel.
- **US3**: T021 and T022 can run in parallel.
- **Polish**: T027 and T028 can run in parallel.

### Parallel Example: User Story 1

```bash
# Run tests in parallel for US1
Task: T008 tests/unit/rules/snakeRules.test.ts
Task: T009 tests/unit/core/sessionReducer.test.ts
```

### Parallel Example: User Story 2

```bash
# Run lifecycle verification tasks in parallel for US2
Task: T015 tests/unit/core/gameSessionController.test.ts
Task: T016 tests/integration/session-lifecycle/resetFlow.test.ts
```

### Parallel Example: User Story 3

```bash
# Run visual/lifecycle checks in parallel for US3
Task: T021 tests/integration/session-lifecycle/resetFlow.test.ts
Task: T022 tests/unit/rendering/canvasRenderer.test.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently.
4. Demo/deploy MVP.

### Incremental Delivery

1. Deliver US1 (core wrap gameplay value).
2. Deliver US2 (auto-restart loop continuity).
3. Deliver US3 (loss-red clarity and polish).
4. Finish cross-cutting polish and performance evidence.

### Parallel Team Strategy

1. Complete Phase 1 and Phase 2 jointly.
2. Split story tracks:
   - Engineer A: US1
   - Engineer B: US2
   - Engineer C: US3 once US2 timing primitives are merged
3. Rejoin for Phase 6 polish.

---

## Notes

- [P] tasks indicate no direct file-level conflicts and no dependency on incomplete prior tasks.
- [US#] labels maintain traceability from spec stories to implementation work.
- Every task includes an explicit file path so execution is immediate.
