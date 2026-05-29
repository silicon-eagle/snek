# Research: Snake Wraparound Recovery

## Decision 1: Preserve Existing Auto-Start Entry Point

Decision: Keep session startup on mount through the existing game-session startup path, and preserve automatic startup for all new rounds.

Rationale: The current startup path is already deterministic, test-covered, and aligned with the feature requirement for zero manual start steps.

Alternatives considered:

- Introduce a pre-running idle state and explicit start action: rejected because it violates the requested always-on flow.
- Start from UI component state instead of session orchestration: rejected because it splits lifecycle ownership.

## Decision 2: Apply Border Wrapping Before Terminal Boundary Checks

Decision: Normalize next-head coordinates into board bounds (toroidal wrap) before collision resolution.

Rationale: Wrapping at the rule layer preserves deterministic movement semantics and keeps rendering and state in sync.

Alternatives considered:

- Keep boundary-loss behavior and only animate visual teleport: rejected because logic would still terminate at walls.
- Clamp coordinates at edges: rejected because it changes movement cadence and game feel.

## Decision 3: Evaluate Self-Collision Against Post-Wrap Head Position

Decision: Run self-collision checks against the wrapped head coordinate using existing tail-exclusion logic for non-growth movement.

Rationale: This preserves expected snake behavior and correctly handles the edge case where wrapping lands on an occupied segment.

Alternatives considered:

- Collision check before wrapping: rejected because it incorrectly treats all border crossings as losses.
- Always include tail segment in collision set: rejected because it introduces false-positive losses.

## Decision 4: Manage Delayed Restart in Session Orchestration With Single Timer Ownership

Decision: Implement delayed post-loss restart in session orchestration with at most one pending timeout per loss event.

Rationale: Central timer ownership supports cancellation on manual reset/dispose and avoids duplicate restarts.

Alternatives considered:

- Drive delayed restart from React component effects: rejected because timing behavior becomes view-coupled.
- Encode timeouts in reducer logic: rejected because reducer must remain pure and synchronous.

## Decision 5: Drive Loss-Red Visual Mode From Session Status

Decision: Derive visual palette directly from session status so both canvas rendering and CSS chrome use the same status source.

Rationale: A single source of truth ensures "everything red" behavior is applied consistently and reset reliably.

Alternatives considered:

- Separate local visual state independent from session status: rejected due to drift risk.
- CSS-only tinting without renderer palette changes: rejected because canvas content would remain partially non-red.

## Decision 6: Validate Timing and Lifecycle Through Deterministic Tests

Decision: Use unit and integration tests with fake timers to validate wrap movement, red loss mode timing, auto-restart timing, and reset-cancel behavior.

Rationale: Timed behavior is regression-prone; deterministic tests provide repeatable guarantees and protect the constitution testing gate.

Alternatives considered:

- Manual QA-only timing checks: rejected because outcomes are not repeatable or enforceable in CI.
