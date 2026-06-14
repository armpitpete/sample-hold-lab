import './audio-safety-controls.css';

type AudioContextConstructor = typeof AudioContext;

const MIN_PITCH_HZ = 110;
const CENTRE_PITCH_HZ = 220;
const MAX_PITCH_HZ = 880;
const PITCH_UPDATE_INTERVAL_MS = 50;

const patchFlow = document.querySelector<HTMLElement>('.patch-flow');
const eyebrow = document.querySelector<HTMLElement>('.eyebrow');
const slewedValue = document.querySelector<HTMLOutputElement>('#slewedValue');

if (!patchFlow) {
  throw new Error('Patch flow was not found');
}

if (!slewedValue) {
  throw new Error('Slewed main CV output was not found');
}

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v5.0';
}

const audioSafetyPanel = document.createElement('section');
audioSafetyPanel.className = 'audio-safety-panel';
audioSafetyPanel.setAttribute('aria-label', 'Audio safety controls');
audioSafetyPanel.innerHTML = `
  <div>
    <span class="module-label">Audio safety</span>
    <h2>Start / Panic Stop</h2>
    <p>Starts one quiet oscillator. Held/slewed main CV controls pitch only.</p>
  </div>
  <div class="audio-safety-actions">
    <button id="startAudioButton" type="button">Start Audio</button>
    <button id="panicStopButton" type="button" class="panic-stop-button">Panic / Stop Audio</button>
    <output id="audioSafetyStatus" class="audio-safety-status">Audio idle · oscillator stopped</output>
  </div>
`;

patchFlow.insertAdjacentElement('afterend', audioSafetyPanel);

const startAudioButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#startAudioButton');
const panicStopButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#panicStopButton');
const audioSafetyStatus = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioSafetyStatus');

if (!startAudioButton || !panicStopButton || !audioSafetyStatus) {
  throw new Error('Audio safety controls were not created');
}

let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let outputGain: GainNode | null = null;
let pitchUpdateTimer: number | null = null;

function setAudioStatus(message: string): void {
  audioSafetyStatus.value = message;
  audioSafetyStatus.textContent = message;
}

function getAudioContext(): AudioContext {
  if (audioContext) {
    return audioContext;
  }

  const maybeWindow = window as Window & { webkitAudioContext?: AudioContextConstructor };
  const ContextConstructor = window.AudioContext ?? maybeWindow.webkitAudioContext;

  if (!ContextConstructor) {
    throw new Error('Web Audio is not available in this browser');
  }

  audioContext = new ContextConstructor();
  return audioContext;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readSlewedMainVoltage(): number {
  const text = slewedValue.value || slewedValue.textContent || '0';
  const match = text.match(/-?\d+(\.\d+)?/);
  const voltage = match ? Number(match[0]) : 0;

  return clamp(Number.isFinite(voltage) ? voltage : 0, -5, 5);
}

function voltageToPitchHz(voltage: number): number {
  if (voltage >= 0) {
    return CENTRE_PITCH_HZ + (voltage / 5) * (MAX_PITCH_HZ - CENTRE_PITCH_HZ);
  }

  return CENTRE_PITCH_HZ + (voltage / 5) * (CENTRE_PITCH_HZ - MIN_PITCH_HZ);
}

function formatPitchStatus(voltage: number, pitchHz: number): string {
  return `Audio running · main CV ${voltage.toFixed(2)} V → ${pitchHz.toFixed(0)} Hz`;
}

function updateOscillatorPitch(): void {
  if (!audioContext || !oscillator) {
    return;
  }

  const voltage = readSlewedMainVoltage();
  const pitchHz = voltageToPitchHz(voltage);
  const now = audioContext.currentTime;

  oscillator.frequency.setTargetAtTime(pitchHz, now, 0.025);
  setAudioStatus(formatPitchStatus(voltage, pitchHz));
}

function stopPitchUpdates(): void {
  if (pitchUpdateTimer === null) {
    return;
  }

  window.clearInterval(pitchUpdateTimer);
  pitchUpdateTimer = null;
}

function startPitchUpdates(): void {
  stopPitchUpdates();
  updateOscillatorPitch();
  pitchUpdateTimer = window.setInterval(updateOscillatorPitch, PITCH_UPDATE_INTERVAL_MS);
}

function stopOscillator(): void {
  stopPitchUpdates();

  if (oscillator) {
    try {
      oscillator.stop();
    } catch {
      // The oscillator may already be stopped. Panic should remain safe.
    }

    oscillator.disconnect();
    oscillator = null;
  }

  if (outputGain) {
    outputGain.disconnect();
    outputGain = null;
  }
}

async function startOneSafeOscillator(): Promise<void> {
  try {
    const context = getAudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    stopOscillator();

    const now = context.currentTime;
    const safeGain = context.createGain();
    const safeOscillator = context.createOscillator();
    const startingVoltage = readSlewedMainVoltage();

    safeOscillator.type = 'sine';
    safeOscillator.frequency.setValueAtTime(voltageToPitchHz(startingVoltage), now);

    safeGain.gain.setValueAtTime(0.025, now);

    safeOscillator.connect(safeGain);
    safeGain.connect(context.destination);

    safeOscillator.start(now);

    oscillator = safeOscillator;
    outputGain = safeGain;

    startPitchUpdates();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Audio start failed';
    setAudioStatus(`Audio failed · ${message}`);
  }
}

function panicStopAudio(): void {
  stopOscillator();
  setAudioStatus('Panic stop complete · oscillator stopped');
}

startAudioButton.addEventListener('click', () => {
  void startOneSafeOscillator();
});

panicStopButton.addEventListener('click', panicStopAudio);
