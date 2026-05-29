# Contract: Control Handoff and Restart Defaults

## Scope

Defines autonomous/manual ownership transitions and restart default behavior.

## Inputs

- TICK action
- TURN action (arrow keys)
- RESET action
- LOSS transition

## Behavioral Contract

1. Autonomous default
- New rounds start with autonomous control active.

2. Valid interception
- During autonomous mode, a valid arrow-key turn must switch control to manual mode by the next movement tick.
- Transition records switchedAtTick metadata for observability.

3. Invalid interception
- Non-arrow input or disallowed reverse-turn input must not trigger control-mode change.

4. Manual persistence
- After takeover, manual control remains active until round end or reset.

5. Restart reset
- After loss-delay restart or manual reset, control mode returns to autonomous default.

6. Loss-delay freeze
- While status is lost and restart is pending, movement input must not mutate board state or control ownership.

## Verification Mapping

- Unit tests assert transition table correctness for valid/invalid takeover cases.
- Integration tests assert startup and post-loss default-autonomous behavior.
