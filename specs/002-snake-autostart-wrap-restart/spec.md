# Feature Specification: Snake Wraparound Recovery

**Feature Branch**: `[002-snake-autostart-wrap-restart]`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Add the following functionality to the project: automatic start of the snake on startup, the snake should pass through the border to the opposite side, and everything red when the snake loses and restart again after a few seconds."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Wrap Through Borders (Priority: P1)

As a player, I want the snake to reappear on the opposite side when crossing a border so movement stays continuous.

**Why this priority**: Border wrapping changes the core movement model and is required for every play session.

**Independent Test**: Start a session, move into each boundary, and verify the snake continues from the opposite side without stopping.

**Acceptance Scenarios**:

1. **Given** a running game and the snake moving into the right border, **When** the head crosses the border, **Then** the head appears at the left border in the same row and the game remains running.
2. **Given** a running game and the snake moving into the top border, **When** the head crosses the border, **Then** the head appears at the bottom border in the same column and the game remains running.
3. **Given** the snake wraps into a cell occupied by its own body, **When** movement resolves, **Then** the game enters a loss state.

---

### User Story 2 - Start Automatically (Priority: P2)

As a player, I want gameplay to begin automatically on app launch and after automatic restart so there is no extra start action.

**Why this priority**: Fast entry into gameplay reduces friction and keeps loop continuity after losses.

**Independent Test**: Open the app, observe immediate active gameplay, then lose and verify the next round starts automatically after the delay.

**Acceptance Scenarios**:

1. **Given** the app has just loaded, **When** initialization completes, **Then** the game is already running without manual start input.
2. **Given** a loss has occurred and the restart delay has elapsed, **When** the next round begins, **Then** the game starts automatically without manual start input.

---

### User Story 3 - Red Loss State With Timed Restart (Priority: P3)

As a player, I want a clear red visual loss state and an automatic restart after a short delay so I understand what happened and can continue quickly.

**Why this priority**: Immediate visual feedback and timed recovery make losses understandable without breaking flow.

**Independent Test**: Trigger a loss, verify all gameplay visuals switch to red, wait for the delay, and confirm a new round starts automatically.

**Acceptance Scenarios**:

1. **Given** the snake loses, **When** the loss state is entered, **Then** all visible gameplay elements switch to the loss-red style.
2. **Given** the game is in loss state and the delay is still active, **When** movement input is provided, **Then** the board state does not change.
3. **Given** the game is in loss state, **When** the configured delay expires, **Then** a fresh running round starts automatically.

---

### Edge Cases

- Player triggers loss and then presses reset before the auto-restart delay ends.
- Multiple loss events occur in rapid succession due to repeated inputs near collision moments.
- Snake wraps across a border directly into its own body segment.
- User changes viewport size during red loss state and before auto-restart.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST start a running game session automatically when the app loads.
- **FR-002**: System MUST start a new running game session automatically after each timed post-loss restart.
- **FR-003**: System MUST move the snake head to the opposite border cell when it crosses any board boundary.
- **FR-004**: Border wrapping MUST preserve current movement direction and movement cadence.
- **FR-005**: System MUST apply normal collision rules after wrapping, including loss when the wrapped position overlaps the snake body.
- **FR-006**: System MUST switch all visible gameplay elements to a red loss style immediately after a loss is detected.
- **FR-007**: System MUST keep the red loss style active for a short delay before restarting.
- **FR-008**: System MUST restart automatically after a default 3-second loss delay without requiring user input.
- **FR-009**: Movement input during the red loss delay MUST NOT change snake position or board state.
- **FR-010**: Manual reset during the red loss delay MUST immediately start a fresh running session and cancel any pending automatic restart.
- **FR-011**: System MUST prevent duplicate automatic restarts for a single loss event.

### User Experience Consistency Requirements _(mandatory)_

- **UX-001**: Border wrapping behavior MUST be visually consistent for all four edges of the board.
- **UX-002**: The loss-red state MUST be applied consistently to all visible gameplay elements, not just a subset.
- **UX-003**: Transition from normal play to loss-red state and then to restarted play MUST be smooth and predictable across supported viewport classes.
- **UX-004**: Control behavior during loss delay MUST remain consistent across supported input modes.

### Performance Requirements _(mandatory)_

- **PRF-001**: During standard gameplay, median frame rate MUST remain at or above 55 FPS while border wrapping is active.
- **PRF-002**: In at least 95% of loss events, players MUST see the full loss-red state within 100 ms of loss detection.
- **PRF-003**: In at least 95% of loss events, automatic restart MUST begin between 2.5 and 3.5 seconds after loss.
- **PRF-004**: Performance validation MUST use repeatable gameplay trials that include both frequent border wraps and repeated losses.
- **PRF-005**: Any release candidate with more than 10% regression against the established baseline for these metrics MUST be flagged for review before approval.

### Key Entities _(include if feature involves data)_

- **Round State**: Active game round information including snake position, movement heading, food position, and running status.
- **Loss Snapshot**: Captured loss moment information including when loss occurred and when automatic restart should begin.
- **Visual State**: Current gameplay visual mode, including normal play and loss-red mode applied to all visible elements.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of new sessions in acceptance testing begin automatically on app load without a manual start action.
- **SC-002**: At least 95% of border-crossing movements continue successfully from the opposite side without unintended termination.
- **SC-003**: 100% of verified loss events show a fully red gameplay presentation before automatic restart begins.
- **SC-004**: At least 95% of verified loss events restart automatically within the target 2.5 to 3.5 second window.
- **SC-005**: In user validation sessions, at least 90% of participants correctly recognize loss state and expected automatic restart timing without additional instruction.

## Assumptions

- Existing manual reset behavior remains available and unchanged outside the new loss-delay handling.
- "A few seconds" is interpreted as a default 3-second restart delay for this feature scope.
- Feature applies to the existing single-player local game mode only.
- No additional menus, prompts, or onboarding text are introduced as part of this change.
