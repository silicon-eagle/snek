# Contract: Random Food Spawning

## Scope

Defines required behavior for random food placement across rounds.

## Spawn Contract

1. Eligibility
- Food may only spawn on cells not occupied by snake segments.

2. Selection method
- Spawn uses random selection from the full set of eligible free cells.

2a. Spawn metadata
- Spawn state source is marked as randomFree and freeCellCount reflects the eligible pool size.

3. Trigger points
- Food spawns at round initialization and immediately after food consumption.

4. One-cell edge case
- If one eligible free cell exists, spawn must use that cell.

5. Full-board edge case
- If no eligible cells remain, round transitions to win and no further spawn occurs.

## Verification Mapping

- Unit tests assert no-overlap placement and one-cell edge behavior.
- Statistical sanity checks over repeated runs verify non-deterministic placement pattern.
- Integration tests confirm spawn behavior under autonomous and manual control modes.
