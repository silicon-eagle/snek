# Contract: Session Lifecycle and Restart

## Scope

Defines externally observable session behavior for startup, border wrapping, loss handling, and automatic recovery.

## Inputs

- App initialization
- TICK action
- TURN action
- RESET action

## Behavioral Contract

1. Auto-start on load
- On app initialization, the session must enter running state without any user start action.

2. Border wrap-through
- When a tick moves the snake head beyond any grid boundary, the resolved head position must appear on the opposite boundary in the same lane.
- Direction and tick cadence must remain unchanged by wrapping.
- Boundary crossing by itself is not a terminal loss condition.

3. Post-wrap collision handling
- After wrapping, collision detection must run against the wrapped coordinate.
- If wrapped coordinate overlaps collision body, status transitions to lost.

4. Loss freeze window
- While status is lost and restart delay is active, movement input must not mutate snake position, heading, score, food, or tick progression beyond the loss transition tick.

5. Automatic restart
- A loss event must schedule exactly one automatic restart for approximately 3000 ms later.
- Valid acceptance window is 2500 ms to 3500 ms for restart start time.

6. Manual reset precedence
- Reset during loss delay must start a fresh running session immediately.
- Reset must cancel any pending auto-restart tied to the previous loss.

7. Duplicate restart prevention
- No loss event may trigger multiple fresh sessions without an intervening new loss.

## Observability Contract

- The session status exposed to UI consumers must reflect transitions in this order:
  - running -> lost -> running (auto-restart path)
  - running -> lost -> running (manual reset path)
- A fresh round must receive a new session identifier.

## Verification Mapping

- Unit coverage: reducer and session-orchestration tests for wrap resolution, collision, and restart scheduling/cancellation.
- Integration coverage: lifecycle tests for auto-start, red loss delay, and restart behavior timing.
