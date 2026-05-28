# Contract: Autoplay Strategy Interface

## Purpose
Define how the game engine consumes autoplay strategies, with the Hamiltonian-cycle strategy as the default implementation.

## Strategy Input Contract
Each strategy evaluation receives:
- immutable game snapshot for current tick
- grid dimensions
- snake coordinates and heading
- food coordinate
- previous strategy state (if any)

## Strategy Output Contract
Each evaluation returns:
- next direction (up/down/left/right)
- updated strategy state
- optional diagnostics metadata for debugging/performance traces

## Validity Rules
- Returned direction must represent a legal single-tile move.
- Returned direction must not reverse directly into the snake body.
- Strategy must produce deterministic output for identical input snapshot/state.

## Hamiltonian Strategy Guarantees
- cycle covers all grid coordinates exactly once.
- traversal index advances deterministically per tick.
- strategy remains completion-oriented and avoids self-collision under valid board assumptions.

## Failure Handling
- If strategy output is invalid, engine must reject the move and emit deterministic diagnostic output.
- Invalid strategy output must not corrupt core game state.
- Host-visible game mode indicator must remain accurate when strategy fallback occurs.
