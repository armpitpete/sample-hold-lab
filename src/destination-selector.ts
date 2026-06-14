import './destination-selector.css';
import './filter-cutoff-visual.css';
import './level-visual.css';

type VisualDestination = 'scope' | 'filter-cutoff' | 'pitch' | 'level';

type DestinationCopy = {
  title: string;
  description: string;
  status: string;
  cable: string;
};

const destinationCopy: Record<VisualDestination, DestinationCopy> = {
  scope: {
    title: 'Scope',
    description: 'Shows normal output and Super S&H companion outputs.',
    status: 'Scope selected · visual only',
    cable: 'Related CV',
  },
  'filter-cutoff': {
    title: 'Filter cutoff',
    description: 'Shows how the held CV would open or close a filter cutoff visually. No filter audio or VCF is running.',
    status: 'Filter cutoff visual only',
    cable: 'CV to filter',
  },
  pitch: {
    title: 'Pitch',
    description: 'Audio-connected destination. The one quiet oscillator follows the held/slewed main CV when Start Audio is running.',
    status: 'Pitch audio-connected · main CV controls oscillator pitch',
    cable: 'CV to pitch',
  },
  level: {
    title: 'Level',
    description: 'Shows how the held CV would change level visually. No level audio or VCA is running.',
    status: 'Level visual only',
    cable: 'CV to level',
  },
};

const eyebrow = document.querySelector<HTMLElement>('.eyebrow');
const destinationModule = document.querySelector<HTMLElement>('.destination-module');
const outputCableLabel = document.querySelector<HTMLElement>('.output-cable span');
const slewedValue = document.querySelector<HTMLOutputElement>('#slewedValue');

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v7.0';
}

if (!destinationModule) {
  throw new Error('Destination module not found');
}

const destinationTitle = destinationModule.querySelector<HTMLHeadingElement>('h2');
const destinationDescription = destinationModule.querySelector<HTMLParagraphElement>('p');
const triggerState = destinationModule.querySelector<HTMLOutputElement>('#triggerState');

if (!destinationTitle || !destinationDescription || !triggerState) {
  throw new Error('Destination module elements not found');
}

const selectorLabel = document.createElement('label');
selectorLabel.className = 'destination-select-control';
selectorLabel.htmlFor = 'destinationSelect';
selectorLabel.innerHTML = `
  <span>Destination</span>
  <select id="destinationSelect">
    <option value="scope" selected>Scope</option>
    <option value="filter-cutoff">Filter cutoff visual only</option>
    <option value="pitch">Pitch audio-connected</option>
    <option value="level">Level visual only</option>
  </select>
`;

const destinationStatus = document.createElement('output');
destinationStatus.id = 'destinationStatus';
destinationStatus.className = 'destination-status';
destinationStatus.value = destinationCopy.scope.status;
destinationStatus.textContent = destinationCopy.scope.status;

const pitchVisual = document.createElement('div');
pitchVisual.id = 'pitchVisualDestination';
pitchVisual.className = 'pitch-visual-destination';
pitchVisual.hidden = true;
pitchVisual.innerHTML = `
  <div class="pitch-connected-badge">Audio-connected destination</div>
  <div class="pitch-visual-labels" aria-hidden="true">
    <span>Low</span>
    <span>High</span>
  </div>
  <div class="pitch-track" aria-label="Pitch visual response">
    <div class="pitch-marker" id="pitchMarker"></div>
  </div>
  <output id="pitchVisualValue">Pitch CV 0.00 V</output>
`;

const filterVisual = document.createElement('div');
filterVisual.id = 'filterVisualDestination';
filterVisual.className = 'filter-visual-destination';
filterVisual.hidden = true;
filterVisual.innerHTML = `
  <div class="filter-visual-labels" aria-hidden="true">
    <span>Closed</span>
    <span>Open</span>
  </div>
  <div class="filter-window" aria-label="Filter cutoff visual response">
    <div class="filter-band" id="filterBand"></div>
  </div>
  <output id="filterVisualValue">Cutoff CV 0.00 V</output>
`;

