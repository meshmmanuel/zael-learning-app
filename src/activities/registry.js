/**
 * Activity registry — add new homework modes here.
 *
 * Each activity can define:
 * - id, label (for docs)
 * - setupRoute, playRoute (screen names passed to showScreen)
 * - onLeave (optional cleanup when leaving play)
 */
export const ACTIVITIES = {
  math: {
    id: 'math',
    label: 'Numbers',
    setupRoute: 'mathSetup',
    playRoute: 'play',
  },
  spellingPicture: {
    id: 'spellingPicture',
    label: 'Picture words',
    setupRoute: 'spellingSetup',
    playRoute: 'spellingPlay',
  },
  spellingPhonics: {
    id: 'spellingPhonics',
    label: 'Letter sounds',
    setupRoute: 'spellingSetup',
    playRoute: 'phonicsPlay',
    onLeave(state) {
      state.phonicsPlayGen += 1;
      state.phonicsAlphabetPlaying = false;
    },
  },
  spellingArrow: {
    id: 'spellingArrow',
    label: 'Arrow words',
    setupRoute: 'spellingSetup',
    playRoute: 'arrowPlay',
  },
};

/** Routes that need a “stop round?” confirm before going home. */
export const PLAY_ROUTES = new Set(['play', 'phonicsPlay', 'spellingPlay', 'arrowPlay']);
