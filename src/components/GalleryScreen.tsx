import React from 'react';
import type { DreamEntry, HighScore } from '../types';
import { getDreamHistory, getHighScores, clearHistory } from '../utils/storage';

interface Props {
  onBack: () => void;
  onReplay: (prompt: string) => void;
}

const MODE_LABELS = { dodge: '🚨 Dodge', catch: '🎯 Catch', boss: '💀 Boss' };

export const GalleryScreen: React.FC<Props> = ({ onBack, onReplay }) => {
  const [history, setHistory] = React.useState<DreamEntry[]>(() => getDreamHistory());
  const [highScores, setHighScores] = React.useState<HighScore[]>(() => getHighScores());
  const [tab, setTab] = React.useState<'history' | 'scores'>('history');

  const handleClear = () => {
    if (confirm('Clear all dream history and high scores?')) {
      clearHistory();
      setHistory([]);
      setHighScores([]);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a1a 100%)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg font-mono text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
          >
            ← Back
          </button>
          <h2
            className="text-3xl font-black tracking-wider"
            style={{ background: 'linear-gradient(90deg, #ff00cc, #00ccff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            📜 DREAM GALLERY
          </h2>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg font-mono text-xs"
            style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: 'rgba(255,100,100,0.8)' }}
          >
            🗑 Clear
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['history', 'scores'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg font-mono text-sm uppercase tracking-widest transition-all"
              style={{
                background: tab === t ? 'rgba(255,0,204,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${tab === t ? '#ff00cc' : 'rgba(255,255,255,0.1)'}`,
                color: tab === t ? '#ff00cc' : 'rgba(255,255,255,0.4)',
              }}
            >
              {t === 'history' ? '💭 Dream History' : '🏆 High Scores'}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'history' ? (
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono">
                <p className="text-4xl mb-4">💤</p>
                <p>No dreams yet. Go generate your first game!</p>
              </div>
            ) : (
              history.map((entry, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,0,204,0.1)', color: '#ff88cc', border: '1px solid rgba(255,0,204,0.2)' }}
                    >
                      {MODE_LABELS[entry.mode]}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 italic mb-1">"{entry.prompt}"</p>
                  <p className="text-xs text-gray-500 font-mono mb-2">{entry.gameTitle}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black" style={{ color: '#00ccff' }}>
                      Score: {entry.score}
                    </span>
                    <button
                      onClick={() => onReplay(entry.prompt)}
                      className="px-3 py-1 rounded-lg text-xs font-mono"
                      style={{
                        background: 'rgba(0,204,255,0.1)',
                        border: '1px solid rgba(0,204,255,0.3)',
                        color: '#00ccff',
                      }}
                    >
                      🔄 Replay
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {highScores.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono">
                <p className="text-4xl mb-4">🏆</p>
                <p>No high scores yet. Start playing!</p>
              </div>
            ) : (
              highScores.slice(0, 10).map((entry, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{
                    background: i === 0 ? 'rgba(255,200,0,0.05)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${i === 0 ? 'rgba(255,200,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <div
                    className="text-2xl font-black w-10 text-center flex-shrink-0"
                    style={{ color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#666' }}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 italic truncate">"{entry.prompt}"</p>
                    <p className="text-xs text-gray-500 font-mono">{MODE_LABELS[entry.mode]} · {new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-xl font-black flex-shrink-0" style={{ color: '#ffcc00' }}>
                    {entry.score}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
