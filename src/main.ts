import './styles.css';

type SamplePoint = {
  input: number;
  held: number;
  trigger: boolean;
};

const HISTORY_LENGTH = 220;
const POINT_COUNT = 160;

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <section class="lab-shell">
    <header class="hero">
      <p class="eyebrow">Software Prototype v0.1</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A fixed visual patch for understanding Sample & Hold behaviour before adding audio, VCOs, or free patching.</p>
    </header>

    <section class="patch-flow" aria-label="Fixed patch signal flow">
      <article class="module-card source-module">
        <span class="module-label">Voltage source</span>
        <h2>LFO</h2>
        <p>Creates a continuously changing voltage.</p>
        <output id="inputValue">0.00 V</output>
      </article>

      <div class="cable cv-cable" aria-hidden="true">
        <span>CV</span>
      </div>

      <article class="module-card processor-module">
        <span class="module-label">Processor</span>
        <h2>Sample & Hold</h2>
        <p>Captures the current input voltage when triggered.</p>
        <output id="heldValue">0.00 V</output>
      </article>

      <div class="cable output-cable" aria-hidden="true">
        <span>Held CV</span>
      </div>

      <article class="module-card destination-module">
        <span class="module-label">Destination</span>
        <h2>Scope</h2>
        <p>Shows input voltage and held output.</p>
        <output id="triggerState">Waiting</output>
      </article>

      <article class="module-card trigger-module">
        <span class="module-label">Event source</span>
        <h2>Manual Trigger</h2>
        <p>Tells Sample & Hold when to capture.</p>
        <button id="triggerButton" type="button">Trigger sample</button>
      </article>

      <div class="cable trigger-cable" aria-hidden="true">
        <span>Trigger</span>
      </div>
    </section>

    <section class="scope-panel" aria-label="Voltage scope">
      <div class="scope-header">
        <div>
          <h2>Scope</h2>
          <p>Input moves continuously. Held output changes only when triggered.</p>
        </div>
        <div class="legend" aria-label="Scope legend">
          <span><i class="legend-line input-line"></i>Input LFO</span>
          <span><i class="legend-line held-line"></i>Held output</span>
          <span><i class="legend-pulse"></i>Trigger</span>
        </div>
      </div>
      <canvas id="scope" width="960" height="360" aria-label="Visual waveform scope"></canvas>
    </section>

    <section class="rule-card">
      <h2>Core rule</h2>
      <p><strong>changing voltage</strong> → <strong>trigger</strong> → <strong>captured value</strong> → <strong>held output</strong></p>
    </section>
  </section>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#scope');
const triggerButton = document.querySelector<HTMLButtonElement>('#triggerButton');
const inputValue = document.querySelector<HTMLOutputElement>('#inputValue');
const heldValue = document.querySelector<HTMLOutputElement>('#heldValue');
const triggerState = document.querySelector<HTMLOutputElement>('#triggerState');

if (!canvas || !triggerButton || !inputValue || !heldValue || !triggerState) {
  throw new Error('Required app elements were not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas context not available');
}

let heldVoltage = 0;
let lastTriggerTime = 0;
let manualTriggerQueued = false;
const history: SamplePoint[] = [];

triggerButton.addEventListener('click', () => {
  manualTriggerQueued = true;
});

function calculateInputVoltage(timeMs: number): number {
  const slowWave = Math.sin(timeMs / 850);
  const gentleMovement = Math.sin(timeMs / 2300) * 0.28;
  return clamp(slowWave * 3.6 + gentleMovement, -5, 5);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function voltageToY(value: number, height: number): number {
  const normalized = (value + 5) / 10;
  return height - normalized * height;
}

function drawGrid(width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 10; i += 1) {
    const y = (height / 10) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 12; i += 1) {
    const x = (width / 12) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  const zeroY = voltageToY(0, height);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
  ctx.beginPath();
  ctx.moveTo(0, zeroY);
  ctx.lineTo(width, zeroY);
  ctx.stroke();
}

function drawLine(points: number[], width: number, height: number, strokeStyle: string, lineWidth = 3): void {
  if (points.length < 2) {
    return;
  }

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();

  points.forEach((value, index) => {
    const x = (width / (POINT_COUNT - 1)) * index;
    const y = voltageToY(value, height);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function drawTriggers(points: SamplePoint[], width: number, height: number): void {
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
  ctx.lineWidth = 2;

  points.forEach((point, index) => {
    if (!point.trigger) {
      return;
    }

    const x = (width / (POINT_COUNT - 1)) * index;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  });
}

function formatVoltage(value: number): string {
  return `${value.toFixed(2)} V`;
}

function animate(timeMs: number): void {
  const currentInput = calculateInputVoltage(timeMs);
  const triggered = manualTriggerQueued;

  if (triggered) {
    heldVoltage = currentInput;
    lastTriggerTime = timeMs;
    manualTriggerQueued = false;
  }

  history.push({
    input: currentInput,
    held: heldVoltage,
    trigger: triggered,
  });

  while (history.length > HISTORY_LENGTH) {
    history.shift();
  }

  const visiblePoints = history.slice(-POINT_COUNT);
  const width = canvas.width;
  const height = canvas.height;

  drawGrid(width, height);
  drawTriggers(visiblePoints, width, height);
  drawLine(visiblePoints.map((point) => point.input), width, height, '#67e8f9', 3);
  drawLine(visiblePoints.map((point) => point.held), width, height, '#f472b6', 4);

  inputValue.value = formatVoltage(currentInput);
  heldValue.value = formatVoltage(heldVoltage);

  const triggerAge = timeMs - lastTriggerTime;
  triggerState.value = triggerAge < 450 ? 'Triggered' : 'Waiting';
  triggerState.classList.toggle('is-triggered', triggerAge < 450);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