const levelVisual = document.createElement('div');
levelVisual.id = 'levelVisualDestination';
levelVisual.className = 'level-visual-destination';
levelVisual.hidden = true;
levelVisual.innerHTML = `
  <div class="level-visual-labels" aria-hidden="true">
    <span>Quiet</span>
    <span>Loud</span>
  </div>
  <div class="level-meter" aria-label="Level visual response">
    <div class="level-fill" id="levelFill"></div>
  </div>
  <output id="levelVisualValue">Level CV 0.00 V</output>
`;

destinationModule.insertBefore(selectorLabel, triggerState);
destinationModule.insertBefore(destinationStatus, triggerState);
destinationModule.insertBefore(pitchVisual, triggerState);
destinationModule.insertBefore(filterVisual, triggerState);
destinationModule.insertBefore(levelVisual, triggerState);

const destinationSelect = selectorLabel.querySelector<HTMLSelectElement>('#destinationSelect');
const pitchMarker = pitchVisual.querySelector<HTMLElement>('#pitchMarker');
const pitchVisualValue = pitchVisual.querySelector<HTMLOutputElement>('#pitchVisualValue');
const filterBand = filterVisual.querySelector<HTMLElement>('#filterBand');
const filterVisualValue = filterVisual.querySelector<HTMLOutputElement>('#filterVisualValue');
const levelFill = levelVisual.querySelector<HTMLElement>('#levelFill');
const levelVisualValue = levelVisual.querySelector<HTMLOutputElement>('#levelVisualValue');

if (!destinationSelect || !pitchMarker || !pitchVisualValue || !filterBand || !filterVisualValue || !levelFill || !levelVisualValue) {
  throw new Error('Destination selector elements not found');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function currentHeldVoltage(): number {
  const text = slewedValue?.value || slewedValue?.textContent || '0';
  const match = text.match(/-?\d+(\.\d+)?/);
  const voltage = match ? Number(match[0]) : 0;
  return clamp(Number.isFinite(voltage) ? voltage : 0, -5, 5);
}

function updateVisualDestinations(): void {
  const voltage = currentHeldVoltage();
  const normalized = (voltage + 5) / 10;
  const cutoffPercent = 12 + normalized * 88;
  const levelPercent = normalized * 100;

  pitchMarker.style.left = `${normalized * 100}%`;
  pitchVisualValue.value = `Pitch audio CV ${voltage.toFixed(2)} V`;
  pitchVisualValue.textContent = `Pitch audio CV ${voltage.toFixed(2)} V`;

  filterBand.style.width = `${cutoffPercent}%`;
  filterVisualValue.value = `Cutoff CV ${voltage.toFixed(2)} V`;
  filterVisualValue.textContent = `Cutoff CV ${voltage.toFixed(2)} V`;

  levelFill.style.width = `${levelPercent}%`;
  levelVisualValue.value = `Level CV ${voltage.toFixed(2)} V`;
  levelVisualValue.textContent = `Level CV ${voltage.toFixed(2)} V`;

  requestAnimationFrame(updateVisualDestinations);
}

function updateDestination(destination: VisualDestination): void {
  const copy = destinationCopy[destination];
  destinationTitle.textContent = copy.title;
  destinationDescription.textContent = copy.description;
  destinationStatus.value = copy.status;
  destinationStatus.textContent = copy.status;
  destinationStatus.classList.toggle('is-audio-connected', destination === 'pitch');
  pitchVisual.hidden = destination !== 'pitch';
  filterVisual.hidden = destination !== 'filter-cutoff';
  levelVisual.hidden = destination !== 'level';

  if (outputCableLabel) {
    outputCableLabel.textContent = copy.cable;
  }
}

destinationSelect.addEventListener('change', () => {
  updateDestination(destinationSelect.value as VisualDestination);
});

updateDestination('scope');
requestAnimationFrame(updateVisualDestinations);
