import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameTheme } from '../../types';
import { useGameLoop } from '../../hooks/useGameLoop';

interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
  size: number;
}

interface Props {
  theme: GameTheme;
  onGameOver: (score: number) => void;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 40;
const PLAYER_SPEED = 5;
const ENEMY_SIZE = 32;

export const DodgeGame: React.FC<Props> = ({ theme, onGameOver }) => {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
  const [playerY, setPlayerY] = useState(GAME_HEIGHT - PLAYER_SIZE - 20);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(true);
  const [invincible, setInvincible] = useState(false);

  const playerRef = useRef({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - PLAYER_SIZE - 20 });
  const keysRef = useRef<Set<string>>(new Set());
  const enemyIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const scoreTimerRef = useRef(0);
  const livesRef = useRef(3);
  const invincibleRef = useRef(false);
  const runningRef = useRef(true);

  // Key handlers
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const checkCollision = (px: number, py: number, ex: number, ey: number): boolean => {
    const margin = 12;
    return (
      px + margin < ex + ENEMY_SIZE - margin &&
      px + PLAYER_SIZE - margin > ex + margin &&
      py + margin < ey + ENEMY_SIZE - margin &&
      py + PLAYER_SIZE - margin > ey + margin
    );
  };

  const gameUpdate = useCallback((delta: number) => {
    if (!runningRef.current) return;

    const keys = keysRef.current;
    const speed = PLAYER_SPEED * (delta / 16);

    // Move player
    let { x, y } = playerRef.current;
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) x = Math.max(0, x - speed);
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) x = Math.min(GAME_WIDTH - PLAYER_SIZE, x + speed);
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) y = Math.max(0, y - speed);
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) y = Math.min(GAME_HEIGHT - PLAYER_SIZE, y + speed);
    playerRef.current = { x, y };
    setPlayerX(x);
    setPlayerY(y);

    // Spawn enemies
    spawnTimerRef.current += delta;
    const spawnInterval = Math.max(600, 1500 - Math.floor(score / 5) * 50);
    if (spawnTimerRef.current > spawnInterval) {
      spawnTimerRef.current = 0;
      const enemyEmojis = [theme.enemyEmoji, '💀', '⚡', '🔥', '👾'];
      setEnemies(prev => [
        ...prev.slice(-20),
        {
          id: enemyIdRef.current++,
          x: Math.random() * (GAME_WIDTH - ENEMY_SIZE),
          y: -ENEMY_SIZE,
          speed: 2 + Math.random() * 3 + Math.floor(score / 10) * 0.3,
          emoji: enemyEmojis[Math.floor(Math.random() * enemyEmojis.length)],
          size: ENEMY_SIZE,
        },
      ]);
    }

    // Score timer
    scoreTimerRef.current += delta;
    if (scoreTimerRef.current > 500) {
      scoreTimerRef.current = 0;
      setScore(s => s + 1);
    }

    // Move enemies & check collision
    setEnemies(prev => {
      const next: Enemy[] = [];
      let hit = false;
      for (const enemy of prev) {
        const newY = enemy.y + enemy.speed * (delta / 16);
        if (newY > GAME_HEIGHT) continue; // remove off-screen
        if (!invincibleRef.current && checkCollision(playerRef.current.x, playerRef.current.y, enemy.x, newY)) {
          hit = true;
          continue; // remove this enemy on hit
        }
        next.push({ ...enemy, y: newY });
      }
      if (hit) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          runningRef.current = false;
          setRunning(false);
        } else {
          // Brief invincibility
          invincibleRef.current = true;
          setInvincible(true);
          setTimeout(() => { invincibleRef.current = false; setInvincible(false); }, 1500);
        }
      }
      return next;
    });
  }, [theme.enemyEmoji, score]);

  useGameLoop(gameUpdate, running);

  // Game over effect
  useEffect(() => {
    if (!running) {
      setTimeout(() => onGameOver(score), 500);
    }
  }, [running, score, onGameOver]);

  return (
    <div className="flex flex-col items-center" style={{ userSelect: 'none' }}>
      {/* HUD */}
      <div className="flex justify-between items-center w-full max-w-[600px] mb-2 px-2">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="text-2xl" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div className="font-mono text-lg" style={{ color: theme.neonColor }}>
          SCORE: <span className="font-black">{score}</span>
        </div>
      </div>

      {/* Game area */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: GAME_WIDTH,
          maxWidth: '100%',
          height: GAME_HEIGHT,
          background: `radial-gradient(ellipse at center, ${theme.backgroundColor}ee 0%, #000 100%)`,
          border: `2px solid ${theme.neonColor}`,
          boxShadow: `0 0 30px ${theme.neonColor}44`,
        }}
      >
        {/* Background text */}
        <div
          className="absolute inset-0 flex items-center justify-center text-9xl font-black opacity-5 pointer-events-none"
          style={{ color: theme.neonColor }}
        >
          {theme.enemyEmoji}
        </div>

        {/* Player */}
        <div
          className="absolute text-4xl flex items-center justify-center transition-opacity"
          style={{
            left: playerX,
            top: playerY,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            opacity: invincible ? 0.5 : 1,
            filter: invincible ? 'brightness(2)' : 'none',
            fontSize: '28px',
          }}
        >
          {theme.playerEmoji}
        </div>

        {/* Enemies */}
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: enemy.x,
              top: enemy.y,
              width: ENEMY_SIZE,
              height: ENEMY_SIZE,
              fontSize: '24px',
            }}
          >
            {enemy.emoji}
          </div>
        ))}

        {/* Game over overlay */}
        {!running && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-4xl font-black text-red-400">💀 GAME OVER</p>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs font-mono mt-2">WASD / Arrow Keys to move</p>
    </div>
  );
};
