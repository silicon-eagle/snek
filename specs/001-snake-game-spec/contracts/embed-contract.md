# Contract: Embeddable Snake Game Module

## Purpose
Define the host-to-game interface for integrating the snake module into a larger website.

## Initialization Contract
Host initializes one game instance per container with configuration and callbacks.

### Required inputs
- container: host-provided mount target
- config: rows, cols, tickMs, initial control mode, audio setting

### Optional callbacks
- onStateChange(snapshot)
- onModeChange(mode)
- onWin(snapshot)
- onLose(snapshot)
- onError(error)

## Runtime Control Contract
The module must expose host-callable lifecycle operations:
- start
- pause
- resume
- restart
- setMode(manual|autoplay)
- getSnapshot
- destroy

Behavioral guarantees:
- Operations are idempotent where applicable (pause/resume/destroy).
- setMode applies at tick boundary and does not reset score or board state.
- destroy releases timers, input listeners, and audio resources.

## State Snapshot Contract
Snapshot payload returned by callbacks/getSnapshot must include:
- session status (idle/running/paused/won/lost)
- score
- snake length
- control mode
- terminal reason when status is won or lost

## Error Contract
- Invalid host configuration must emit deterministic error messages.
- Runtime errors must trigger onError without leaving orphaned timers/listeners.
- Failed audio initialization must not block gameplay initialization.
