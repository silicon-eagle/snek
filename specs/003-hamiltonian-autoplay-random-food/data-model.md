# Data Model: Hamiltonian Autoplay With Random Food

## Entity: GameSession

Description: Immutable runtime snapshot for one active round.

| Field       | Type                     | Required | Notes |
| ----------- | ------------------------ | -------- | ----- |
| id          | string                   | Yes      | Unique per new round |
| status      | enum(running, won, lost) | Yes      | Primary lifecycle state |
| score       | integer                  | Yes      | Increments on food consumption |
| tick        | integer                  | Yes      | Monotonic movement counter |
| config      | GameConfig               | Yes      | Grid/timing constraints |
| controlMode | ControlModeState         | Yes      | Autonomous default or manual takeover |
| snake       | SnakeState               | Yes      | Segment list, heading, growth bank |
| food        | FoodSpawnState           | Yes      | Active food placement data |
| route       | HamiltonianRouteState    | Yes      | Cycle metadata for autoplay decisions |

Validation rules:

- score and tick are non-negative.
- controlMode.owner is always defined.
- route coverage equals total playable cells for supported boards.

## Entity: ControlModeState

Description: Current movement decision owner.

| Field          | Type                     | Required | Notes |
| -------------- | ------------------------ | -------- | ----- |
| owner          | enum(autonomous, manual) | Yes      | Default autonomous at round start |
| switchedAtTick | integer                  | No       | Present after takeover for observability |

Validation rules:

- owner is autonomous at startup and after every restart.
- manual mode can only be entered by valid interception input.

## Entity: HamiltonianRouteState

Description: Precomputed full-cycle traversal for autonomous control.

| Field            | Type              | Required | Notes |
| ---------------- | ----------------- | -------- | ----- |
| cycle            | GridCoordinate[]  | Yes      | Ordered closed route over board |
| indexByCell      | map<string, int>  | Yes      | Fast lookup for route position |
| currentRouteStep | integer           | Yes      | Position of snake head in cycle |
| supported        | boolean           | Yes      | True only when full-cycle route exists |

Validation rules:

- cycle length equals rows * cols when supported is true.
- each board coordinate appears exactly once in cycle.
- next route step wraps to cycle start.

## Entity: FoodSpawnState

Description: Active food placement and spawn candidate context.

| Field         | Type             | Required | Notes |
| ------------- | ---------------- | -------- | ----- |
| position      | GridCoordinate   | Yes      | Current food location |
| freeCellCount | integer          | Yes      | Number of eligible spawn cells |
| source        | enum(randomFree) | Yes      | Spawn strategy marker |

Validation rules:

- food position must not overlap snake segments.
- freeCellCount must be >= 0 and <= total board cells.
- when freeCellCount is 0, round should transition to won.

## Entity: RecoveryTimerState

Description: Controller-owned post-loss restart timing state.

| Field            | Type    | Required | Notes |
| ---------------- | ------- | -------- | ----- |
| activeSessionId  | string  | Yes      | Session associated with pending restart |
| lossDetectedAtMs | integer | Yes      | Loss timestamp |
| restartDelayMs   | integer | Yes      | Restart delay target |
| restartDueAtMs   | integer | Yes      | Derived due timestamp |
| pending          | boolean | Yes      | True while waiting for auto-restart |

Validation rules:

- at most one pending restart exists at a time.
- pending state clears on manual reset, restart, or dispose.

## Relationships

- GameSession owns ControlModeState, HamiltonianRouteState, SnakeState, and FoodSpawnState.
- HamiltonianRouteState drives autonomous movement when controlMode.owner = autonomous.
- FoodSpawnState selection excludes all SnakeState segments.
- RecoveryTimerState references GameSession.id to guard against stale timer callbacks.

## State Transitions

- round_start -> running_autonomous: startup and post-loss restart default.
- running_autonomous -> running_manual: valid arrow interception.
- running_autonomous -> running_autonomous: no valid interception.
- running_manual -> running_manual: manual control persists until round end/reset.
- running_* -> lost: collision condition in active mode.
- lost -> running_autonomous: delayed restart or manual reset.
- running_* -> won: snake occupies all playable cells.
