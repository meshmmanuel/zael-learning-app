import { state } from './state.js';
import { els } from './dom.js';
import { pickRandomBg } from './ui/chrome.js';
import { ACTIVITIES, PLAY_ROUTES } from './activities/registry.js';

export const NAV_TITLE = {
  home: 'Kids Learning Playground',
  mathSetup: 'Numbers — Set up',
  spellingSetup: 'Spelling — Set up',
  play: 'Numbers — Practice',
  phonicsPlay: 'Letter sounds',
  spellingPlay: 'Spelling — Practice',
  arrowPlay: 'Arrow words — Practice',
  end: 'Round finished!',
};

let currentRoute = 'home';

export function getCurrentRoute() {
  return currentRoute;
}

export function updateAppNav(screenName) {
  if (els.appNavTitle) {
    els.appNavTitle.textContent = NAV_TITLE[screenName] || NAV_TITLE.home;
  }
  if (els.appNavHome) {
    const onDashboard = screenName === 'home';
    els.appNavHome.disabled = onDashboard;
    els.appNavHome.setAttribute('aria-hidden', onDashboard ? 'true' : 'false');
  }
}

/** Themed confirm dialog; returns a Promise (true = confirmed). */
export function openAppModal(opts) {
  if (!els.appModal || !els.appModalTitle || !els.appModalMessage || !els.appModalCancel || !els.appModalConfirm) {
    return Promise.resolve(window.confirm(opts.message || opts.title));
  }

  return new Promise((resolve) => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;

    els.appModalTitle.textContent = opts.title;
    els.appModalMessage.textContent = opts.message;
    els.appModalConfirm.textContent = opts.confirmLabel || 'OK';
    els.appModalCancel.textContent = opts.cancelLabel || 'Cancel';

    const focusables = [els.appModalCancel, els.appModalConfirm];

    function cleanup() {
      els.appModalConfirm.onclick = null;
      els.appModalCancel.onclick = null;
      if (els.appModalBackdrop) els.appModalBackdrop.onclick = null;
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey, true);
      els.appModal.classList.remove('is-open');
      els.appModal.setAttribute('aria-hidden', 'true');
      if (prevFocus && typeof prevFocus.focus === 'function') {
        try {
          prevFocus.focus();
        } catch {
          // ignore
        }
      }
    }

    function finish(value) {
      cleanup();
      resolve(value);
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        finish(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const i = focusables.indexOf(document.activeElement);
      if (e.shiftKey) {
        if (i <= 0) {
          e.preventDefault();
          focusables[focusables.length - 1].focus();
        }
      } else if (i === focusables.length - 1 || i === -1) {
        e.preventDefault();
        focusables[0].focus();
      }
    }

    document.body.style.overflow = 'hidden';
    els.appModal.classList.add('is-open');
    els.appModal.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onKey, true);

    els.appModalConfirm.onclick = () => finish(true);
    els.appModalCancel.onclick = () => finish(false);
    if (els.appModalBackdrop) els.appModalBackdrop.onclick = () => finish(false);

    requestAnimationFrame(() => {
      els.appModalCancel.focus();
    });
  });
}

export function requestGoHome() {
  if (PLAY_ROUTES.has(currentRoute)) {
    openAppModal({
      title: 'Go home?',
      message: 'This round will stop. You can start a new one anytime!',
      confirmLabel: 'Go home 🏠',
      cancelLabel: 'Keep playing',
    }).then((ok) => {
      if (!ok) return;
      pickRandomBg();
      showScreen('home');
    });
    return;
  }
  pickRandomBg();
  showScreen('home');
}

export function showScreen(name) {
  if (currentRoute === ACTIVITIES.spellingPhonics.playRoute && name !== ACTIVITIES.spellingPhonics.playRoute) {
    ACTIVITIES.spellingPhonics.onLeave?.(state);
  }
  const screens = {
    home: els.homeScreen,
    mathSetup: els.mathSetupScreen,
    spellingSetup: els.spellingSetupScreen,
    spellingPlay: els.spellingPlayScreen,
    phonicsPlay: els.phonicsPlayScreen,
    arrowPlay: els.arrowPlayScreen,
    play: els.mainScreen,
    end: els.endScreen,
  };
  Object.values(screens).forEach((el) => {
    if (el) el.style.display = 'none';
  });
  if (name === 'home') {
    screens.home.style.display = 'flex';
  } else if (name === 'mathSetup') {
    screens.mathSetup.style.display = 'flex';
  } else if (name === 'spellingSetup') {
    screens.spellingSetup.style.display = 'flex';
  } else if (name === 'spellingPlay') {
    screens.spellingPlay.style.display = 'flex';
  } else if (name === 'phonicsPlay') {
    if (screens.phonicsPlay) screens.phonicsPlay.style.display = 'flex';
  } else if (name === 'arrowPlay') {
    if (screens.arrowPlay) screens.arrowPlay.style.display = 'flex';
  } else if (name === 'play') {
    screens.play.style.display = 'flex';
  } else if (name === 'end') {
    screens.end.style.display = 'flex';
  }
  currentRoute = name;
  updateAppNav(name);
}
