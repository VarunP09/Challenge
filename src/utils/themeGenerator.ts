import type { GameTheme, GameMode } from '../types';

const PLAYER_EMOJIS = ['🧑‍🚀', '🦸', '🐱', '🧙', '🤖', '🦊', '🐸', '🦄'];
const BG_COLORS = ['#0a0a1a', '#0a1a0a', '#1a0a0a', '#0a0a2a', '#1a0a1a'];
const ACCENT_COLORS = ['#ff00ff', '#00ffff', '#ffff00', '#ff6600', '#00ff88'];
const NEON_COLORS = ['#ff00cc', '#00ccff', '#ccff00', '#ff4400', '#44ff88'];

const EMOJIS_BY_KEYWORD: Record<string, string[]> = {
  space: ['🚀', '👽', '⭐', '🌙', '☄️'],
  homework: ['📚', '✏️', '📝', '🎒', '📐'],
  duck: ['🦆', '🐤', '🦉', '🐦', '🦜'],
  pizza: ['🍕', '🧀', '🍅', '🫓', '🔥'],
  storm: ['⚡', '🌩️', '🌪️', '💨', '🌧️'],
  chase: ['💨', '👣', '🏃', '⚡', '😱'],
  flying: ['🦅', '✈️', '🌤️', '☁️', '🪂'],
  water: ['🌊', '🐟', '💧', '🐠', '🦈'],
  fire: ['🔥', '💥', '🌋', '🌡️', '♨️'],
  monster: ['👾', '👻', '🧟', '🦇', '🕷️'],
  robot: ['🤖', '⚙️', '🔧', '💻', '📡'],
  cat: ['🐱', '🐾', '🐈', '😺', '🐯'],
  dog: ['🐶', '🦴', '🐕', '🐾', '🦮'],
  food: ['🍔', '🌮', '🍣', '🍩', '🍦'],
  music: ['🎵', '🎸', '🥁', '🎺', '🎹'],
  school: ['📚', '🏫', '✏️', '📏', '🎒'],
  dream: ['💤', '🌙', '✨', '💫', '🌟'],
  magic: ['✨', '🔮', '🪄', '⚗️', '🌟'],
  ocean: ['🌊', '🦑', '🐙', '🦈', '🐬'],
  jungle: ['🌴', '🦁', '🐘', '🦍', '🌿'],
};

function getEmojisForPrompt(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const found: string[] = [];
  for (const [keyword, emojis] of Object.entries(EMOJIS_BY_KEYWORD)) {
    if (lower.includes(keyword)) {
      found.push(...emojis);
    }
  }
  return found.length > 0 ? found : ['👾', '💫', '⚡', '🌀', '✨'];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTitle(prompt: string): string {
  const words = prompt.split(' ').filter(w => w.length > 3);
  const keyWords = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const prefixes = ['Nightmare of', 'The Surreal', 'Dream Quest:', 'Arcade of', 'Chronicles of'];
  if (keyWords.length > 0) {
    return `${pickRandom(prefixes)} ${keyWords.join(' ')}`;
  }
  return 'The Surreal Dream Quest';
}

function generateBossName(prompt: string): string {
  const words = prompt.split(' ').filter(w => w.length > 2);
  const adjectives = ['Ultra', 'Mega', 'Cosmic', 'Nightmare', 'Supreme', 'Infinite'];
  const suffixes = ['Lord', 'Beast', 'Overlord', 'King', 'Destroyer', 'Entity'];
  const word = words.length > 0 ? pickRandom(words) : 'Dream';
  return `${pickRandom(adjectives)} ${word.charAt(0).toUpperCase() + word.slice(1)} ${pickRandom(suffixes)}`;
}

function generateFlavorText(prompt: string, mode: GameMode): string {
  const flavors: Record<GameMode, string[]> = {
    dodge: [
      `You fell asleep thinking about "${prompt}" and now you must DODGE for your life!`,
      `The dream realm has spawned chaos from your thoughts about "${prompt}". MOVE!`,
      `Somewhere in a surreal arcade dimension, "${prompt}" has become deadly. DODGE!`,
    ],
    catch: [
      `In this fever dream inspired by "${prompt}", catching the right stuff is EVERYTHING.`,
      `Your subconscious turned "${prompt}" into a catching frenzy. Good luck!`,
      `The dream gods have decided: based on "${prompt}", you shall CATCH or PERISH.`,
    ],
    boss: [
      `A terrifying entity born from "${prompt}" stands before you. FIGHT BACK!`,
      `Deep in the dream arcade, the boss summoned by "${prompt}" awaits your challenge!`,
      `You thought about "${prompt}" before sleep. Now face the consequence: THE BOSS.`,
    ],
  };
  return pickRandom(flavors[mode]);
}

export function generateTheme(prompt: string, mode: GameMode): GameTheme {
  const emojis = getEmojisForPrompt(prompt);
  const bgIndex = Math.floor(Math.random() * BG_COLORS.length);

  const goodLabels = ['✨ Dream Orb', '💎 Crystal', '⭐ Star', '💊 Power', '🍀 Luck'];
  const badLabels = ['💀 Nightmare', '👾 Glitch', '🔥 Hazard', '⚡ Zap', '🕷️ Creep'];

  return {
    title: generateTitle(prompt),
    flavorText: generateFlavorText(prompt, mode),
    playerEmoji: pickRandom(PLAYER_EMOJIS),
    enemyEmoji: pickRandom(emojis),
    goodEmoji: pickRandom(['⭐', '💎', '💊', '🍀', '✨', '💫', '🔮']),
    badEmoji: pickRandom(emojis),
    bossName: generateBossName(prompt),
    bossEmoji: pickRandom(emojis),
    bossAttacks: [
      `${pickRandom(emojis)} DREAM BLAST`,
      `${pickRandom(emojis)} NIGHTMARE WAVE`,
      `${pickRandom(emojis)} SURREAL STRIKE`,
      `${pickRandom(emojis)} CHAOS BEAM`,
    ],
    backgroundColor: BG_COLORS[bgIndex],
    accentColor: ACCENT_COLORS[bgIndex],
    neonColor: NEON_COLORS[bgIndex],
    winMessage: `You conquered the dream! The ${generateBossName(prompt)} has been defeated! 🎉`,
    loseMessage: `The dream realm swallowed you whole... Better luck next sleep! 😴`,
    goodLabel: pickRandom(goodLabels),
    badLabel: pickRandom(badLabels),
  };
}

export function selectGameMode(): GameMode {
  const modes: GameMode[] = ['dodge', 'catch', 'boss'];
  return pickRandom(modes);
}
