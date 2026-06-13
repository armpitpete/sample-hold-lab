import './destination-selector.css';

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
    status: 'Scope selected',
    cable: 'Related CV',
  },
  'filter-cutoff': {
    title: 'Filter cutoff',
    description: 'Visual placeholder only. The held CV is not controlling a real filter yet.',
    status: 'Filter placeholder',
    cable: 'CV to filter',
  },
  pitch: {
    title: 'Pitch',
    description: 'Visual placeholder only. The held CV is not controlling a real pitch input yet.',
    status: 'Pitch placeholder',
    cable: 'CV to pitch',
  },
  level: {
    title: 'Level',
    description: 'Visual placeholder only. The held CV is not controlling a real level input yet.',
    status: 'Level placeholder',
    cable: 'CV to level',
  },
};

const eyebrow = document.querySelector<HTMLElement>('.eyebrow');
const destinationModule = document.querySelector<HTMLElement>('.destination-module');
const outputCableLabel = document.querySelector<HTMLElement>('.output-cable span');

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v1.3';
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
    <option value="filter-cutoff">Filter cutoff placeholder</option>
    <option value="pitch">Pitch placeholder</option>
    <option value="level">Level placeholder</option>
  </select>
`;

const destinationStatus = document.createElement('output');
destinationStatus.id = 'destinationStatus';
destinationStatus.className = 'destination-status';
destinationStatus.value = destinationCopy.scope.status;
destinationStatus.textContent = destinationCopy.scope.status;

destinationModule.insertBefore(selectorLabel, triggerState);
destinationModule.insertBefore(destinationStatus, triggerState);

const destinationSelect = selectorLabel.querySelector<HTMLSelectElement>('#destinationSelect');

if (!destinationSelect) {
  throw new Error('Destination selector not found');
}

function updateDestination(destination: VisualDestination): void {
  const copy = destinationCopy[destination];
  destinationTitle.textContent = copy.title;
  destinationDescription.textContent = copy.description;
  destinationStatus.value = copy.status;
  destinationStatus.textContent = copy.status;

  if (outputCableLabel) {
    outputCableLabel.textContent = copy.cable;
  }
}

destinationSelect.addEventListener('change', () => {
  updateDestination(destinationSelect.value as VisualDestination);
});

updateDestination('scope');
