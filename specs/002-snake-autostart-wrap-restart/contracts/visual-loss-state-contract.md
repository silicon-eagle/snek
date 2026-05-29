# Contract: Visual Loss State

## Scope

Defines the required visual behavior for the loss state where everything in the gameplay surface appears in a red theme until restart.

## Status-to-Visual Mapping

- running or won
  - Use default gameplay palette.
- lost
  - Use loss-red palette for all visible gameplay elements.

## Required Loss-Red Coverage

When status is lost, the following elements must all render in the loss-red theme:

- Canvas background fill
- Grid line color
- Snake segment color
- Food cell color
- Game frame and canvas border styling
- Reset button visual styling within the game shell

## Transition Contract

1. Enter loss-red
- On transition to lost, loss-red visuals must be visible within 100 ms in at least 95% of observed runs.

2. Hold loss-red
- Loss-red remains active throughout the delay window before automatic restart.

3. Exit loss-red
- On new running session start (auto or manual), visuals must revert from loss-red to default palette immediately.

## Consistency Requirements

- Visual mode must be derived from authoritative session status; no separate unsynchronized visual state is allowed.
- The same status signal must drive both canvas rendering and CSS-driven shell chrome.
- Reset control chrome must enter and exit the loss-red mode in lockstep with the game frame and canvas.
- Viewport changes during loss-red must not revert or partially apply the palette.

## Verification Mapping

- Integration checks assert status-driven DOM markers and corresponding visible behavior.
- Renderer-oriented tests assert palette choice branch for normal vs loss-red sessions.
