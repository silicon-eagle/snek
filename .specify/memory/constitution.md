<!--
Sync Impact Report
Version change: N/A -> 1.0.0
Modified principles:
- Principle slot 1 -> I. Code Quality Is Non-Negotiable
- Principle slot 2 -> II. Tests Prove Behavior
- Principle slot 3 -> III. Consistent Player Experience
- Principle slot 4 -> IV. Performance Budgets Are Product Requirements
Added sections:
- Technical Standards
- Delivery Workflow & Quality Gates
Removed sections:
- Principle slot 5 (consolidated into standards and governance)
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/commands/*.md (no files present; no action required)
Follow-up TODOs:
- None
-->

# snek Constitution

## Core Principles

### I. Code Quality Is Non-Negotiable
All production code MUST keep strict TypeScript semantics and a clean lint state.
Feature work MUST preserve modular boundaries between core game logic, rendering,
input/control handling, and autoplay/solver logic so each area remains independently
testable and embeddable. Public interfaces for game state and solver decisions MUST
be deterministic and documented with precise types.

Rationale: The project is intended for reuse inside a larger website, so maintainable
and modular code is required for reliable integration.

### II. Tests Prove Behavior
All new behavior and bug fixes MUST include automated tests. At minimum, changes
MUST add or update unit tests for game and solver logic, integration tests for
control handoff (player takeover vs. autoplay), and regression tests for resolved
defects. No change may be considered complete while required tests are failing.

Rationale: Deterministic confidence is necessary for gameplay correctness and to
prevent regressions when evolving both manual and autonomous play modes.

### III. Consistent Player Experience
Input behavior, UI labeling, and feedback states MUST remain consistent across
keyboard controls and on-screen controls. Visual and interaction changes MUST
maintain coherent pixel-art direction, readable HUD information, and predictable
state transitions on desktop and mobile layouts. Embedding behavior MUST be explicit
so host websites can integrate the game without UX drift.

Rationale: A goofy style only works when interaction rules remain intuitive and
consistent regardless of control mode or host environment.

### IV. Performance Budgets Are Product Requirements
Runtime performance is a release gate, not a best-effort target. The game loop MUST
maintain smooth play at a target of 60 FPS on supported browsers during typical
sessions. Algorithm and update paths MUST avoid unbounded per-frame work; hotspots
MUST be profiled when behavior changes. Regressions greater than 10% in frame time,
input latency, or sustained memory growth over a 5-minute run MUST be treated as
blocking until mitigated or explicitly accepted with documented rationale.

Rationale: Playability depends on responsiveness, and the solver must not degrade
interactive performance as the project scales.

## Technical Standards

- The implementation stack MUST remain TypeScript + React + Vite with HTML Canvas
	for runtime rendering unless a formal amendment updates this constitution.
- Core loop, collision, growth, and pathing logic MUST stay framework-independent
	where practical, with React used as orchestration and UI composition.
- New dependencies MUST include a brief justification in the change description and
	MUST not duplicate existing capabilities already present in the codebase.

## Delivery Workflow & Quality Gates

- Specifications MUST define measurable acceptance criteria for gameplay behavior,
	UX consistency, and performance outcomes.
- Plans MUST include a Constitution Check proving how quality, testing, UX, and
	performance obligations are validated before implementation begins.
- Task breakdowns MUST include explicit test tasks and verification work for UX and
	performance constraints.
- Pull requests MUST include evidence for: passing test runs, UX validation notes,
	and performance impact assessment for gameplay-critical paths.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

- This constitution takes precedence over informal conventions in this repository.
- Amendments MUST be proposed in a pull request that includes rationale, impacted
	templates/docs, and migration steps for any in-flight work.
- Versioning policy follows semantic versioning for governance updates:
	- MAJOR for incompatible principle removals or redefinitions.
	- MINOR for new principles/sections or materially expanded obligations.
	- PATCH for clarifications, wording improvements, and non-semantic edits.
- Compliance review is mandatory at specification, planning, and pull-request
	review time. Reviews MUST explicitly confirm adherence or record approved
	exceptions with owner and expiry.

**Version**: 1.0.0 | **Ratified**: 2026-05-28 | **Last Amended**: 2026-05-28
