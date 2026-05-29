# Data Model: Snake Wraparound Recovery

## Entity: GameSession

Description: Immutable runtime snapshot for one active game round.

| Field  | Type                     | Required | Notes |
| ------ | ------------------------ | -------- | ----- |
| id     | string                   | Yes      | New identifier per reset/auto-restart round |
| status | enum(running, won, lost) | Yes      | Drives gameplay and visual mode |
| score  | integer                  | Yes      | Increases on food consumption |
| tick   | integer                  | Yes      | Monotonic tick counter for active round |
| config | GameConfig               | Yes      | Grid/timing configuration |
| snake  | SnakeState               | Yes      | Segment list, heading, growth bank |
| food   | FoodState                | Yes      | Active food position |

Validation rules:

- status must be one of running, won, lost.
- tick and score must be non-negative.
- snake head must remain within bounds after wrap normalization.

## Entity: WrappedMoveResolution

Description: Per-tick movement resolution shape used by rules/reducer.

| Field         | Type           | Required | Notes |
| ------------- | -------------- | -------- | ----- |
| currentHead   | GridCoordinate | Yes      | Current head position before movement |
| heading       | Direction      | Yes      | Active direction for the tick |
| candidateHead | GridCoordinate | Yes      | Unwrapped next coordinate |
| wrappedHead   | GridCoordinate | Yes      | Candidate mapped to opposite border if needed |

Validation rules:

- wrappedHead.x is in [0, cols-1].
- wrappedHead.y is in [0, rows-1].
- wrappedHead is the coordinate used for collision and food checks.

## Entity: RecoveryTimerState

Description: Controller-owned timing state for post-loss auto-restart.

| Field            | Type    | Required | Notes |
| ---------------- | ------- | -------- | ----- |
| activeSessionId  | string  | Yes      | Session id associated with pending restart |
| lossDetectedAtMs | integer | Yes      | Timestamp when loss state started |
| restartDelayMs   | integer | Yes      | Default 3000 ms |
| restartDueAtMs   | integer | Yes      | Derived as lossDetectedAtMs + restartDelayMs |
| pending          | boolean | Yes      | True only while waiting to auto-restart |

Validation rules:

- Exactly one pending timer can exist at a time.
- pending must be cleared on manual reset and on controller disposal.
- restart callback must no-op if session id no longer matches activeSessionId.

## Entity: VisualMode

Description: Derived display mode for canvas and shell chrome.

| Field         | Type                  | Required | Notes |
| ------------- | --------------------- | -------- | ----- |
| sessionStatus | enum(running, won, lost) | Yes   | Source-of-truth status |
| palette       | enum(default, lossRed) | Yes    | lossRed applies when sessionStatus = lost |

Validation rules:

- If sessionStatus is lost, all visible gameplay elements use lossRed palette.
- Palette resets to default immediately when a new running session starts.

## Relationships

- GameSession is the authoritative source for gameplay status.
- WrappedMoveResolution is derived from GameSession.snake + GameConfig during each tick.
- RecoveryTimerState references GameSession.id to avoid stale timer side effects.
- VisualMode is derived from GameSession.status and must stay synchronized with rendering.

## State Transitions

- running -> running: normal movement tick, including border wrap-through.
- running -> lost: self-collision, including collisions detected after wrapping.
- running -> won: win condition reached (existing behavior remains).
- lost -> lost: turn/tick inputs during recovery delay do not change board state.
- lost -> running: automatic restart after delay, or manual reset before delay ends.
- won -> running: manual reset behavior unchanged.
