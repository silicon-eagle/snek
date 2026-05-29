# Feature Specification: Hamiltonian Autoplay With Random Food

**Feature Branch**: `[003-hamiltonian-autoplay-random-food]`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Now also add random food placement, Hamiltonian-cycle automatic play, keyboard interception takeover, and startup/loss restart behavior that defaults back to Hamiltonian autoplay."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Autonomous Hamiltonian Play (Priority: P1)

As a player, I want the snake to run automatically by default using a Hamiltonian cycle so it can continuously collect food and progress toward winning without manual input.

**Why this priority**: Default autonomous behavior is the core feature and drives startup and post-loss gameplay.

**Independent Test**: Start a fresh session and provide no keyboard input; verify the snake follows the Hamiltonian route, consumes randomly spawned food, and continues running safely.

**Acceptance Scenarios**:

1. **Given** a fresh running session with no user input, **When** ticks advance, **Then** the snake follows the Hamiltonian cycle by default.
2. **Given** autonomous mode is active and food is consumed, **When** new food is spawned, **Then** food appears in a random unoccupied cell.
3. **Given** autonomous mode continues uninterrupted on a supported board, **When** the session progresses, **Then** the snake reaches a win state without self-collision.

---

### User Story 2 - Keyboard Interception Takeover (Priority: P2)

As a player, I want to intercept autonomous movement with arrow keys so I can take over control at any time.

**Why this priority**: Player agency must coexist with default autonomy without confusing handoff behavior.

**Independent Test**: Start in autonomous mode, press a valid arrow key, and verify control switches to user-driven movement by the next tick.

**Acceptance Scenarios**:

1. **Given** autonomous mode is active, **When** the player presses a valid arrow key, **Then** control switches to manual mode by the next movement tick.
2. **Given** manual mode is active, **When** the player provides valid directional input, **Then** movement follows standard turn constraints.
3. **Given** autonomous mode is active, **When** non-arrow input or invalid reverse input is provided, **Then** autonomous control remains active and gameplay continues predictably.

---

### User Story 3 - Restart Returns to Autoplay (Priority: P3)

As a player, I want every startup and post-loss restart to begin in Hamiltonian autoplay mode so the game always returns to its default autonomous behavior.

**Why this priority**: Reliable restart behavior keeps the feature loop consistent after interruption or failure.

**Independent Test**: Take manual control, lose, wait for delayed restart, and verify the next round starts in autonomous Hamiltonian mode.

**Acceptance Scenarios**:

1. **Given** a session ends in loss from either autonomous or manual control, **When** the restart delay expires, **Then** the new session starts automatically in autonomous Hamiltonian mode.
2. **Given** the app loads initially, **When** the first session starts, **Then** autonomous Hamiltonian mode is active by default.
3. **Given** the game is in loss-delay state, **When** movement input is provided, **Then** board state does not change before restart.

---

### Edge Cases

- Random food placement when only one free cell remains on the board.
- Random food placement must never select a snake-occupied cell.
- Player interception input arrives on the same tick as an autonomous move decision.
- Invalid interception input (non-arrow or prohibited reverse) while autonomous mode is active.
- Manual takeover occurs, then immediate reset/loss restart should still return to autonomous default mode.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST start each new session in autonomous mode on initial app startup.
- **FR-002**: System MUST start each post-loss delayed restart session in autonomous mode.
- **FR-003**: System MUST define and use a Hamiltonian cycle route that covers all playable board cells for supported board configurations.
- **FR-004**: While autonomous mode is active, system MUST advance the snake along the next step of the Hamiltonian route on each movement tick.
- **FR-005**: System MUST place food randomly at session start and after each food consumption.
- **FR-006**: Random food placement MUST choose only from currently unoccupied board cells.
- **FR-007**: A valid arrow-key interception during autonomous mode MUST switch control to manual mode by the next movement tick.
- **FR-008**: After manual takeover, system MUST keep manual control active until session end or reset.
- **FR-009**: Invalid interception input (non-arrow or disallowed reverse turn) MUST NOT force control-mode transition.
- **FR-010**: System MUST preserve existing wrap-through border behavior in both autonomous and manual modes.
- **FR-011**: Loss in either control mode MUST trigger the existing loss-red visual state and delayed restart flow.
- **FR-012**: Movement input during loss-delay state MUST NOT mutate board state.
- **FR-013**: System MUST prevent duplicate delayed restarts from a single loss event.
- **FR-014**: Without manual interception, autonomous mode on supported boards MUST progress to win under normal gameplay conditions.

### User Experience Consistency Requirements _(mandatory)_

- **UX-001**: Control handoff from autonomous to manual mode MUST be predictable and free of ambiguous movement jumps.
- **UX-002**: Loss-red feedback and delayed restart timing cues MUST remain consistent regardless of whether autonomous or manual mode was active before loss.
- **UX-003**: Visual/gameplay state transitions (startup, autonomous play, manual takeover, loss, restart) MUST remain coherent across supported viewport classes.
- **UX-004**: Keyboard behavior for takeover and manual control MUST remain consistent across supported input environments.

### Performance Requirements _(mandatory)_

- **PRF-001**: During autonomous and manual gameplay, median frame rate MUST remain at or above 55 FPS.
- **PRF-002**: In at least 95% of food-spawn events, random placement MUST complete within one movement tick interval.
- **PRF-003**: In at least 95% of valid interception attempts, manual takeover MUST become active by the next movement tick.
- **PRF-004**: In at least 95% of losses, automatic restart MUST begin between 2.5 and 3.5 seconds after loss.
- **PRF-005**: Performance validation MUST include extended autonomous runs with repeated food spawns and repeated manual takeover events.

### Key Entities _(include if feature involves data)_

- **Control Mode State**: Current control owner for the round, including autonomous default mode and manual takeover mode.
- **Hamiltonian Route State**: Ordered board traversal cycle and current route position used for autonomous movement decisions.
- **Food Spawn State**: Current food location and eligible free-cell pool used for random placement.
- **Round Lifecycle State**: Session status timeline covering running, loss-delay, restart, and control-mode reset behavior.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of initial startups and post-loss restarts begin in autonomous Hamiltonian mode.
- **SC-002**: In validation sampling of 10,000 food spawns, 0 food placements occur on snake-occupied cells.
- **SC-003**: In unattended autonomous validation runs on supported boards, at least 99% of rounds reach win without manual input.
- **SC-004**: At least 95% of valid player interception attempts transfer control to manual mode by the next movement tick.
- **SC-005**: At least 95% of losses restart into autonomous running sessions within the 2.5 to 3.5 second target window.
- **SC-006**: In user validation sessions, at least 90% of players can successfully trigger manual takeover on first attempt.

## Assumptions

- Supported board configurations are those for which a full Hamiltonian cycle route is available; the existing default board size remains supported.
- Existing wrap-through borders, loss-red feedback, and delayed restart behavior remain in scope and continue to apply.
- Random food placement uses a uniform random selection among currently unoccupied cells.
- Manual takeover does not automatically revert to autonomous mode during the same round; autonomous mode resumes on the next new session.
