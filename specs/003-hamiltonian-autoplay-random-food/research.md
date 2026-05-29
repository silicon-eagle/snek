# Research: Hamiltonian Autoplay With Random Food

## Decision 1: Use a Deterministic Hamiltonian Cycle for Supported Board Sizes

Decision: Build a full-board Hamiltonian cycle representation for supported grid sizes and use it as the canonical autonomous traversal route.

Rationale: A complete cycle guarantees safe progression without self-collision when uninterrupted, which aligns with default autoplay-to-win behavior.

Alternatives considered:

- Greedy shortest-path food chasing: rejected due to dead-end risk as snake length increases.
- Dynamic search each tick (A*/BFS): rejected as unnecessary complexity for guaranteed-win autonomous mode.

## Decision 2: Keep Autonomous vs Manual as Explicit Control Modes

Decision: Represent control ownership with an explicit control-mode state and transition rules rather than inferring from recent keypresses.

Rationale: Explicit mode state produces deterministic handoff behavior, clearer restart defaults, and easier testability.

Alternatives considered:

- Implicit mode from last input source: rejected because transitions become ambiguous and hard to verify.
- Dedicated UI toggle for mode switching: rejected because takeover must remain keyboard-interception driven.

## Decision 3: Trigger Manual Takeover on Valid Arrow Input Only

Decision: During autonomous mode, only valid arrow-key turns trigger manual takeover; invalid keys and disallowed reversals do not switch modes.

Rationale: This keeps control handoff intentional and preserves predictable movement semantics.

Alternatives considered:

- Any key triggers takeover: rejected due to accidental handoffs.
- Delayed takeover requiring multiple inputs: rejected because responsiveness would feel inconsistent.

## Decision 4: Random Food Placement Uses Uniform Selection Across Free Cells

Decision: Spawn food by selecting uniformly from the current set of unoccupied cells.

Rationale: Uniform free-cell sampling satisfies randomness requirements while guaranteeing no overlap with snake segments.

Alternatives considered:

- Deterministic scan-order placement: rejected because feature now requires random placement.
- Retry-random-point-until-free: rejected due to potentially unbounded retries at high occupancy.

## Decision 5: Restart and Startup Always Reinitialize Autonomous Defaults

Decision: Session initialization always starts in autonomous mode, regardless of whether the previous round was autonomous or manually intercepted.

Rationale: This preserves a consistent baseline behavior across startup and post-loss recovery.

Alternatives considered:

- Persist manual mode across rounds: rejected because spec requires autonomous default after startup/restart.
- Remember last control owner per session: rejected due to additional state complexity without user value.

## Decision 6: Validate Behavior With Deterministic Tests and Seedable Randomness

Decision: Use unit tests for cycle/route and spawn constraints, integration tests for takeover and restart flows, and deterministic RNG injection for repeatable assertions.

Rationale: Autonomous logic and random spawning are both regression-sensitive; deterministic tests are required by constitution testing gates.

Alternatives considered:

- Manual-only validation of autoplay and randomness: rejected because coverage would be non-repeatable and insufficient for CI.
- Snapshot-only UI tests: rejected because they do not verify control handoff or route correctness.
