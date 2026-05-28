# Data Model: Minimal Snake Game

## Entity: GameConfig

Description: Immutable runtime configuration.

| Field  | Type    | Required | Notes                     |
| ------ | ------- | -------- | ------------------------- |
| rows   | integer | Yes      | Number of grid rows       |
| cols   | integer | Yes      | Number of grid columns    |
| tickMs | integer | Yes      | Fixed tick interval in ms |

Validation rules:

- rows and cols must be >= 4.
- tickMs must be > 0.

## Entity: GridCoordinate

Description: Coordinate in the playable grid.

| Field | Type    | Required | Notes        |
| ----- | ------- | -------- | ------------ |
| x     | integer | Yes      | Column index |
| y     | integer | Yes      | Row index    |

Validation rules:

- 0 <= x < cols
- 0 <= y < rows

## Entity: SnakeState

Description: Ordered snake body and movement state.

| Field         | Type                        | Required | Notes                        |
| ------------- | --------------------------- | -------- | ---------------------------- |
| segments      | GridCoordinate[]            | Yes      | Head at index 0              |
| heading       | enum(up, down, left, right) | Yes      | Active heading               |
| pendingGrowth | integer                     | Yes      | Segments to add after eating |

Validation rules:

- segments must be unique.
- immediate reverse input is invalid.
- pendingGrowth must be >= 0.

## Entity: FoodState

Description: Active food target.

| Field    | Type           | Required | Notes         |
| -------- | -------------- | -------- | ------------- |
| position | GridCoordinate | Yes      | Food location |

Validation rules:

- food position must not overlap snake segments.

## Entity: GameSession

Description: Runtime state for one auto-started snake run.

| Field  | Type                     | Required | Notes                                 |
| ------ | ------------------------ | -------- | ------------------------------------- |
| id     | string                   | Yes      | Session identifier                    |
| status | enum(running, won, lost) | Yes      | No paused/idle modes in minimal scope |
| score  | integer                  | Yes      | Current score                         |
| tick   | integer                  | Yes      | Tick counter                          |
| snake  | SnakeState               | Yes      | Snake runtime state                   |
| food   | FoodState                | Yes      | Active food                           |

Validation rules:

- score must be >= 0.
- status is won when snake length == rows \* cols.
- status is lost when next head exits grid or intersects snake body.

## Relationships

- GameSession contains one GameConfig, one SnakeState, and one FoodState.
- SnakeState constrains valid FoodState placement.
- Session status is derived only from snake movement outcomes.

## State Transitions

- running -> won: snake occupies all tiles.
- running -> lost: self-collision or boundary exit.
- won/lost -> running: reset action creates fresh session and starts immediately.
