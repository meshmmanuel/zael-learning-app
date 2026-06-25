export function decomposeNumber(n) {
  return {
    hundreds: Math.floor(n / 100),
    tens: Math.floor((n % 100) / 10),
    ones: n % 10,
  };
}

export function placeValueLabel(n) {
  const { hundreds, tens, ones } = decomposeNumber(n);
  const parts = [];
  if (hundreds) parts.push(`${hundreds} group${hundreds > 1 ? 's' : ''} of one hundred`);
  if (tens) parts.push(`${tens} bundle${tens > 1 ? 's' : ''} of ten`);
  if (ones) parts.push(`${ones} stick${ones > 1 ? 's' : ''}`);
  return parts.join(' plus ') || 'zero';
}

function createBundleEl() {
  const bundle = document.createElement('span');
  bundle.className = 'compare-bundle';
  bundle.setAttribute('aria-hidden', 'true');

  const sticks = document.createElement('span');
  sticks.className = 'compare-bundle-sticks';
  for (let i = 0; i < 10; i++) {
    const stick = document.createElement('span');
    stick.className = 'compare-bundle-stick';
    sticks.appendChild(stick);
  }

  const band = document.createElement('span');
  band.className = 'compare-bundle-band';
  sticks.appendChild(band);
  bundle.appendChild(sticks);
  return bundle;
}

function createStickEl() {
  const stick = document.createElement('span');
  stick.className = 'compare-stick';
  stick.setAttribute('aria-hidden', 'true');
  return stick;
}

function createHundredEl() {
  const block = document.createElement('span');
  block.className = 'compare-hundred';
  block.setAttribute('aria-hidden', 'true');
  block.textContent = '100';
  return block;
}

export function createPlaceValueVisual(n) {
  const { hundreds, tens, ones } = decomposeNumber(n);
  const visual = document.createElement('div');
  visual.className = 'compare-place-value';

  if (hundreds > 0) {
    const row = document.createElement('div');
    row.className = 'compare-place-row compare-place-row--hundreds';
    for (let i = 0; i < hundreds; i++) row.appendChild(createHundredEl());
    visual.appendChild(row);
  }

  if (tens > 0) {
    const row = document.createElement('div');
    row.className = 'compare-place-row compare-place-row--tens';
    for (let i = 0; i < tens; i++) row.appendChild(createBundleEl());
    visual.appendChild(row);
  }

  if (ones > 0) {
    const row = document.createElement('div');
    row.className = 'compare-place-row compare-place-row--ones';
    for (let i = 0; i < ones; i++) row.appendChild(createStickEl());
    visual.appendChild(row);
  }

  if (hundreds === 0 && tens === 0 && ones === 0) {
    const row = document.createElement('div');
    row.className = 'compare-place-row compare-place-row--empty';
    row.textContent = '0';
    visual.appendChild(row);
  }

  return visual;
}

export function createHintBundle() {
  return createBundleEl();
}

export function createHintStick() {
  return createStickEl();
}

export function createHintHundred() {
  return createHundredEl();
}
