import './audio-safety-controls.css';

const patchFlow = document.querySelector<HTMLElement>('.patch-flow');
const eyebrow = document.querySelector<HTMLElement>('.eyebrow');

if (!patchFlow) {
  throw new Error('Patch flow was not found');
}

if (eyebrow) {
  eyebrow.textContent = 'Software Prototype v4.3';
}

const audioSafetyPanel = document.createElement('section');
audioSafetyPanel.className = 'audio-safety-panel';
audioSafetyPanel.setAttribute('aria-label', 'Audio safety controls');
audioSafetyPanel.innerHTML = `
  <div>
    <span class="module-label">Audio safety</span>
    <h2>Start / Panic Stop</h2>
    <p>Status-only controls. No oscillator or sound is created in this version.</p>
  </div>
  <div class="audio-safety-actions">
    <button id="startAudioButton" type="button">Start Audio</button>
    <button id="panicStopButton" type="button" class="panic-stop-button">Panic / Stop Audio</button>
    <output id="audioSafetyStatus" class="audio-safety-status">Audio idle · no sound engine</output>
  </div>
`;

patchFlow.insertAdjacentElement('afterend', audioSafetyPanel);

const startAudioButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#startAudioButton');
const panicStopButton = audioSafetyPanel.querySelector<HTMLButtonElement>('#panicStopButton');
const audioSafetyStatus = audioSafetyPanel.querySelector<HTMLOutputElement>('#audioSafetyStatus');

if (!startAudioButton || !panicStopButton || !audioSafetyStatus) {
  throw new Error('Audio safety controls were not created');
}

startAudioButton.addEventListener('click', () => {
  audioSafetyStatus.value = 'Audio armed visually · no oscillator created';
  audioSafetyStatus.textContent = audioSafetyStatus.value;
});

panicStopButton.addEventListener('click', () => {
  audioSafetyStatus.value = 'Panic stop pressed · no sound engine running';
  audioSafetyStatus.textContent = audioSafetyStatus.value;
});
