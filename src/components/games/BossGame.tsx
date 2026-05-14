import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameTheme } from '../../types';
import { useGameLoop } from '../../hooks/useGameLoop';

interface BossAttackObj {
  id: number;
  x: number;
  y: number;
  speed: number;
  dx: number;
  emoji: string;
}

interface Props {
  theme: GameTheme;
  onGameOver: (score: number, won: boolean) => void;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 44;
const BOSS_MAX_HP = 20;
const PLAYER_MAX_HP = 5;
const ATTACK_COOLDOWN = 500;
const PLAYER_SPEED = 5;
const PROJ_SIZE = 28;

export const BossGame: React.FC<Props> = ({ theme, onGameOver }) => {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
  const [playerY, setPlayerY] = useState(GAME_HEIGHT - PLAYER_SIZE - 20);
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [attacks, setAttacks] = useState<BossAttackObj[]>([]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [attackEffect, setAttackEffect] = useState(false);
  const [bossAttackMsg, setBossAttackMsg] = useState('');
  const [phase, setPhase] = useState<'fighting' | 'won' | 'lost'>('fighting');
  const [invincible, setInvincible] = useState(false);

  const playerRef = useRef({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - PLAYER_SIZE - 20 });
  const keysRef = useRef<Set<string>>(new Set());
  const attackIdRef = useRef(0);
  const bossAttackTimerRef = useRef(0);
  const attackCooldownRef = useRef(0);
  const bossHpRef = useRef(BOSS_MAX_HP);
  const playerHpRef = useRef(PLAYER_MAX_HP);
  const invincibleRef = useRef(false);
  const runningRef = useRef(true);
  const scoreRef = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keysRef.current.add(e.key); };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const handleAttack = useCallback(() => {
    if (attackCooldownRef.current > 0 || !runningRef.current) return;
    attackCooldownRef.current = ATTACK_COOLDOWN;
    setAttackEffect(true);
    setTimeout(() => setAttackEffect(false), 300);

    bossHpRef.current = Math.max(0, bossHpRef.current - 1);
    setBossHp(bossHpRef.current);
    scoreRef.current += 5;
    setScore(scoreRef.current);

    if (bossHpRef.current <= 0) {
      runningRef.current = false;
      setRunning(false);
      setPhase('won');
    }
  }, []);

  // Click or space to attack
  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); handleAttack(); } };
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [handleAttack]);

  const gameUpdate = useCallback((delta: number) => {
    if (!runningRef.current) return;

    attackCooldownRef.current = Math.max(0, attackCooldownRef.current - delta);

    const keys = keysRef.current;
    const speed = PLAYER_SPEED * (delta / 16);

    // Move player
    let { x, y } = playerRef.current;
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) x = Math.max(0, x - speed);
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) x = Math.min(GAME_WIDTH - PLAYER_SIZE, x + speed);
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) y = Math.max(GAME_HEIGHT / 2, y - speed);
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) y = Math.min(GAME_HEIGHT - PLAYER_SIZE, y + speed);
    playerRef.current = { x, y };
    setPlayerX(x);
    setPlayerY(y);

    // Boss attacks
    bossAttackTimerRef.current += delta;
    const bossInterval = Math.max(1500, 3000 - (BOSS_MAX_HP - bossHpRef.current) * 100);
    if (bossAttackTimerRef.current > bossInterval) {
      bossAttackTimerRef.current = 0;
      const attackMsg = theme.bossAttacks[Math.floor(Math.random() * theme.bossAttacks.length)];
      setBossAttackMsg(attackMsg);
      setTimeout(() => setBossAttackMsg(''), 1500);

      // Spawn attack projectile
      const centerX = GAME_WIDTH / 2;
      const targetX = playerRef.current.x;
      const targetY = playerRef.current.y;
      const angle = Math.atan2(targetY - 80, targetX - centerX);
      setAttacks(prev => [
        ...prev.slice(-10),
        {
          id: attackIdRef.current++,
          x: centerX,
          y: 80,
          speed: 3 + Math.random() * 2,
          dx: Math.cos(angle),
          emoji: theme.enemyEmoji,
        },
      ]);
    }

    // Move attack projectiles
    setAttacks(prev => {
      const next: BossAttackObj[] = [];
      let hit = false;
      for (const atk of prev) {
        const newX = atk.x + atk.dx * atk.speed * (delta / 16);
        const newY = atk.y + Math.sqrt(1 - atk.dx * atk.dx) * atk.speed * (delta / 16);
        if (newY > GAME_HEIGHT || newX < 0 || newX > GAME_WIDTH) continue;
        if (!invincibleRef.current) {
          const collide =
            newX + PROJ_SIZE > playerRef.current.x + 8 &&
            newX < playerRef.current.x + PLAYER_SIZE - 8 &&
            newY + PROJ_SIZE > playerRef.current.y + 8 &&
            newY < playerRef.current.y + PLAYER_SIZE - 8;
          if (collide) {
            hit = true;
            continue;
          }
        }
        next.push({ ...atk, x: newX, y: newY });
      }
      if (hit) {
        playerHpRef.current -= 1;
        setPlayerHp(playerHpRef.current);
        invincibleRef.current = true;
        setInvincible(true);
        setTimeout(() => { invincibleRef.current = false; setInvincible(false); }, 1500);
        if (playerHpRef.current <= 0) {
          runningRef.current = false;
          setRunning(false);
          setPhase('lost');
        }
      }
      return next;
    });
  }, [theme.bossAttacks, theme.enemyEmoji]);

  useGameLoop(gameUpdate, running);

  useEffect(() => {
    if (phase === 'won' || phase === 'lost') {
      setTimeout(() => onGameOver(scoreRef.current, phase === 'won'), 800);
    }
  }, [phase, onGameOver]);

  const bossHpPct = (bossHp / BOSS_MAX_HP) * 100;

  return (
    <div className="flex flex-col items-center" style={{ userSelect: 'none' }}>
      {/* Boss HP bar */}
      <div className="w-full max-w-[600px] mb-2 px-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-sm" style={{ color: '#ff4444' }}>
            {theme.bossEmoji} {theme.bossName}
          </span>
          <span className="font-mono text-xs text-gray-400">{bossHp}/{BOSS_MAX_HP} HP</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${bossHpPct}%`,
              background: bossHpPct > 50 ? '#ff4444' : bossHpPct > 25 ? '#ff8800' : '#ffff00',
              boxShadow: '0 0 10px rgba(255,68,68,0.5)',
            }}
          />
        </div>
      </div>

      {/* Player HP */}
      <div className="flex justify-between items-center w-full max-w-[600px] mb-2 px-2">
        <div className="flex gap-1">
          {Array.from({ length: PLAYER_MAX_HP }).map((_, i) => (
            <span key={i} className="text-xl" style={{ opacity: i < playerHp ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div className="font-mono text-sm" style={{ color: theme.neonColor }}>
          SCORE: <span className="font-black">{score}</span>
        </div>
        <div className="font-mono text-xs text-gray-400">
          CLICK / SPACE to attack
        </div>
      </div>

      {/* Game area */}
      <div
        className="relative overflow-hidden rounded-xl cursor-pointer"
        style={{
          width: GAME_WIDTH,
          maxWidth: '100%',
          height: GAME_HEIGHT,
          background: `radial-gradient(ellipse at center, ${theme.backgroundColor}ee 0%, #000 100%)`,
          border: `2px solid ${theme.neonColor}`,
          boxShadow: `0 0 30px ${theme.neonColor}44`,
        }}
        onClick={handleAttack}
      >
        {/* Boss */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: GAME_WIDTH / 2 - 50,
            top: 20,
            width: 100,
            transition: 'filter 0.1s',
            filter: attackEffect ? 'brightness(3) hue-rotate(180deg)' : 'none',
          }}
        >
          <div style={{ fontSize: '64px' }}>{theme.bossEmoji}</div>
          {bossAttackMsg && (
            <div
              className="text-xs font-bold px-2 py-1 rounded-full text-center whitespace-nowrap"
              style={{ background: '#ff000044', border: '1px solid #ff4444', color: '#ff8888' }}
            >
              {bossAttackMsg}
            </div>
          )}
        </div>

        {/* Attack projectiles */}
        {attacks.map(atk => (
          <div
            key={atk.id}
            className="absolute pointer-events-none"
            style={{ left: atk.x, top: atk.y, width: PROJ_SIZE, height: PROJ_SIZE, fontSize: '20px', lineHeight: `${PROJ_SIZE}px`, textAlign: 'center' }}
          >
            {atk.emoji}
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute flex items-center justify-center text-4xl transition-opacity"
          style={{
            left: playerX,
            top: playerY,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            opacity: invincible ? 0.5 : 1,
            fontSize: '32px',
          }}
        >
          {theme.playerEmoji}
        </div>

        {/* Phase overlay */}
        {phase !== 'fighting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-4xl font-black" style={{ color: phase === 'won' ? '#00ff88' : '#ff4444' }}>
              {phase === 'won' ? '🏆 BOSS DEFEATED!' : '💀 DEFEATED'}
            </p>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-xs font-mono mt-2">WASD/Arrows to move | CLICK or SPACE to attack</p>
    </div>
  );
};
