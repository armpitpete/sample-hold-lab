import './patch-summary.css';

type InputSource = 'lfo' | 'noise-placeholder' | 'manual-cv-placeholder';
type HoldMode = 'sample-hold' | 'track-hold' | 'super-sample-hold';
type Destination = 'scope' | 'filter-cutoff' | 'pitch' | 'level';

const inputNames: Record<InputSource, string> = {
  lfo: 'LFO',
  'noise-placeholder': 'Noise',
  'manual-cv-placeholder': 'Manual CV',
};

const modeNames: Record<HoldMode, string> = {
  'sample-hold': 'S&H',
  'track-hold': 'T&H',
  'super-sample-hold': 'Super S&H',
};

const destinationNames: Record<Destination, string> = {
  scope: 'Scope',
  'filter-cutoff': 'Filter cutoff visual demo',
  pitch: 'Pitch visual demo',
  level: 'Level visual demo',
};

const eyebrow = document.querySelector<HTMLElement>('.eyebrow');
const ruleCard = document.querySelector<HTMLElement>('.rule-card');
const inputSourceSelect = document.querySelector<HTMLSelectElement>('#inputSourceSelect');
const clockRateInput = document.querySelector<HTMLInputElement>('#clockRate');
const slewAmountInput = document.querySelector<HTMLInputElement>('#slewAmount');
const jitterAmountInput = document.querySelector<HTMLInputElement>('#jitterAmount');
const manualCvInput = document.querySelector<HTMLInputElement>('#manualCvInput');

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v2.2';
}

if (!ruleCard || !inputSourceSelect || !clockRateInput || !slewAmountInput || !jitterAmountInput || !manualCvInput) {
  throw new Error('Patch summary source elements not found');
}

const summaryPanel = document.createElement('section');
summaryPanel.className = 'patch-summary-panel';
summaryPanel.setAttribute('aria-label', 'Patch summary');
summaryPanel.innerHTML = `
  <h2>Patch summary</h2>
  <p class="patch-summary-intro">This is the current visual patch. It is read-only.</p>
  <dl class="patch-summary-list">
    <div><dt>Input</dt><dd id="summaryInput">LFO</dd></div>
    <div><dt>Mode</dt><dd id="summaryMode">S&H</dd></div>
    <div><dt>Destination</dt><dd id="summaryDestination">Scope</dd></div>
    <div><dt>Clock / gate rate</dt><dd id="summaryClockRate">1.00 Hz</dd></div>
    <div><dt>Slew</dt><dd id="summarySlew">35%</dd></div>
    <div><dt>Jitter</dt><dd id="summaryJitter">10%</dd></div>
    <div id="summaryManualCvRow" hidden><dt>Manual CV</dt><dd id="summaryManualCv">0.00 V</dd></div>
  </dl>
`;

ruleCard.insertAdjacentElement('afterend', summaryPanel);

const summaryInput = document.querySelector<HTMLElement>('#summaryInput');
const summaryMode = document.querySelector<HTMLElement>('#summaryMode');
const summaryDestination = document.querySelector<HTMLElement>('#summaryDestination');
const summaryClockRate = document.querySelector<HTMLElement>('#summaryClockRate');
const summarySlew = document.querySelector<HTMLElement>('#summarySlew');
const summaryJitter = document.querySelector<HTMLElement>('#summaryJitter');
const summaryManualCvRow = document.querySelector<HTMLElement>('#summaryManualCvRow');
const summaryManualCv = document.querySelector<HTMLElement>('#summaryManualCv');

if (!summaryInput || !summaryMode || !summaryDestination || !summaryClockRate || !summarySlew || !summaryJitter || !summaryManualCvRow || !summaryManualCv) {
  throw new Error('Patch summary elements not found');
}

function selectedMode(): HoldMode {
  const selected = document.querySelector<HTMLInputElement>('input[name="mode"]:checked');
  return (selected?.value ?? 'sample-hold') as HoldMode;
}

function selectedDestination(): Destination {
  const destinationSelect = document.querySelector<HTMLSelectElement>('#destinationSelect');
  return (destinationSelect?.value ?? 'scope') as Destination;
}

function formatPercent(value: string): string {
  return `${Math.round(Number(value) * 100)}%`;
}

function formatHertz(value: string): string {
  return `${Number(value).toFixed(2)} Hz`;
}

function formatVolts(value: string): string {
  return `${Number(value).toFixed(2)} V`;
}

function updatePatchSummary(): void {
  const inputSource = inputSourceSelect.value as InputSource;
  const mode = selectedMode();
  const destination = selectedDestination();

  summaryInput.textContent = inputNames[inputSource];
  summaryMode.textContent = modeNames[mode];
  summaryDestination.textContent = destinationNames[destination];
  summaryClockRate.textContent = formatHertz(clockRateInput.value);
  summarySlew.textContent = formatPercent(slewAmountInput.value);
  summaryJitter.textContent = formatPercent(jitterAmountInput.value);
  summaryManualCv.textContent = formatVolts(manualCvInput.value);
  summaryManualCvRow.hidden = inputSource !== 'manual-cv-placeholder';
}

document.addEventListener('input', updatePatchSummary);
document.addEventListener('change', updatePatchSummary);
updatePatchSummary();
