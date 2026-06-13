import './audio-safety.css';

type AudioSafetyStatus = 'off' | 'ready' | 'running' | 'stopped' | 'unavailable';

type BrowserAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const SAFE_MASTER_OUTPUT_LEVEL = 0.025;
const MIN_SAFE_OUTPUT_LEVEL = 0;
const MAX_SAFE_OUTPUT_LEVEL = 0.03;
const FIXED_OSCILLATOR_FREQUENCY_HZ = 220;

let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let masterGain: GainNode | null = null;

const eyebrow = document.querySelector<HTMLElement>('.eyebrow');
const patchSummaryPanel = document.querySelector<HTMLElement>('.patch-summary-panel');
const ruleCard = document.querySelector<HTMLElement>('.rule-card');

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v2.6';
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
    <p class="audio-safety-kicker">Phase 4 first sound test</p>
    <h2>Audio Demo / Safety</h2>
    <p class="audio-safety-copy">Start Audio plays one fixed, quiet oscillator. Panic / Stop Audio silences it immediately.</p>
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
      <dd><output id="audioSafetyClamp">0.03 max level</output></dd>
    </div>
    <div>
      <dt>Oscillator</dt>
      <dd><output id="audioOscillatorReadout">Fixed 220 Hz</output></dd>
    </div>
  </dl>
`;

insertionTarget.insertAdjacentElement('afterend', audioSafetyPanel);

const startAudioButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#startAudioButton');
const stopAudioButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#stopAudioButton');
const audioSafetyStatus = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioSafetyStatus');
const audioSafetyClamp = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioSafetyClamp');
const audioOscillatorReadout = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioOscillatorReadout');

if (!startAudioButton || !stopAudioButton || !audioSafetyStatus || !audioSafetyClamp || !audioOscillatorReadout) {
  throw new Error('Audio safety controls not found');
}

function clampOutputLevel(value: number): number {
  return Math.min(MAX_SAFE_OUTPUT_LEVEL, Math.max(MIN_SAFE_OUTPUT_LEVEL, value));
}

function audioContextConstructor(): typeof AudioContext | undefined {
  return window.AudioContext ?? (window as BrowserAudioWindow).webkitAudioContext;
}

function statusText(status: AudioSafetyStatus): string {
  if (status === 'ready') {
    return 'Audio ready';
  }

  if (status === 'running') {
    return 'Audio running';
  }

  if (status === 'stopped') {
    return 'Audio stopped';
  }

  if (status === 'unavailable') {
    return 'Audio unavailable';
  }

  return 'Audio off';
}

function updateAudioSafetyStatus(status: AudioSafetyStatus): void {
  const safeLevel = clampOutputLevel(SAFE_MASTER_OUTPUT_LEVEL);
  audioSafetyStatus.value = statusText(status);
  audioSafetyStatus.textContent = statusText(status);
  audioSafetyClamp.value = `${safeLevel.toFixed(3)} safe level, ${MAX_SAFE_OUTPUT_LEVEL.toFixed(2)} max`;
  audioSafetyClamp.textContent = `${safeLevel.toFixed(3)} safe level, ${MAX_SAFE_OUTPUT_LEVEL.toFixed(2)} max`;
  audioOscillatorReadout.value = `Fixed ${FIXED_OSCILLATOR_FREQUENCY_HZ} Hz`;
  audioOscillatorReadout.textContent = `Fixed ${FIXED_OSCILLATOR_FREQUENCY_HZ} Hz`;
  audioSafetyPanel.dataset.audioStatus = status;
}

async function startOscillator(): Promise<void> {
  if (oscillator) {
    updateAudioSafetyStatus('running');
    return;
  }

  const AudioContextConstructor = audioContextConstructor();

  if (!AudioContextConstructor) {
    updateAudioSafetyStatus('unavailable');
    return;
  }

  audioContext = new AudioContextConstructor();

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const safeLevel = clampOutputLevel(SAFE_MASTER_OUTPUT_LEVEL);
  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(safeLevel, audioContext.currentTime);
  masterGain.connect(audioContext.destination);

  oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(FIXED_OSCILLATOR_FREQUENCY_HZ, audioContext.currentTime);
  oscillator.connect(masterGain);
  oscillator.start();

  updateAudioSafetyStatus('running');
}

function stopOscillator(): void {
  if (oscillator && audioContext) {
    try {
      oscillator.stop(audioContext.currentTime);
    } catch {
      // The oscillator may already be stopped. Panic still completes cleanup.
    }

    oscillator.disconnect();
  }

  oscillator = null;

  if (masterGain) {
    masterGain.gain.value = 0;
    masterGain.disconnect();
  }

  masterGain = null;

  if (audioContext && audioContext.state !== 'closed') {
    void audioContext.close();
  }

  audioContext = null;
  updateAudioSafetyStatus('stopped');
}

startAudioButton.addEventListener('click', () => {
  void startOscillator();
});

stopAudioButton.addEventListener('click', () => {
  stopOscillator();
});

updateAudioSafetyStatus('off');
