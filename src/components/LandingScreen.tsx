import React, { useState } from 'react';

const STARTER_PROMPTS = [
  "I'm being chased by homework in space",
  "a duck is running a pizza shop during a thunderstorm",
  "giant cats are playing chess on the moon",
  "I forgot my password to reality",
  "a robot orchestra plays backwards music underwater",
  "my teeth are made of candy and monsters want them",
  "I'm late for a test I never studied for in a school made of clouds",
  "a friendly dragon delivers mail in a burning city",
];

interface Props {
  onGenerate: (prompt: string) => void;
  onGallery: () => void;
}

export const LandingScreen: React.FC<Props> = ({ onGenerate, onGallery }) => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    const trimmed = prompt.trim();
    if (trimmed.length < 3) return;
    onGenerate(trimmed);
  };

  const handleStarter = (p: string) => {
    setPrompt(p);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a1a 100%)' }}>
      {/* Animated title */}
      <div className="text-center mb-8">
        <h1
          className="text-6xl md:text-8xl font-black tracking-wider mb-2"
          style={{
            background: 'linear-gradient(90deg, #ff00cc, #00ccff, #ffcc00, #ff00cc)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 3s linear infinite',
            textShadow: 'none',
          }}
        >
          DREAM
        </h1>
        <h1
          className="text-6xl md:text-8xl font-black tracking-wider"
          style={{
            background: 'linear-gradient(90deg, #00ccff, #ffcc00, #ff00cc, #00ccff)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 3s linear infinite reverse',
            textShadow: 'none',
          }}
        >
          ARCADE
        </h1>
        <p className="text-cyan-400 text-lg mt-4 font-mono tracking-widest opacity-80">
          ✦ BROWSER MINI GAME HUB ✦
        </p>
      </div>

      {/* Main card */}
      <div
        className="w-full max-w-2xl rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid #ff00cc',
          boxShadow: '0 0 30px rgba(255,0,204,0.3), 0 0 60px rgba(0,204,255,0.1)',
        }}
      >
        <p className="text-white text-center text-lg mb-6 font-mono">
          Type a <span className="text-yellow-300 font-bold">dream prompt</span> and the arcade will generate a{' '}
          <span className="text-cyan-300 font-bold">playable microgame</span> just for you!
        </p>

        <textarea
          className="w-full rounded-xl p-4 text-white text-lg resize-none outline-none focus:ring-2 font-mono"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,0,204,0.5)',
            boxShadow: '0 0 10px rgba(255,0,204,0.2)',
            minHeight: '80px',
          }}
          placeholder="Describe your dream... (e.g. 'I'm being chased by homework in space')"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
          maxLength={200}
        />
        <div className="text-right text-xs text-gray-500 font-mono mt-1">{prompt.length}/200</div>

        <button
          onClick={handleGenerate}
          disabled={prompt.trim().length < 3}
          className="w-full mt-4 py-4 rounded-xl text-2xl font-black tracking-widest uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: prompt.trim().length >= 3 ? 'linear-gradient(90deg, #ff00cc, #7700ff)' : '#333',
            boxShadow: prompt.trim().length >= 3 ? '0 0 20px rgba(255,0,204,0.5)' : 'none',
            color: 'white',
          }}
          onMouseEnter={e => { if (prompt.trim().length >= 3) (e.target as HTMLElement).style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
        >
          🎮 Generate Game
        </button>

        {/* Starter prompts */}
        <div className="mt-6">
          <p className="text-gray-400 text-sm font-mono mb-3 text-center">✨ Or try a starter dream:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {STARTER_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleStarter(p)}
                className="text-xs px-3 py-1 rounded-full font-mono transition-all duration-150"
                style={{
                  background: 'rgba(0,204,255,0.1)',
                  border: '1px solid rgba(0,204,255,0.4)',
                  color: '#00ccff',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(0,204,255,0.2)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(0,204,255,0.1)'; }}
              >
                {p.slice(0, 40)}{p.length > 40 ? '...' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery button */}
      <button
        onClick={onGallery}
        className="mt-8 px-8 py-3 rounded-xl font-mono text-sm tracking-widest uppercase"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)',
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#ffcc00'; (e.target as HTMLElement).style.color = '#ffcc00'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
      >
        📜 Dream Gallery
      </button>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};
