import './audio-safety-controls.css';

type AudioContextConstructor = typeof AudioContext;

const patchFlow = document.querySelector<HTMLElement>('.patch-flow');
const eyebrow = document.querySelector<HTMLElement>('.eyebrow');

if (!patchFlow) {
  throw new Error('Patch flow was not found');
}

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v4.4';
}

const audioSafetyPanel = document.createElement('section');
audioSafetyPanel.className = 'audio-safety-panel';
audioSafetyPanel.setAttribute('aria-label', 'Audio safety controls');
audioSafetyPanel.innerHTML = `
  <div>
    <span class="module-label">Audio safety</span>
    <h2>Start / Panic Stop</h2>
    <p>Starts one quiet steady oscillator. CV does not control pitch yet.</p>
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

function stopOscillator(): void {
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

    safeOscillator.type = 'sine';
    safeOscillator.frequency.setValueAtTime(220, now);

    safeGain.gain.setValueAtTime(0.025, now);

    safeOscillator.connect(safeGain);
    safeGain.connect(context.destination);

    safeOscillator.start(now);

    oscillator = safeOscillator;
    outputGain = safeGain;

    setAudioStatus('Audio running · one quiet steady oscillator · no CV pitch yet');
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
