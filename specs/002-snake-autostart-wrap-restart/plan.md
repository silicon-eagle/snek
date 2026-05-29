# Implementation Plan: Snake Wraparound Recovery

**Branch**: `[002-snake-autostart-wrap-restart]` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from /specs/002-snake-autostart-wrap-restart/spec.md

## Summary

Implement three gameplay updates while preserving the existing minimal UI surface:

- keep automatic session start on app load and after timed recovery
- replace wall-loss behavior with border wrap-through to the opposite side
- show a full red loss visual mode, then auto-restart after a 3-second delay

Technical approach:

- keep movement and collision outcomes deterministic in reducer/rules logic
- centralize delayed restart scheduling in session orchestration to prevent duplicate restarts
- drive loss visuals from session status so canvas rendering and CSS state remain synchronized

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: React 18, React DOM 18, Vite 5, HTML Canvas API

**Storage**: N/A (in-memory session state only)

**Testing**: Vitest 2, Testing Library (unit and integration)

**Target Platform**: Modern desktop and mobile-class browsers supported by Vite build output

**Project Type**: Single-project frontend web application

**Performance Goals**:

- median frame rate at or above 55 FPS during normal and wrap-heavy movement
- loss-red visual state visible within 100 ms of loss detection in at least 95% of runs
- automatic restart begins within a 2.5 to 3.5 second window in at least 95% of runs

**Constraints**:

- preserve deterministic immutable state transitions
- no duplicate restart timers per loss event
- manual reset must cancel pending auto-restart
- maintain minimal control surface (grid + reset button only)

**Scale/Scope**:

- single-player local session
- one active session at a time
- default 20x20 grid at 120 ms tick cadence

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Gate Evaluation

- **Code Quality Gate**: PASS - Changes stay within existing module boundaries (rules, reducer, session orchestration, rendering, app shell) and keep strict TypeScript/lint expectations.
- **Testing Gate**: PASS - Plan includes unit coverage for wrap and restart rules plus integration coverage for auto-start, red loss state, and delayed restart behavior.
- **UX Consistency Gate**: PASS - Status-driven visual state keeps behavior predictable across viewport sizes and existing input model.
- **Performance Gate**: PASS - Measurable FPS and timing budgets are defined and validation approach is included in quickstart and tests.

No unjustified violations; Phase 0 research can proceed.

## Project Structure

### Documentation (this feature)

```text
specs/002-snake-autostart-wrap-restart/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── session-lifecycle-contract.md
│   └── visual-loss-state-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── GameShell.tsx
│   └── gameShell.css
├── controls/
│   └── keyboard/
│       └── keyboardController.ts
├── core/
│   ├── rules/
│   │   ├── snakeRules.ts
│   │   └── terminalConditions.ts
│   ├── session/
│   │   ├── gameSession.ts
│   │   └── tickScheduler.ts
│   ├── state/
│   │   └── sessionReducer.ts
│   └── types/
│       └── gameTypes.ts
└── rendering/
    └── canvas/
        └── canvasRenderer.ts

tests/
├── integration/
│   └── session-lifecycle/
│       ├── manualKeyboardFlow.test.ts
│       ├── minimalUiSurface.test.ts
│       └── resetFlow.test.ts
└── unit/
    ├── controls/
    │   └── keyboardController.test.ts
    ├── core/
    │   └── sessionReducer.test.ts
    └── rules/
        └── snakeRules.test.ts
```

**Structure Decision**: Reuse the current single-project frontend architecture and apply narrowly scoped updates in existing modules. No new top-level packages or runtime layers are required.

## Post-Design Constitution Re-Check

- **Code Quality Gate**: PASS - Data model and contracts keep ownership clear between reducer, scheduler, renderer, and shell wiring.
- **Testing Gate**: PASS - Contracts and quickstart map directly to verifiable unit and integration assertions.
- **UX Consistency Gate**: PASS - Visual contract enforces full red loss mode and consistent return to running state.
- **Performance Gate**: PASS - Design choices avoid extra per-tick complexity and define objective timing and FPS checks.

## Complexity Tracking

No constitution exceptions required.
