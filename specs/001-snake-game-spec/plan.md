# Implementation Plan: Snake Game Application

**Branch**: `[001-run-pre-spec-hook]` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-snake-game-spec/spec.md`

## Summary

Build an embeddable pixel-art snake application using the architecture stated in
README: TypeScript + React + Vite + HTML Canvas. The feature delivers manual
play, deterministic Hamiltonian-cycle autoplay, explicit win/lose outcomes,
mid-session control handoff, and host-site integration behavior while enforcing
quality, UX consistency, and performance budgets from the constitution.
Tooling is standardized to pnpm, tsc, tsx, eslint, prettier, vitest, and vite.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode, validated by tsc), Node.js 20.x toolchain

**Package Manager**: pnpm

**Primary Dependencies**: React 18, Vite 5, HTML Canvas API, Web Audio/HTMLAudio APIs

**Type Checking**: tsc (via `pnpm typecheck`)

**TypeScript Runtime**: tsx (for direct TypeScript script execution)

**Linting/Formatting**: eslint + prettier

**Storage**: N/A (in-memory session state for v1)

**Testing**: vitest, React Testing Library, Playwright

**Build/Dev Server**: vite (via `pnpm dev`, `pnpm build`, `pnpm preview`)

**Target Platform**: Modern desktop and mobile browsers (Chromium, Firefox, Safari)

**Project Type**: Frontend web application module (embeddable game widget)

**Performance Goals**: Median >= 55 FPS; p95 input latency <= 100 ms; autoplay
step decision/update completes within one visual tick for >=95% of moves

**Constraints**: Deterministic Hamiltonian-cycle autoplay, consistent rules
across keyboard and on-screen controls, host-site embedding lifecycle, no backend
dependency in this scope, and pnpm/tsc/tsx/eslint/prettier/vitest/vite toolchain
consistency across local and CI workflows

**Scale/Scope**: Single-player local sessions, one active session per mounted
instance, default grid/tick configuration for v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Assessment

- **Code Quality Gate**: PASS - Planned modular separation across `core`,
  `rendering`, `controls`, `autoplay`, and `integration` with typed boundaries.
- **Testing Gate**: PASS - Required unit, integration, and regression suites are
  explicitly planned for gameplay, control handoff, and terminal outcomes.
- **UX Consistency Gate**: PASS - Validation covers keyboard/on-screen parity,
  HUD readability, and desktop/mobile behavior in embedded contexts.
- **Performance Gate**: PASS - Measurable FPS, latency, and memory budgets are
  defined with repeatable verification approach.

### Post-Phase 1 Design Re-Check

- **Code Quality Gate**: PASS - [data-model.md](./data-model.md) defines
  deterministic state contracts and clear domain boundaries.
- **Testing Gate**: PASS - [quickstart.md](./quickstart.md) includes required
  verification workflow for unit/integration/contract/regression checks.
- **UX Consistency Gate**: PASS - [contracts/embed-contract.md](./contracts/embed-contract.md)
  and [contracts/strategy-contract.md](./contracts/strategy-contract.md) formalize
  ownership transitions and user-visible state signaling.
- **Performance Gate**: PASS - [research.md](./research.md) and
  [quickstart.md](./quickstart.md) define instrumentation and pass/fail thresholds.

## Project Structure

### Documentation (this feature)

```text
specs/001-snake-game-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── embed-contract.md
│   └── strategy-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json
pnpm-lock.yaml
tsconfig.json
vite.config.ts
eslint.config.js
.prettierrc

src/
├── app/
│   ├── GameShell.tsx
│   └── bootstrap.tsx
├── core/
│   ├── session/
│   ├── rules/
│   ├── state/
│   └── types/
├── autoplay/
│   ├── hamiltonian/
│   └── strategy/
├── rendering/
│   └── canvas/
├── controls/
│   ├── keyboard/
│   ├── touch/
│   └── mode-switch/
├── integration/
│   ├── embed/
│   └── lifecycle/
├── audio/
└── ui/
    ├── hud/
    └── controls/

tests/
├── unit/
│   ├── core/
│   ├── autoplay/
│   └── rules/
├── integration/
│   ├── control-handoff/
│   └── session-lifecycle/
└── contract/
    └── embed/
```

**Structure Decision**: Single frontend project. This preserves the README
architecture (React + Vite + Canvas) while keeping gameplay, rendering,
autoplay, and integration concerns independently testable and reusable.

## Complexity Tracking

No constitution violations require exception tracking for this plan.
