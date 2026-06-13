import './audio-safety.css';

type AudioSafetyStatus = 'off' | 'ready' | 'stopped';

const SAFE_MASTER_OUTPUT_LEVEL = 0;
const MIN_SAFE_OUTPUT_LEVEL = 0;
const MAX_SAFE_OUTPUT_LEVEL = 0;

const eyebrow = document.querySelector<HTMLElement>('.eyebrow');
const patchSummaryPanel = document.querySelector<HTMLElement>('.patch-summary-panel');
const ruleCard = document.querySelector<HTMLElement>('.rule-card');

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v2.5';
}

const insertionTarget = patchSummaryPanel ?? ruleCard;

if (!insertionTarget) {
  throw new Error('Audio safety insertion target not found');
}

const audioSafetyPanel = document.createElement('section');
audioSafetyPanel.className = 'audio-safety-panel';
audioSafetyPanel.setAttribute('aria-label', 'Audio demo safety controls');
audioSafetyPanel.innerHTML = `
  <div>
    <p class="audio-safety-kicker">Phase 4 safety shell</p>
    <h2>Audio Demo / Safety</h2>
    <p class="audio-safety-copy">Safety controls are visible before any sound is added. This panel does not create audio.</p>
  </div>
  <div class="audio-safety-actions">
    <button id="startAudioButton" type="button" class="audio-safety-button">Start Audio</button>
    <button id="stopAudioButton" type="button" class="audio-safety-button audio-safety-stop">Panic / Stop Audio</button>
  </div>
  <dl class="audio-safety-readout">
    <div>
      <dt>Status</dt>
      <dd><output id="audioSafetyStatus">Audio off</output></dd>
    </div>
    <div>
      <dt>Safe output clamp</dt>
      <dd><output id="audioSafetyClamp">0.00 silent level</output></dd>
    </div>
  </dl>
`;

insertionTarget.insertAdjacentElement('afterend', audioSafetyPanel);

const startAudioButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#startAudioButton');
const stopAudioButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#stopAudioButton');
const audioSafetyStatus = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioSafetyStatus');
const audioSafetyClamp = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioSafetyClamp');

if (!startAudioButton || !stopAudioButton || !audioSafetyStatus || !audioSafetyClamp) {
  throw new Error('Audio safety controls not found');
}

function clampOutputLevel(value: number): number {
  return Math.min(MAX_SAFE_OUTPUT_LEVEL, Math.max(MIN_SAFE_OUTPUT_LEVEL, value));
}

function statusText(status: AudioSafetyStatus): string {
  if (status === 'ready') {
    return 'Audio ready';
  }

  if (status === 'stopped') {
    return 'Audio stopped';
  }

  return 'Audio off';
}

function updateAudioSafetyStatus(status: AudioSafetyStatus): void {
  const safeLevel = clampOutputLevel(SAFE_MASTER_OUTPUT_LEVEL);
  audioSafetyStatus.value = statusText(status);
  audioSafetyStatus.textContent = statusText(status);
  audioSafetyClamp.value = `${safeLevel.toFixed(2)} silent level`;
  audioSafetyClamp.textContent = `${safeLevel.toFixed(2)} silent level`;
  audioSafetyPanel.dataset.audioStatus = status;
}

startAudioButton.addEventListener('click', () => {
  updateAudioSafetyStatus('ready');
});

stopAudioButton.addEventListener('click', () => {
  updateAudioSafetyStatus('stopped');
});

updateAudioSafetyStatus('off');
