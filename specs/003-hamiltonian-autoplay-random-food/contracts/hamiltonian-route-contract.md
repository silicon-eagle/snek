# Contract: Hamiltonian Route and Autoplay

## Scope

Defines route guarantees and autoplay movement behavior for supported boards.

## Route Contract

1. Route coverage
- A supported board (rows > 1, cols > 1, and at least one even dimension) must expose a Hamiltonian cycle that visits every playable cell exactly once.

2. Route continuity
- Each cycle step must be orthogonally adjacent to the next step under wrap-through border semantics.

3. Route closure
- Final cycle step must connect back to first step, forming a closed loop.

4. Route indexing
- Route state must expose indexByCell and currentRouteStep values so autoplay can resolve the next step in O(1).

## Autoplay Contract

1. Default owner
- At round start, control owner is autonomous.

2. Tick behavior
- While autonomous mode is active, each movement tick follows the next route step derived from currentRouteStep and wraps at the cycle boundary.

3. Safety expectation
- Without manual interception, autoplay must avoid self-collision on supported boards.

## Verification Mapping

- Unit tests validate cycle integrity, coverage, closure, and next-step progression.
- Integration tests validate unattended autoplay progression from startup.
