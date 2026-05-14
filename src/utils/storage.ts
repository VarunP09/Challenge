import type { DreamEntry, HighScore } from '../types';

const HIGH_SCORES_KEY = 'dreamArcade_highScores';
const DREAM_HISTORY_KEY = 'dreamArcade_history';

export function getHighScores(): HighScore[] {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHighScore(entry: HighScore): void {
  const scores = getHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top20 = scores.slice(0, 20);
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(top20));
}

export function getDreamHistory(): DreamEntry[] {
  try {
    const data = localStorage.getItem(DREAM_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDreamEntry(entry: DreamEntry): void {
  const history = getDreamHistory();
  history.unshift(entry);
  const top50 = history.slice(0, 50);
  localStorage.setItem(DREAM_HISTORY_KEY, JSON.stringify(top50));
}

export function clearHistory(): void {
  localStorage.removeItem(DREAM_HISTORY_KEY);
  localStorage.removeItem(HIGH_SCORES_KEY);
}
