import { state } from '../state.js';

export function arrowRoundWordGoal() {
  return state.arrowPuzzles.reduce((n, p) => n + p.words.length, 0);
}

export function currentArrowPuzzle() {
  return state.arrowPuzzles[state.arrowPuzzleIndex];
}
