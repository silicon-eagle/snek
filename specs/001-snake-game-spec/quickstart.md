# Quickstart: Snake Game Application

## Purpose
Validate that the feature is implemented according to the specification and constitution gates.

## Prerequisites
- Node.js 20+
- npm 10+ (or equivalent package manager)
- Modern browser (Chrome, Edge, Firefox, or Safari)

## 1. Install Dependencies
1. Install project dependencies.
2. Confirm linting and test tooling is available.

Example commands:
- npm install
- npm run lint

## 2. Run the Application
1. Start the development server.
2. Open the local application URL in desktop and mobile viewport emulation.

Example command:
- npm run dev

## 3. Validate User Story 1 (Manual Play)
1. Start a new game session.
2. Move the snake with keyboard controls and on-screen controls.
3. Verify score and growth after food collection.
4. Verify lose outcome when colliding with body or leaving the grid.
5. Verify win outcome when all grid tiles are occupied.

## 4. Validate User Story 2 (Autoplay)
1. Start a new game session in autoplay mode.
2. Observe deterministic movement progression.
3. Verify autoplay reaches a full-board win under default configuration.

## 5. Validate User Story 3 (Control Handoff)
1. Enable autoplay, then take manual control during an active session.
2. Switch back to autoplay.
3. Verify no state reset, desync, or input ambiguity.

## 6. Validate User Story 4 (Embedding)
1. Mount game module inside a host-page container.
2. Verify initialization renders correctly without host layout breakage.
3. Unmount/destroy instance and ensure loop/audio/input listeners are released.
4. Re-mount and confirm clean restart.

## 7. Run Automated Tests
Run required suites:
- Unit tests for rules, state transitions, and Hamiltonian traversal
- Integration tests for mode switching and session lifecycle
- Contract tests for embed interface behavior
- Regression tests for previously fixed defects

Example commands:
- npm run test
- npm run test:integration
- npm run test:contract

## 8. Performance Verification
1. Run a 5-minute session in manual mode and autoplay mode.
2. Capture frame metrics and input latency in browser performance tools.
3. Verify conformance with budgets:
   - Median FPS >= 55
   - p95 input latency <= 100 ms
   - Sustained memory growth <= 10% over 5 minutes
4. If regression >10% versus baseline is found, block release until mitigated or documented.
