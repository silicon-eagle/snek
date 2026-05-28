# Research: Snake Game Application

## Decision 1: React Orchestration + Canvas Rendering
Decision: Use React for application lifecycle and HUD composition, while isolating all per-tick drawing to an HTML Canvas rendering module.
Rationale: This preserves the architecture called out in README (TypeScript, React, Vite, Canvas) and avoids unnecessary React reconciliation during high-frequency game updates.
Alternatives considered:
- DOM element rendering for snake cells: easier to inspect but degrades rendering performance at higher speeds.
- WebGL renderer: better headroom but unnecessary complexity for pixel-art scope.

## Decision 2: Deterministic Tick-Based Core Engine
Decision: Implement game progression as deterministic fixed-step updates over a strongly typed game state snapshot.
Rationale: Determinism simplifies debugging, regression testing, and parity between manual and autoplay modes.
Alternatives considered:
- Variable delta-time movement: can feel smooth but increases edge-case complexity for grid logic.
- Event-only state mutation: easier to wire initially but harder to reason about temporal ordering.

## Decision 3: Hamiltonian-Cycle Autoplay Strategy
Decision: Use a precomputed Hamiltonian-cycle index over the grid as the default autoplay strategy for completion-focused play.
Rationale: A valid cycle guarantees eventual full-board coverage under standard snake constraints, matching project goals in README.
Alternatives considered:
- Shortest-path-to-food heuristics only: can trap the snake late game.
- Randomized search strategies: unpredictable and unsuitable for always-win expectations.

## Decision 4: Control Ownership Arbitration
Decision: Introduce an explicit control ownership model with two modes: manual and autoplay, with mode change applied at a deterministic tick boundary.
Rationale: Prevents conflicting input sources and ensures clean handoff without state desynchronization.
Alternatives considered:
- Last-input-wins every frame: simple but causes race conditions and inconsistent behavior.
- Separate game loops per mode: high complexity and unnecessary duplication.

## Decision 5: Testing Stack for Required Coverage
Decision: Use Vitest for unit tests, React Testing Library for UI behavior, and Playwright for browser integration and regression flows.
Rationale: This combination covers deterministic logic, interaction behavior, and real browser timing/performance constraints.
Alternatives considered:
- Unit tests only: insufficient for control-handoff and embed lifecycle validation.
- End-to-end tests only: too slow and coarse for core logic regressions.

## Decision 6: Performance Measurement Approach
Decision: Validate performance using frame-timing instrumentation (requestAnimationFrame metrics), browser performance profiling, and scripted 5-minute sessions.
Rationale: Matches constitution performance gates and provides repeatable thresholds for FPS, latency, and memory growth.
Alternatives considered:
- Manual visual checks only: not measurable or repeatable.
- Synthetic microbenchmarks only: may miss real runtime bottlenecks.

## Decision 7: Embedding Contract for Host Websites
Decision: Expose a small host integration surface (initialize, start/pause/restart, mode switch, destroy, state callbacks) documented in a module contract.
Rationale: README states modular integration into a larger website; explicit contracts reduce integration ambiguity.
Alternatives considered:
- Tight coupling to a specific host page framework: faster short term, poor reuse.
- No explicit lifecycle contract: higher risk of leaks and inconsistent host behavior.

## Decision 8: Audio as Optional Capability
Decision: Keep soundtrack playback optional and non-blocking, with graceful fallback when playback is unavailable.
Rationale: Audio should enhance experience without impacting game progression or compliance with browser autoplay policies.
Alternatives considered:
- Mandatory audio initialization: fragile across browsers and accessibility preferences.
- No audio support: misses stated product tone from README.
