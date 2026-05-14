import React from 'react';
import type { GameTheme, GameMode } from '../types';

interface Props {
  theme: GameTheme;
  mode: GameMode;
  score: number;
  highScore: number;
  won: boolean;
  onPlayAgain: () => void;
  onNewDream: () => void;
  onGallery: () => void;
}

const MODE_LABELS: Record<GameMode, string> = {
  dodge: 'DODGE MODE',
  catch: 'CATCH MODE',
  boss: 'BOSS MODE',
};

export const GameOverScreen: React.FC<Props> = ({
  theme, mode, score, highScore, won, onPlayAgain, onNewDream, onGallery,
}) => {
  const isNewHigh = score >= highScore;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: theme.backgroundColor }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(0,0,0,0.8)',
          border: `2px solid ${won ? '#00ff88' : '#ff4444'}`,
          boxShadow: `0 0 40px ${won ? '#00ff8844' : '#ff444444'}`,
        }}
      >
        <div className="text-7xl mb-4">{won ? '🏆' : '💀'}</div>
        <h2
          className="text-4xl font-black mb-2"
          style={{ color: won ? '#00ff88' : '#ff4444', textShadow: `0 0 20px ${won ? '#00ff88' : '#ff4444'}` }}
        >
          {won ? 'YOU WIN!' : 'GAME OVER'}
        </h2>
        <p className="text-gray-300 text-sm mb-6 italic">
          {won ? theme.winMessage : theme.loseMessage}
        </p>

        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-gray-400 text-xs font-mono mb-1 uppercase tracking-widest">{MODE_LABELS[mode]}</p>
          <p className="text-gray-400 text-xs font-mono mb-3 truncate" title={theme.title}>{theme.title}</p>
          <div className="flex justify-around">
            <div>
              <p className="text-gray-500 text-xs font-mono">SCORE</p>
              <p className="text-4xl font-black" style={{ color: theme.neonColor }}>{score}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-mono">BEST</p>
              <p className="text-4xl font-black text-yellow-400">{Math.max(score, highScore)}</p>
            </div>
          </div>
          {isNewHigh && score > 0 && (
            <p className="text-yellow-300 text-sm font-bold mt-2 animate-pulse">⭐ NEW HIGH SCORE! ⭐</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="py-3 rounded-xl font-black text-lg tracking-wider uppercase"
            style={{
              background: `linear-gradient(90deg, ${theme.neonColor}, ${theme.accentColor})`,
              boxShadow: `0 0 15px ${theme.neonColor}66`,
              color: '#000',
            }}
          >
            🔄 Play Again
          </button>
          <button
            onClick={onNewDream}
            className="py-3 rounded-xl font-bold text-base tracking-wider uppercase"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${theme.neonColor}`,
              color: theme.neonColor,
            }}
          >
            💭 New Dream
          </button>
          <button
            onClick={onGallery}
            className="py-3 rounded-xl font-mono text-sm"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            📜 Dream Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
