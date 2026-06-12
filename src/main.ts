import './styles.css';

type TriggerSource = 'manual' | 'clock' | null;

type SamplePoint = {
  input: number;
  held: number;
  trigger: TriggerSource;
};

type PlotBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const HISTORY_LENGTH = 220;
const POINT_COUNT = 160;
const DEFAULT_CLOCK_RATE_HZ = 1;
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
      <p class="eyebrow">Software Prototype v0.3</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A fixed visual patch for understanding Sample & Hold behaviour before adding audio, VCOs, Track & Hold, or free patching.</p>
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
        <span class="module-label">Event sources</span>
        <h2>Trigger</h2>
        <p>Manual trigger or internal clock tells Sample & Hold when to capture.</p>

        <div class="event-control-group">
          <button id="triggerButton" type="button">Manual trigger</button>
        </div>

        <label class="clock-control" for="clockRate">
          <span>Clock rate</span>
          <input id="clockRate" type="range" min="0.25" max="4" step="0.25" value="1" />
          <output id="clockRateValue">1.00 Hz</output>
        </label>

        <output id="clockPulseState" class="clock-pulse-state">Clock waiting</output>
      </article>

      <div class="cable trigger-cable" aria-hidden="true">
        <span>Trigger</span>
      </div>
    </section>

    <section class="scope-panel" aria-label="Voltage scope">
      <div class="scope-header">
        <div>
          <h2>Scope</h2>
          <p>Input moves continuously. Held output changes on manual trigger or clock pulse.</p>
        </div>
        <div class="legend" aria-label="Scope legend">
          <span><i class="legend-line input-line"></i>Input LFO</span>
          <span><i class="legend-line held-line"></i>Held output</span>
          <span><i class="legend-pulse clock-pulse-line"></i>Clock trigger</span>
          <span><i class="legend-pulse manual-pulse-line"></i>Manual trigger</span>
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
const clockRateInput = document.querySelector<HTMLInputElement>('#clockRate');
const inputValue = document.querySelector<HTMLOutputElement>('#inputValue');
const heldValue = document.querySelector<HTMLOutputElement>('#heldValue');
const triggerState = document.querySelector<HTMLOutputElement>('#triggerState');
const clockRateValue = document.querySelector<HTMLOutputElement>('#clockRateValue');
const clockPulseState = document.querySelector<HTMLOutputElement>('#clockPulseState');

if (!canvas || !triggerButton || !clockRateInput || !inputValue || !heldValue || !triggerState || !clockRateValue || !clockPulseState) {
  throw new Error('Required app elements were not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas context not available');
}

let heldVoltage = 0;
let lastTriggerTime = 0;
let lastClockPulseTime = 0;
let clockPulseVisibleUntil = 0;
let clockRateHz = DEFAULT_CLOCK_RATE_HZ;
let manualTriggerQueued = false;
let lastTriggerSource: TriggerSource = null;
const history: SamplePoint[] = [];

triggerButton.addEventListener('click', () => {
  manualTriggerQueued = true;
});

clockRateInput.addEventListener('input', () => {
  clockRateHz = Number(clockRateInput.value);
  clockRateValue.value = formatClockRate(clockRateHz);
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

function clockIntervalMs(): number {
  return 1000 / clockRateHz;
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
  const triggerPoints = points
    .map((point, index) => ({ point, index }))
    .filter(({ point }) => point.trigger !== null);

  triggerPoints.forEach(({ point, index }, triggerNumber) => {
    const isLatest = triggerNumber === triggerPoints.length - 1;
    const x = indexToX(index, width);
    const color = point.trigger === 'manual' ? '251, 146, 60' : '250, 204, 21';
    const label = point.trigger === 'manual' ? 'latest manual' : 'latest clock';

    ctx.strokeStyle = isLatest ? `rgba(${color}, 1)` : `rgba(${color}, 0.35)`;
    ctx.lineWidth = isLatest ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x, PLOT.top);
    ctx.lineTo(x, height - PLOT.bottom);
    ctx.stroke();

    if (isLatest) {
      ctx.fillStyle = `rgb(${color})`;
      ctx.beginPath();
      ctx.moveTo(x, PLOT.top + 2);
      ctx.lineTo(x - 8, PLOT.top + 18);
      ctx.lineTo(x + 8, PLOT.top + 18);
      ctx.closePath();
      ctx.fill();

      ctx.font = '800 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, x, PLOT.top + 24);
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

function formatClockRate(value: number): string {
  return `${value.toFixed(2)} Hz`;
}

function chooseTriggerSource(timeMs: number): TriggerSource {
  const clockDue = timeMs - lastClockPulseTime >= clockIntervalMs();

  if (manualTriggerQueued) {
    manualTriggerQueued = false;
    lastClockPulseTime = timeMs;
    return 'manual';
  }

  if (clockDue) {
    lastClockPulseTime = timeMs;
    clockPulseVisibleUntil = timeMs + 260;
    return 'clock';
  }

  return null;
}

function animate(timeMs: number): void {
  const currentInput = calculateInputVoltage(timeMs);
  const triggerSource = chooseTriggerSource(timeMs);

  if (triggerSource) {
    heldVoltage = currentInput;
    lastTriggerTime = timeMs;
    lastTriggerSource = triggerSource;
  }

  history.push({
    input: currentInput,
    held: heldVoltage,
    trigger: triggerSource,
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
  const recentlyTriggered = triggerAge < 450;
  triggerState.value = recentlyTriggered ? `${lastTriggerSource === 'manual' ? 'Manual' : 'Clock'} trigger` : 'Waiting';
  triggerState.classList.toggle('is-triggered', recentlyTriggered);

  const clockPulseVisible = timeMs < clockPulseVisibleUntil;
  clockPulseState.value = clockPulseVisible ? 'Clock pulse' : 'Clock waiting';
  clockPulseState.classList.toggle('is-triggered', clockPulseVisible);

  requestAnimationFrame(animate);
}

clockRateValue.value = formatClockRate(clockRateHz);
requestAnimationFrame(animate);
