# Dream Arcade 🎮

A browser-based mini game hub where you type a dream prompt and the app generates a weird, playable arcade-style microgame based on that prompt. Built with React + TypeScript + Tailwind CSS + Vite.

## Features

- 🎮 **Three playable microgame modes** — randomly selected for each dream:
  - **🚨 Dodge Mode** — Survive as long as possible while dream-themed enemies rain down. 3 lives. WASD/Arrow keys.
  - **🎯 Catch Mode** — 45-second timed game where you catch good objects and avoid bad ones. Left/Right to move.
  - **💀 Boss Mode** — Fight a silly dream-themed boss with a health bar. Dodge projectiles and attack with CLICK or SPACE.
- 🌀 **Dream-to-theme engine** — Parses your prompt to pick custom emojis, colors, boss names, flavor text, and enemy labels.
- 🏆 **High score tracking** — Your top 20 scores are saved in `localStorage`.
- 📜 **Dream Gallery** — Browse your dream history and replay any prompt.
- 🎨 **Retro arcade UI** — Dark neon aesthetic with glowing borders, gradient text, and animated accents.
- 💾 **No backend required** — All data saved locally in the browser.
- ⌨️ **Starter prompts** included to get you going instantly.

## How It Works

1. Enter a dream prompt on the landing page (e.g. *"I'm being chased by homework in space"* or *"a duck is running a pizza shop during a thunderstorm"*).
2. Click **Generate Game** — the app picks a random game mode and builds a theme from your words.
3. Read the flavor text intro, then hit **PLAY NOW** for a 3-2-1 countdown.
4. Play the microgame using keyboard controls.
5. See your score on the game-over screen, compare to your high score, and choose to play again or try a new dream.
6. Browse past dreams and scores in the **Dream Gallery**.

## Tech Stack

| Tool | Purpose |
|------|---------|
| **React 19** | UI components & state management |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS v4** | Utility-first styling via `@tailwindcss/vite` |
| **Vite** | Fast dev server & bundler |
| `requestAnimationFrame` | Smooth 60fps game loop via `useGameLoop` hook |
| `localStorage` | Persistent high scores and dream history |

## Project Structure

```
src/
├── components/
│   ├── LandingScreen.tsx    # Prompt input + starter dreams
│   ├── GameIntroScreen.tsx  # Flavor text + 3-2-1 countdown
│   ├── GameOverScreen.tsx   # Score display + high score detection
│   ├── GalleryScreen.tsx    # Dream history & leaderboard tabs
│   └── games/
│       ├── DodgeGame.tsx    # Dodge mode (WASD, falling enemies)
│       ├── CatchGame.tsx    # Catch mode (timed paddle game)
│       └── BossGame.tsx     # Boss mode (HP bar, projectile dodge)
├── hooks/
│   └── useGameLoop.ts       # rAF-based delta-time game loop
├── utils/
│   ├── themeGenerator.ts    # Prompt → theme/title/emojis/boss
│   └── storage.ts           # localStorage helpers
├── types/
│   └── index.ts             # Shared TypeScript types
└── App.tsx                  # Screen routing & game state
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Future Improvement Ideas

- **More game modes** — Typing/rhythm game, whack-a-mole, shooting gallery
- **Sound effects** — Web Audio API for retro blips and bleeps
- **Better AI prompt parsing** — Use an LLM API to generate richer, more creative themes
- **Online leaderboard** — Share high scores with others
- **Multiplayer** — Co-op or competitive dream battles
- **Mobile touch controls** — Virtual joystick for phone play
- **More visual polish** — Particle effects, screen shake, hit flash animations
- **Dream sharing** — Generate a shareable URL from a dream prompt
