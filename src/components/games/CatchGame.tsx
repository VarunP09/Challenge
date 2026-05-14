import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameTheme } from '../../types';
import { useGameLoop } from '../../hooks/useGameLoop';

interface FallingObject {
  id: number;
  x: number;
  y: number;
  speed: number;
  isGood: boolean;
  emoji: string;
}

interface Props {
  theme: GameTheme;
  onGameOver: (score: number) => void;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 7;
const OBJ_SIZE = 32;
const GAME_DURATION = 45; // seconds

export const CatchGame: React.FC<Props> = ({ theme, onGameOver }) => {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [running, setRunning] = useState(true);
  const [catchEffect, setCatchEffect] = useState<{ x: number; y: number; good: boolean } | null>(null);

  const playerRef = useRef(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const keysRef = useRef<Set<string>>(new Set());
  const objIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const timeTimerRef = useRef(0);
  const scoreRef = useRef(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keysRef.current.add(e.key); e.preventDefault(); };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const gameUpdate = useCallback((delta: number) => {
    if (!runningRef.current) return;

    const keys = keysRef.current;
    const speed = PLAYER_SPEED * (delta / 16);

    // Move player
    let px = playerRef.current;
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) px = Math.max(0, px - speed);
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) px = Math.min(GAME_WIDTH - PLAYER_WIDTH, px + speed);
    playerRef.current = px;
    setPlayerX(px);

    // Timer
    timeTimerRef.current += delta;
    if (timeTimerRef.current >= 1000) {
      timeTimerRef.current = 0;
      setTimeLeft(t => {
        if (t <= 1) {
          runningRef.current = false;
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }

    // Spawn
    spawnTimerRef.current += delta;
    const spawnInterval = Math.max(500, 1200 - Math.floor(scoreRef.current / 5) * 30);
    if (spawnTimerRef.current > spawnInterval) {
      spawnTimerRef.current = 0;
      const isGood = Math.random() > 0.4;
      setObjects(prev => [
        ...prev.slice(-25),
        {
          id: objIdRef.current++,
          x: Math.random() * (GAME_WIDTH - OBJ_SIZE),
          y: -OBJ_SIZE,
          speed: 2.5 + Math.random() * 2,
          isGood,
          emoji: isGood ? theme.goodEmoji : theme.badEmoji,
        },
      ]);
    }

    // Move objects & check catch
    const playerBottom = GAME_HEIGHT - PLAYER_HEIGHT - 10;
    setObjects(prev => {
      const next: FallingObject[] = [];
      let scored = 0;
      for (const obj of prev) {
        const newY = obj.y + obj.speed * (delta / 16);
        if (newY > GAME_HEIGHT) { next.push({ ...obj, y: newY }); continue; }
        // Check if caught by player
        const caught =
          newY + OBJ_SIZE >= playerBottom &&
          newY <= playerBottom + PLAYER_HEIGHT &&
          obj.x + OBJ_SIZE > playerRef.current + 5 &&
          obj.x < playerRef.current + PLAYER_WIDTH - 5;
        if (caught) {
          scored += obj.isGood ? 2 : -1;
          setCatchEffect({ x: obj.x, y: newY, good: obj.isGood });
          setTimeout(() => setCatchEffect(null), 400);
        } else {
          next.push({ ...obj, y: newY });
        }
      }
      if (scored !== 0) {
        scoreRef.current = Math.max(0, scoreRef.current + scored);
        setScore(scoreRef.current);
      }
      return next;
    });
  }, [theme.goodEmoji, theme.badEmoji]);

  useGameLoop(gameUpdate, running);

  useEffect(() => {
    if (!running) {
      setTimeout(() => onGameOver(scoreRef.current), 800);
    }
  }, [running, onGameOver]);

  const playerBottom = GAME_HEIGHT - PLAYER_HEIGHT - 10;

  return (
    <div className="flex flex-col items-center" style={{ userSelect: 'none' }}>
      {/* HUD */}
      <div className="flex justify-between items-center w-full max-w-[600px] mb-2 px-2">
        <div className="font-mono text-sm" style={{ color: '#00ff88' }}>
          CATCH: {theme.goodEmoji} +2 | DODGE: {theme.badEmoji} -1
        </div>
        <div className="font-mono text-lg" style={{ color: theme.neonColor }}>
          ⏱ {timeLeft}s
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
        {/* Background label */}
        <div className="absolute top-4 left-0 right-0 text-center text-xs font-mono opacity-30" style={{ color: theme.neonColor }}>
          {theme.goodLabel} VS {theme.badLabel}
        </div>

        {/* Falling objects */}
        {objects.map(obj => (
          <div
            key={obj.id}
            className="absolute pointer-events-none"
            style={{ left: obj.x, top: obj.y, width: OBJ_SIZE, height: OBJ_SIZE, fontSize: '24px', lineHeight: `${OBJ_SIZE}px`, textAlign: 'center' }}
          >
            {obj.emoji}
          </div>
        ))}

        {/* Catch effect */}
        {catchEffect && (
          <div
            className="absolute pointer-events-none font-black text-lg animate-ping"
            style={{
              left: catchEffect.x,
              top: catchEffect.y,
              color: catchEffect.good ? '#00ff88' : '#ff4444',
            }}
          >
            {catchEffect.good ? '+2' : '-1'}
          </div>
        )}

        {/* Player paddle */}
        <div
          className="absolute rounded-lg flex items-center justify-center text-2xl"
          style={{
            left: playerX,
            top: playerBottom,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            background: `linear-gradient(90deg, ${theme.neonColor}88, ${theme.accentColor}88)`,
            border: `2px solid ${theme.neonColor}`,
            boxShadow: `0 0 15px ${theme.neonColor}66`,
          }}
        >
          {theme.playerEmoji}
        </div>

        {/* Game over overlay */}
        {!running && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-4xl font-black" style={{ color: theme.neonColor }}>⏰ TIME'S UP!</p>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-xs font-mono mt-2">A/D or Left/Right Arrow to move</p>
    </div>
  );
};
