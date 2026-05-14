import { useState, useCallback } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { GameIntroScreen } from './components/GameIntroScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { DodgeGame } from './components/games/DodgeGame';
import { CatchGame } from './components/games/CatchGame';
import { BossGame } from './components/games/BossGame';
import { generateTheme, selectGameMode } from './utils/themeGenerator';
import { saveHighScore, getHighScores, saveDreamEntry } from './utils/storage';
import type { GameMode, GameTheme } from './types';

type Screen = 'landing' | 'intro' | 'playing' | 'gameover' | 'gallery';

interface GameState {
  prompt: string;
  mode: GameMode;
  theme: GameTheme;
  score: number;
  won: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleGenerate = useCallback((prompt: string) => {
    const mode = selectGameMode();
    const theme = generateTheme(prompt, mode);
    setGameState({ prompt, mode, theme, score: 0, won: false });
    setScreen('intro');
  }, []);

  const handleGameStart = useCallback(() => {
    setScreen('playing');
  }, []);

  const handleGameOver = useCallback((score: number, won = false) => {
    if (!gameState) return;
    const { prompt, mode, theme } = gameState;

    // Save to localStorage
    const entry = {
      prompt,
      mode,
      score,
      date: new Date().toISOString(),
      gameTitle: theme.title,
    };
    saveHighScore(entry);
    saveDreamEntry(entry);

    setGameState(prev => prev ? { ...prev, score, won } : null);
    setScreen('gameover');
  }, [gameState]);

  const handlePlayAgain = useCallback(() => {
    if (!gameState) return;
    // Re-generate with same prompt
    const mode = selectGameMode();
    const theme = generateTheme(gameState.prompt, mode);
    setGameState(prev => prev ? { ...prev, mode, theme, score: 0, won: false } : null);
    setScreen('intro');
  }, [gameState]);

  const handleNewDream = useCallback(() => {
    setGameState(null);
    setScreen('landing');
  }, []);

  const getHighScore = useCallback(() => {
    if (!gameState) return 0;
    const scores = getHighScores().filter(s => s.prompt === gameState.prompt);
    return scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
  }, [gameState]);

  if (screen === 'gallery') {
    return (
      <GalleryScreen
        onBack={() => setScreen(gameState ? 'gameover' : 'landing')}
        onReplay={prompt => { handleGenerate(prompt); }}
      />
    );
  }

  if (screen === 'landing') {
    return <LandingScreen onGenerate={handleGenerate} onGallery={() => setScreen('gallery')} />;
  }

  if (!gameState) return null;

  if (screen === 'intro') {
    return (
      <GameIntroScreen
        theme={gameState.theme}
        mode={gameState.mode}
        onStart={handleGameStart}
        onBack={handleNewDream}
      />
    );
  }

  if (screen === 'gameover') {
    return (
      <GameOverScreen
        theme={gameState.theme}
        mode={gameState.mode}
        score={gameState.score}
        highScore={getHighScore()}
        won={gameState.won}
        onPlayAgain={handlePlayAgain}
        onNewDream={handleNewDream}
        onGallery={() => setScreen('gallery')}
      />
    );
  }

  // Playing screen - wrap game in a styled container
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: gameState.theme.backgroundColor }}
    >
      {/* Game header */}
      <div className="w-full max-w-[620px] mb-4 flex justify-between items-center">
        <div>
          <h3
            className="text-lg font-black tracking-wide"
            style={{ color: gameState.theme.neonColor, textShadow: `0 0 10px ${gameState.theme.neonColor}` }}
          >
            {gameState.theme.title}
          </h3>
          <p className="text-xs text-gray-500 font-mono truncate max-w-xs">
            "{gameState.prompt}"
          </p>
        </div>
        <button
          onClick={handleNewDream}
          className="px-3 py-1 rounded-lg font-mono text-xs"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          ✕ Quit
        </button>
      </div>

      {/* Game component */}
      {gameState.mode === 'dodge' && (
        <DodgeGame
          theme={gameState.theme}
          onGameOver={handleGameOver}
        />
      )}
      {gameState.mode === 'catch' && (
        <CatchGame
          theme={gameState.theme}
          onGameOver={handleGameOver}
        />
      )}
      {gameState.mode === 'boss' && (
        <BossGame
          theme={gameState.theme}
          onGameOver={(score, won) => handleGameOver(score, won)}
        />
      )}
    </div>
  );
}
