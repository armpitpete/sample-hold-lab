import './styles.css';

type SamplePoint = {
  input: number;
  held: number;
  trigger: boolean;
};

type PlotBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const HISTORY_LENGTH = 220;
const POINT_COUNT = 160;
const PLOT: PlotBox = {
  left: 62,
  right: 22,
  top: 18,
  bottom: 34,
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <section class="lab-shell">
    <header class="hero">
      <p class="eyebrow">Software Prototype v0.2</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A fixed visual patch for understanding Sample & Hold behaviour before adding audio, VCOs, clocks, or free patching.</p>
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
          <p>Input moves continuously. Held output changes only when manually triggered.</p>
        </div>
        <div class="legend" aria-label="Scope legend">
          <span><i class="legend-line input-line"></i>Input LFO</span>
          <span><i class="legend-line held-line"></i>Held output</span>
          <span><i class="legend-pulse"></i>Latest trigger</span>
        </div>
      </div>
      <canvas id="scope" width="960" height="360" aria-label="Visual waveform scope with voltage labels"></canvas>
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

function plotWidth(width: number): number {
  return width - PLOT.left - PLOT.right;
}

function plotHeight(height: number): number {
  return height - PLOT.top - PLOT.bottom;
}

function voltageToY(value: number, height: number): number {
  const normalized = (value + 5) / 10;
  return PLOT.top + plotHeight(height) - normalized * plotHeight(height);
}

function indexToX(index: number, width: number): number {
  return PLOT.left + (plotWidth(width) / (POINT_COUNT - 1)) * index;
}

function drawGrid(width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);

  const voltages = [5, 2.5, 0, -2.5, -5];

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 12; i += 1) {
    const x = PLOT.left + (plotWidth(width) / 12) * i;
    ctx.beginPath();
    ctx.moveTo(x, PLOT.top);
    ctx.lineTo(x, height - PLOT.bottom);
    ctx.stroke();
  }

  voltages.forEach((voltage) => {
    const y = voltageToY(voltage, height);
    const isZero = voltage === 0;

    ctx.strokeStyle = isZero ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = isZero ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(PLOT.left, y);
    ctx.lineTo(width - PLOT.right, y);
    ctx.stroke();

    ctx.fillStyle = isZero ? '#e5e7eb' : '#94a3b8';
    ctx.font = isZero ? '700 13px Inter, sans-serif' : '600 12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${voltage > 0 ? '+' : ''}${voltage} V`, PLOT.left - 10, y);
  });

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('time →', PLOT.left + plotWidth(width) / 2, height - 10);
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
    const x = indexToX(index, width);
    const y = voltageToY(value, height);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function drawHeldStepping(points: SamplePoint[], width: number, height: number): void {
  if (points.length < 2) {
    return;
  }

  ctx.strokeStyle = 'rgba(244, 114, 182, 0.22)';
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'butt';
  ctx.beginPath();

  points.forEach((point, index) => {
    const x = indexToX(index, width);
    const y = voltageToY(point.held, height);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function drawTriggers(points: SamplePoint[], width: number, height: number): void {
  const triggerIndexes = points
    .map((point, index) => ({ point, index }))
    .filter(({ point }) => point.trigger)
    .map(({ index }) => index);

  triggerIndexes.forEach((index, triggerNumber) => {
    const isLatest = triggerNumber === triggerIndexes.length - 1;
    const x = indexToX(index, width);

    ctx.strokeStyle = isLatest ? 'rgba(250, 204, 21, 1)' : 'rgba(250, 204, 21, 0.35)';
    ctx.lineWidth = isLatest ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x, PLOT.top);
    ctx.lineTo(x, height - PLOT.bottom);
    ctx.stroke();

    if (isLatest) {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(x, PLOT.top + 2);
      ctx.lineTo(x - 8, PLOT.top + 18);
      ctx.lineTo(x + 8, PLOT.top + 18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.font = '800 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('latest trigger', x, PLOT.top + 24);
    }
  });
}

function drawCurrentMarkers(points: SamplePoint[], width: number, height: number): void {
  const latest = points.at(-1);

  if (!latest) {
    return;
  }

  const x = width - PLOT.right;
  const inputY = voltageToY(latest.input, height);
  const heldY = voltageToY(latest.held, height);

  drawMarker(x, inputY, '#67e8f9');
  drawMarker(x, heldY, '#f472b6');

  ctx.font = '800 12px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#67e8f9';
  ctx.fillText('input now', x - 8, inputY - 8);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f472b6';
  ctx.fillText('held output', x - 8, heldY + 8);
}

function drawMarker(x: number, y: number, fillStyle: string): void {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 3;
  ctx.stroke();
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
  drawHeldStepping(visiblePoints, width, height);
  drawTriggers(visiblePoints, width, height);
  drawLine(visiblePoints.map((point) => point.input), width, height, '#67e8f9', 3);
  drawLine(visiblePoints.map((point) => point.held), width, height, '#f472b6', 4);
  drawCurrentMarkers(visiblePoints, width, height);

  inputValue.value = formatVoltage(currentInput);
  heldValue.value = formatVoltage(heldVoltage);

  const triggerAge = timeMs - lastTriggerTime;
  triggerState.value = triggerAge < 450 ? 'Triggered' : 'Waiting';
  triggerState.classList.toggle('is-triggered', triggerAge < 450);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
