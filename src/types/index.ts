export type GameMode = 'dodge' | 'catch' | 'boss';

export interface GameTheme {
  title: string;
  flavorText: string;
  playerEmoji: string;
  enemyEmoji: string;
  goodEmoji: string;
  badEmoji: string;
  bossName: string;
  bossEmoji: string;
  bossAttacks: string[];
  backgroundColor: string;
  accentColor: string;
  neonColor: string;
  winMessage: string;
  loseMessage: string;
  goodLabel: string;
  badLabel: string;
}

export interface HighScore {
  prompt: string;
  mode: GameMode;
  score: number;
  date: string;
  gameTitle: string;
}

export interface DreamEntry {
  prompt: string;
  gameTitle: string;
  mode: GameMode;
  score: number;
  date: string;
}
