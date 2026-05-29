# snek

Minimal snake game built with TypeScript, React, Vite, and HTML Canvas.

## Product Scope

- Auto-starts on load
- Autonomous Hamiltonian-cycle play is the default control mode
- Arrow keys control movement
- Valid arrow input during autoplay switches control to manual mode
- Random food always spawns on unoccupied cells
- Snake wraps through borders to the opposite side
- On loss, gameplay surface switches to red visuals
- After loss, game auto-restarts in about 3 seconds and returns to autoplay default mode
- Single reset button
- UI is only square grid plus reset
- No HUD text, no autoplay controls, no pause/stop/start controls

## Getting Started

## Run the Program

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

## Build and Preview

```bash
pnpm build
pnpm preview
```

## Validation Commands

- pnpm format
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm test:integration
