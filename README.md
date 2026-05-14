# Dream Arcade 🎮

A React + TypeScript + Tailwind CSS browser mini-game hub that generates a playable arcade microgame from any dream prompt you type.

## How It Works

1. Enter a dream prompt (e.g. "I'm being chased by homework in space")
2. The app generates a themed game with custom emojis, colors, and boss names
3. Play one of three randomly selected game modes:
   - **🚨 Dodge Mode** — Survive as long as possible while enemies rain down
   - **🎯 Catch Mode** — Catch good objects, avoid bad ones in 45 seconds
   - **💀 Boss Mode** — Click/Space to attack the boss while dodging its projectiles
4. Your scores and dream history are saved locally

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Vite** for bundling
- `requestAnimationFrame` game loop via custom `useGameLoop` hook
- `localStorage` for persistent high scores and dream history

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
