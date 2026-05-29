# Implementation Plan: Hamiltonian Autoplay With Random Food

**Branch**: `[003-hamiltonian-autoplay-random-food]` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from /specs/003-hamiltonian-autoplay-random-food/spec.md

## Summary

Add autonomous Hamiltonian-cycle gameplay as the default control mode, support random food placement on free cells, and allow immediate keyboard interception takeover while preserving wrap-through borders, loss-red feedback, and delayed restarts.

Technical approach:

- introduce explicit control-mode state (autonomous vs manual) in session state
- compute and follow a deterministic Hamiltonian cycle for supported board sizes
- use random food placement from the current free-cell pool with testable randomness
- keep restart behavior unchanged except that every new round starts in autonomous mode

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: React 18, React DOM 18, Vite 5, HTML Canvas API

**Storage**: N/A (in-memory runtime state)

**Testing**: Vitest 2, Testing Library, jsdom-based integration tests

**Target Platform**: Modern desktop and mobile-class browsers supported by Vite output

**Project Type**: Single-project frontend web application

**Performance Goals**:

- median frame rate at or above 55 FPS during autonomous and manual runs
- random food placement completes within one movement tick in at least 95% of events
- valid takeover switches to manual mode by the next movement tick in at least 95% of attempts
- post-loss restart begins between 2.5 and 3.5 seconds in at least 95% of losses

**Constraints**:

- deterministic core rules and predictable control handoff
- Hamiltonian autoplay must use a full-cycle route for supported board sizes
- restart scheduling remains single-shot per loss event
- existing wrap-through borders and loss-red visual semantics stay intact

**Scale/Scope**:

- single local session at a time
- default board remains 20x20 (supported for full Hamiltonian cycle)
- autonomous mode is default at startup and after every restart

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Gate Evaluation

- **Code Quality Gate**: PASS - plan separates solver/autoplay logic into dedicated strategy modules while preserving existing boundaries across rules, session orchestration, rendering, and controls.
- **Testing Gate**: PASS - plan includes unit, integration, and regression coverage for cycle generation, random food, takeover transitions, and restart defaults.
- **UX Consistency Gate**: PASS - handoff, restart, and loss-state behavior remain status-driven and consistent across viewport classes.
- **Performance Gate**: PASS - measurable budgets and validation methods are defined for tick-level responsiveness and sustained autoplay behavior.

No gate failures identified; Phase 0 research can proceed.

## Project Structure

### Documentation (this feature)

```text
specs/003-hamiltonian-autoplay-random-food/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── control-handoff-contract.md
│   ├── food-spawn-contract.md
│   └── hamiltonian-route-contract.md
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
│   │   ├── sessionConstants.ts
│   │   └── tickScheduler.ts
│   ├── state/
│   │   ├── foodSpawner.ts
│   │   └── sessionReducer.ts
│   ├── strategy/
│   │   ├── hamiltonianCycle.ts
│   │   └── autoplayController.ts
│   └── types/
│       └── gameTypes.ts
└── rendering/
    └── canvas/
        └── canvasRenderer.ts

tests/
├── integration/
│   └── session-lifecycle/
│       ├── autoplayTakeoverFlow.test.ts
│       ├── manualKeyboardFlow.test.ts
│       ├── minimalUiSurface.test.ts
│       └── resetFlow.test.ts
└── unit/
    ├── core/
    │   ├── gameSessionController.test.ts
    │   └── sessionReducer.test.ts
    ├── rendering/
    │   └── canvasRenderer.test.ts
    ├── rules/
    │   └── snakeRules.test.ts
    └── strategy/
        ├── autoplayController.test.ts
        └── hamiltonianCycle.test.ts
```

**Structure Decision**: Keep the existing single-project architecture and add a dedicated strategy layer for Hamiltonian routing/autoplay decisions to preserve modularity and testability.

## Post-Design Constitution Re-Check

- **Code Quality Gate**: PASS - data model and contracts isolate solver responsibilities and maintain deterministic interfaces.
- **Testing Gate**: PASS - design artifacts map directly to required unit/integration/regression scenarios.
- **UX Consistency Gate**: PASS - contracts enforce predictable control handoff and status-driven visuals.
- **Performance Gate**: PASS - route traversal, spawn selection, and takeover timing validation are explicitly budgeted.

## Complexity Tracking

No constitution exceptions required.
