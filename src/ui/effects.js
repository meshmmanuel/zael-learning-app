import { BASE_CONFIG } from '../config/index.js';

export function launchConfetti(count = 30) {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BD6', '#FFA06B'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = `${Math.random() * 100}vw`;
      c.style.top = '-20px';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
      c.style.animationDelay = `${Math.random() * 0.5}s`;
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), BASE_CONFIG.confettiLifetimeMs);
    }, i * BASE_CONFIG.confettiStaggerMs);
  }
}

