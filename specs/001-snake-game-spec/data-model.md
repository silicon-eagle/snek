# Data Model: Snake Game Application

## Entity: GameConfig
Description: Immutable configuration used to start a session.

| Field | Type | Required | Notes |
|---|---|---|---|
| rows | integer | Yes | Number of grid rows |
| cols | integer | Yes | Number of grid columns |
| tickMs | integer | Yes | Fixed update interval in milliseconds |
| initialMode | enum(manual, autoplay) | Yes | Starting control mode |
| audioEnabled | boolean | Yes | Soundtrack preference |

Validation rules:
- rows and cols must be >= 4.
- tickMs must be > 0 and within supported range.

## Entity: GridCoordinate
Description: Canonical coordinate within the playable grid.

| Field | Type | Required | Notes |
|---|---|---|---|
| x | integer | Yes | Column index |
| y | integer | Yes | Row index |

Validation rules:
- 0 <= x < cols
- 0 <= y < rows

## Entity: SnakeState
Description: Ordered representation of the snake body and movement intent.

| Field | Type | Required | Notes |
|---|---|---|---|
| segments | GridCoordinate[] | Yes | Head at index 0 |
| heading | enum(up, down, left, right) | Yes | Current movement direction |
| pendingGrowth | integer | Yes | Number of segments to add |

Validation rules:
- segments must be unique.
- heading reversal into opposite direction in one tick is invalid.
- pendingGrowth must be >= 0.

## Entity: FoodState
Description: Active consumable target.

| Field | Type | Required | Notes |
|---|---|---|---|
| position | GridCoordinate | Yes | Current food location |

Validation rules:
- position must not overlap any snake segment.

## Entity: ControlState
Description: Ownership and transition state for movement commands.

| Field | Type | Required | Notes |
|---|---|---|---|
| mode | enum(manual, autoplay) | Yes | Active control owner |
| queuedDirection | enum(up, down, left, right, none) | Yes | Pending manual direction |
| modeChangeRequested | boolean | Yes | Transition request marker |

Validation rules:
- mode changes apply only at tick boundaries.
- queuedDirection must satisfy no-immediate-reversal rule.

## Entity: AutoplayState
Description: Deterministic strategy data for automatic play.

| Field | Type | Required | Notes |
|---|---|---|---|
| cycleOrder | GridCoordinate[] | Yes | Full Hamiltonian traversal order |
| currentIndex | integer | Yes | Current index in cycleOrder |
| enabled | boolean | Yes | Autoplay active flag |

Validation rules:
- cycleOrder length must equal rows * cols.
- cycleOrder coordinates must be unique and contiguous by legal moves.
- currentIndex must be in range [0, cycleOrder.length - 1].

## Entity: GameSession
Description: Top-level runtime aggregate for one playable run.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | string | Yes | Session identifier |
| status | enum(idle, running, paused, won, lost) | Yes | Session lifecycle state |
| score | integer | Yes | Current score |
| snake | SnakeState | Yes | Current snake state |
| food | FoodState | Yes | Current food state |
| controls | ControlState | Yes | Control ownership state |
| autoplay | AutoplayState | Yes | Autoplay strategy state |
| startedAt | datetime | No | Session start timestamp |
| endedAt | datetime | No | Session end timestamp |

Validation rules:
- score must be >= 0.
- status won if snake.segments length equals rows * cols.
- status lost if next head coordinate is outside grid or overlaps snake body.

## Relationships
- GameSession contains one GameConfig, SnakeState, FoodState, ControlState, and AutoplayState.
- SnakeState segments constrain valid FoodState position.
- ControlState mode determines whether queuedDirection or AutoplayState drives next heading.
- GameSession status is derived from SnakeState transitions and grid occupancy.

## State Transitions

### Session lifecycle
- idle -> running: start session
- running -> paused: pause request
- paused -> running: resume request
- running -> won: snake occupies all tiles
- running -> lost: snake self-collision or boundary exit
- won/lost -> idle: restart/new game

### Control mode lifecycle
- manual -> autoplay: mode switch accepted at next tick boundary
- autoplay -> manual: takeover accepted at next tick boundary
- mode unchanged when requested transition would violate deterministic update order
