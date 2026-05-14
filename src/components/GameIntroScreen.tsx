import React, { useState, useEffect } from 'react';
import type { GameTheme, GameMode } from '../types';

interface Props {
  theme: GameTheme;
  mode: GameMode;
  onStart: () => void;
  onBack: () => void;
}

const MODE_LABELS: Record<GameMode, string> = {
  dodge: '🚨 DODGE MODE',
  catch: '🎯 CATCH MODE',
  boss: '💀 BOSS MODE',
};

const MODE_DESCRIPTIONS: Record<GameMode, string> = {
  dodge: 'Move with WASD or Arrow Keys. Survive as long as possible!',
  catch: 'Move LEFT/RIGHT to catch good objects. Avoid bad ones!',
  boss: 'CLICK or press SPACE to attack. Dodge the boss attacks!',
};

export const GameIntroScreen: React.FC<Props> = ({ theme, mode, onStart, onBack }) => {
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (!started) return;
    if (countdown <= 0) {
      onStart();
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [started, countdown, onStart]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: theme.backgroundColor }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `2px solid ${theme.neonColor}`,
          boxShadow: `0 0 40px ${theme.neonColor}44`,
        }}
      >
        <div className="text-6xl mb-4">{theme.bossEmoji || theme.enemyEmoji}</div>
        <h2
          className="text-3xl font-black tracking-wider mb-2"
          style={{ color: theme.neonColor, textShadow: `0 0 20px ${theme.neonColor}` }}
        >
          {theme.title}
        </h2>
        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-bold tracking-widest mb-6"
          style={{ background: theme.neonColor + '22', border: `1px solid ${theme.neonColor}`, color: theme.neonColor }}
        >
          {MODE_LABELS[mode]}
        </div>
        <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">
          "{theme.flavorText}"
        </p>
        <p
          className="font-mono text-sm mb-8 px-4 py-3 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', color: theme.accentColor }}
        >
          {MODE_DESCRIPTIONS[mode]}
        </p>

        {started ? (
          <div
            className="text-8xl font-black"
            style={{ color: theme.neonColor, textShadow: `0 0 40px ${theme.neonColor}` }}
          >
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl font-mono text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleStart}
              className="px-10 py-4 rounded-xl text-xl font-black tracking-widest uppercase"
              style={{
                background: `linear-gradient(90deg, ${theme.neonColor}, ${theme.accentColor})`,
                boxShadow: `0 0 20px ${theme.neonColor}88`,
                color: '#000',
              }}
            >
              🎮 PLAY NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
