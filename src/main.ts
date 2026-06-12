import './styles.css';

type Mode = 'sample-hold' | 'track-hold';
type EventSource = 'manual' | 'clock' | 'gate-open' | 'gate-close' | null;

type SamplePoint = {
  input: number;
  rawOutput: number;
  slewedOutput: number;
  event: EventSource;
  regularClock: boolean;
  gateOpen: boolean;
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
const DEFAULT_SLEW_AMOUNT = 0.35;
const DEFAULT_JITTER_AMOUNT = 0.1;
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
      <p class="eyebrow">Software Prototype v0.6</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A fixed visual patch for comparing regular clock timing with subtle jittered trigger and gate timing.</p>
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
        <h2>Sample / Track & Hold</h2>
        <p id="modeDescription">S&H captures a raw target on jittered trigger timing. Slew smooths the output toward it.</p>

        <fieldset class="mode-switch" aria-label="Hold mode">
          <legend>Mode</legend>
          <label><input type="radio" name="mode" value="sample-hold" checked /> S&amp;H</label>
          <label><input type="radio" name="mode" value="track-hold" /> T&amp;H</label>
        </fieldset>

        <output id="rawValue">Raw 0.00 V</output>
        <output id="slewedValue">Slewed 0.00 V</output>
      </article>

      <div class="cable output-cable" aria-hidden="true">
        <span>Raw / Slewed CV</span>
      </div>

      <article class="module-card destination-module">
        <span class="module-label">Destination</span>
        <h2>Scope</h2>
        <p>Shows regular clock, jittered timing, raw output, and slewed output.</p>
        <output id="triggerState">Waiting</output>
      </article>

      <article class="module-card trigger-module">
        <span class="module-label">Event sources</span>
        <h2>Trigger / Gate / Slew / Jitter</h2>
        <p>Regular clock is the reference. Jitter moves the actual trigger or gate edge slightly.</p>

        <div class="event-control-group">
          <button id="triggerButton" type="button">Manual trigger</button>
        </div>

        <label class="clock-control" for="clockRate">
          <span>Clock / gate rate</span>
          <input id="clockRate" type="range" min="0.25" max="4" step="0.25" value="1" />
          <output id="clockRateValue">1.00 Hz</output>
        </label>

        <label class="slew-control" for="slewAmount">
          <span>Slew amount</span>
          <input id="slewAmount" type="range" min="0" max="1" step="0.01" value="0.35" />
          <output id="slewAmountValue">35%</output>
        </label>

        <label class="jitter-control" for="jitterAmount">
          <span>Timing jitter</span>
          <input id="jitterAmount" type="range" min="0" max="0.35" step="0.01" value="0.10" />
          <output id="jitterAmountValue">10%</output>
        </label>

        <output id="clockPulseState" class="clock-pulse-state">Jittered clock waiting</output>
        <output id="gateState" class="gate-state">Gate inactive in S&amp;H</output>
      </article>

      <div class="cable trigger-cable" aria-hidden="true">
        <span>Trigger / Gate</span>
      </div>
    </section>

    <section class="scope-panel" aria-label="Voltage scope">
      <div class="scope-header">
        <div>
          <h2>Scope</h2>
          <p id="scopeDescription">S&H mode: regular clock is the reference; jittered clock triggers capture near that reference.</p>
        </div>
        <div class="legend" aria-label="Scope legend">
          <span><i class="legend-line input-line"></i>Input LFO</span>
          <span><i class="legend-line raw-line"></i>Raw output</span>
          <span><i class="legend-line held-line"></i>Slewed output</span>
          <span><i class="legend-pulse regular-clock-line"></i>Regular clock</span>
          <span><i class="legend-pulse clock-pulse-line"></i>Jittered timing</span>
          <span><i class="legend-pulse manual-pulse-line"></i>Manual trigger</span>
          <span><i class="legend-gate"></i>Gate open</span>
        </div>
      </div>
      <canvas id="scope" width="960" height="360" aria-label="Visual waveform scope with voltage labels"></canvas>
    </section>

    <section class="rule-card">
      <h2>Core rule</h2>
      <p><strong>Regular clock</strong> is the reference. <strong>Jitter</strong> moves the real trigger or gate edge slightly early or late.</p>
    </section>
  </section>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#scope');
const triggerButton = document.querySelector<HTMLButtonElement>('#triggerButton');
const clockRateInput = document.querySelector<HTMLInputElement>('#clockRate');
const slewAmountInput = document.querySelector<HTMLInputElement>('#slewAmount');
const jitterAmountInput = document.querySelector<HTMLInputElement>('#jitterAmount');
const inputValue = document.querySelector<HTMLOutputElement>('#inputValue');
const rawValue = document.querySelector<HTMLOutputElement>('#rawValue');
const slewedValue = document.querySelector<HTMLOutputElement>('#slewedValue');
const triggerState = document.querySelector<HTMLOutputElement>('#triggerState');
const clockRateValue = document.querySelector<HTMLOutputElement>('#clockRateValue');
const slewAmountValue = document.querySelector<HTMLOutputElement>('#slewAmountValue');
const jitterAmountValue = document.querySelector<HTMLOutputElement>('#jitterAmountValue');
const clockPulseState = document.querySelector<HTMLOutputElement>('#clockPulseState');
const gateState = document.querySelector<HTMLOutputElement>('#gateState');
const modeDescription = document.querySelector<HTMLParagraphElement>('#modeDescription');
const scopeDescription = document.querySelector<HTMLParagraphElement>('#scopeDescription');
const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]');

if (!canvas || !triggerButton || !clockRateInput || !slewAmountInput || !jitterAmountInput || !inputValue || !rawValue || !slewedValue || !triggerState || !clockRateValue || !slewAmountValue || !jitterAmountValue || !clockPulseState || !gateState || !modeDescription || !scopeDescription) {
  throw new Error('Required app elements were not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas context not available');
}

let mode: Mode = 'sample-hold';
let rawOutputVoltage = 0;
let slewedOutputVoltage = 0;
let lastFrameTime = 0;
let lastEventTime = 0;
let nextIdealMarkTime = 0;
let nextIdealEventTime = 0;
let nextJitteredEventTime = 0;
let clockPulseVisibleUntil = 0;
let clockRateHz = DEFAULT_CLOCK_RATE_HZ;
let slewAmount = DEFAULT_SLEW_AMOUNT;
let jitterAmount = DEFAULT_JITTER_AMOUNT;
let manualTriggerQueued = false;
let gateOpenState = false;
let lastEventSource: EventSource = null;
let clockScheduleNeedsReset = true;
const history: SamplePoint[] = [];

triggerButton.addEventListener('click', () => {
  manualTriggerQueued = true;
});

clockRateInput.addEventListener('input', () => {
  clockRateHz = Number(clockRateInput.value);
  clockRateValue.value = formatClockRate(clockRateHz);
  clockScheduleNeedsReset = true;
});

slewAmountInput.addEventListener('input', () => {
  slewAmount = Number(slewAmountInput.value);
  slewAmountValue.value = formatSlewAmount(slewAmount);
});

jitterAmountInput.addEventListener('input', () => {
  jitterAmount = Number(jitterAmountInput.value);
  jitterAmountValue.value = formatJitterAmount(jitterAmount);
  clockScheduleNeedsReset = true;
});

modeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    mode = input.value as Mode;
    history.length = 0;
    lastEventSource = null;
    lastEventTime = 0;
    gateOpenState = false;
    clockScheduleNeedsReset = true;
    updateModeText();
  });
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

function randomJitterOffset(intervalMs: number): number {
  if (jitterAmount <= 0) {
    return 0;
  }

  return (Math.random() * 2 - 1) * intervalMs * jitterAmount;
}

function resetClockSchedule(timeMs: number): void {
  const interval = clockIntervalMs();
  nextIdealMarkTime = timeMs + interval;
  nextIdealEventTime = nextIdealMarkTime;
  nextJitteredEventTime = nextIdealEventTime + randomJitterOffset(interval);
  clockScheduleNeedsReset = false;
  clockPulseVisibleUntil = 0;
}

function ensureClockSchedule(timeMs: number): void {
  if (clockScheduleNeedsReset || nextIdealMarkTime === 0 || nextJitteredEventTime === 0) {
    resetClockSchedule(timeMs);
  }
}

function takeRegularClockMark(timeMs: number): boolean {
  let marked = false;
  const interval = clockIntervalMs();

  while (timeMs >= nextIdealMarkTime) {
    marked = true;
    nextIdealMarkTime += interval;
  }

  return marked;
}

function takeJitteredClockEvent(timeMs: number): boolean {
  if (timeMs < nextJitteredEventTime) {
    return false;
  }

  const interval = clockIntervalMs();
  nextIdealEventTime += interval;
  nextJitteredEventTime = nextIdealEventTime + randomJitterOffset(interval);
  clockPulseVisibleUntil = timeMs + 260;
  return true;
}

function updateModeText(): void {
  if (mode === 'sample-hold') {
    modeDescription.textContent = 'S&H captures a raw target on jittered trigger timing. Slew smooths the output toward it.';
    scopeDescription.textContent = 'S&H mode: regular clock is the reference; jittered clock triggers capture near that reference.';
    return;
  }

  modeDescription.textContent = 'T&H gate edges use jittered timing. Slew smooths the output toward the raw target.';
  scopeDescription.textContent = 'T&H mode: regular clock is the reference; jittered gate edges open and close the tracking window.';
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

function drawRegularClockMarks(points: SamplePoint[], width: number, height: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.42)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 7]);

  points.forEach((point, index) => {
    if (!point.regularClock) {
      return;
    }

    const x = indexToX(index, width);
    ctx.beginPath();
    ctx.moveTo(x, PLOT.top);
    ctx.lineTo(x, height - PLOT.bottom);
    ctx.stroke();
  });

  ctx.restore();
}

function drawGateBands(points: SamplePoint[], width: number, height: number): void {
  if (mode !== 'track-hold') {
    return;
  }

  ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';

  points.forEach((point, index) => {
    if (!point.gateOpen) {
      return;
    }

    const x = indexToX(index, width);
    const nextX = indexToX(Math.min(index + 1, POINT_COUNT - 1), width);
    ctx.fillRect(x, PLOT.top, Math.max(2, nextX - x), height - PLOT.top - PLOT.bottom);
  });
}

function drawLine(points: number[], width: number, height: number, strokeStyle: string, lineWidth = 3, dashed = false): void {
  if (points.length < 2) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.setLineDash(dashed ? [9, 7] : []);
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
  ctx.restore();
}

function drawOutputTrace(points: SamplePoint[], width: number, height: number): void {
  if (points.length < 2) {
    return;
  }

  ctx.strokeStyle = 'rgba(244, 114, 182, 0.20)';
  ctx.lineWidth = 11;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();

  points.forEach((point, index) => {
    const x = indexToX(index, width);
    const y = voltageToY(point.slewedOutput, height);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function drawEvents(points: SamplePoint[], width: number, height: number): void {
  const eventPoints = points
    .map((point, index) => ({ point, index }))
    .filter(({ point }) => point.event !== null);

  eventPoints.forEach(({ point, index }, eventNumber) => {
    const isLatest = eventNumber === eventPoints.length - 1;
    const x = indexToX(index, width);
    const eventStyle = getEventStyle(point.event);

    ctx.strokeStyle = isLatest ? eventStyle.strong : eventStyle.soft;
    ctx.lineWidth = isLatest ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x, PLOT.top);
    ctx.lineTo(x, height - PLOT.bottom);
    ctx.stroke();

    if (isLatest) {
      ctx.fillStyle = eventStyle.strong;
      ctx.beginPath();
      ctx.moveTo(x, PLOT.top + 2);
      ctx.lineTo(x - 8, PLOT.top + 18);
      ctx.lineTo(x + 8, PLOT.top + 18);
      ctx.closePath();
      ctx.fill();

      ctx.font = '800 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(eventStyle.label, x, PLOT.top + 24);
    }
  });
}

function getEventStyle(event: EventSource): { strong: string; soft: string; label: string } {
  switch (event) {
    case 'manual':
      return { strong: '#fb923c', soft: 'rgba(251, 146, 60, 0.35)', label: 'manual trigger' };
    case 'clock':
      return { strong: '#facc15', soft: 'rgba(250, 204, 21, 0.35)', label: 'jittered trigger' };
    case 'gate-open':
      return { strong: '#22c55e', soft: 'rgba(34, 197, 94, 0.35)', label: 'jittered gate open' };
    case 'gate-close':
      return { strong: '#60a5fa', soft: 'rgba(96, 165, 250, 0.35)', label: 'jittered gate close' };
    default:
      return { strong: '#facc15', soft: 'rgba(250, 204, 21, 0.35)', label: 'event' };
  }
}

function drawCurrentMarkers(points: SamplePoint[], width: number, height: number): void {
  const latest = points[points.length - 1];

  if (!latest) {
    return;
  }

  const x = width - PLOT.right;
  const inputY = voltageToY(latest.input, height);
  const rawY = voltageToY(latest.rawOutput, height);
  const slewedY = voltageToY(latest.slewedOutput, height);

  drawMarker(x, inputY, '#67e8f9');
  drawMarker(x, rawY, '#a78bfa');
  drawMarker(x, slewedY, '#f472b6');

  ctx.font = '800 12px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#67e8f9';
  ctx.fillText('input now', x - 8, inputY - 8);

  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#a78bfa';
  ctx.fillText('raw target', x - 8, rawY);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f472b6';
  ctx.fillText('slewed output', x - 8, slewedY + 8);
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

function formatSlewAmount(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatJitterAmount(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function slewCoefficient(deltaMs: number): number {
  if (slewAmount <= 0) {
    return 1;
  }

  const timeConstantMs = 25 + slewAmount * 1450;
  return 1 - Math.exp(-deltaMs / timeConstantMs);
}

function chooseSampleHoldEvent(timeMs: number): EventSource {
  if (manualTriggerQueued) {
    manualTriggerQueued = false;
    return 'manual';
  }

  if (takeJitteredClockEvent(timeMs)) {
    return 'clock';
  }

  return null;
}

function calculateTrackHoldEvent(timeMs: number): EventSource {
  if (manualTriggerQueued) {
    manualTriggerQueued = false;
  }

  if (takeJitteredClockEvent(timeMs)) {
    gateOpenState = !gateOpenState;
    return gateOpenState ? 'gate-open' : 'gate-close';
  }

  return null;
}

function updateRawOutput(currentInput: number, timeMs: number): EventSource {
  if (mode === 'sample-hold') {
    const eventSource = chooseSampleHoldEvent(timeMs);

    if (eventSource) {
      rawOutputVoltage = currentInput;
      lastEventTime = timeMs;
      lastEventSource = eventSource;
    }

    return eventSource;
  }

  const eventSource = calculateTrackHoldEvent(timeMs);

  if (gateOpenState) {
    rawOutputVoltage = currentInput;
  }

  if (eventSource) {
    lastEventTime = timeMs;
    lastEventSource = eventSource;
  }

  return eventSource;
}

function updateSlewedOutput(deltaMs: number): void {
  const coefficient = slewCoefficient(deltaMs);
  slewedOutputVoltage += (rawOutputVoltage - slewedOutputVoltage) * coefficient;
}

function animate(timeMs: number): void {
  ensureClockSchedule(timeMs);

  const currentInput = calculateInputVoltage(timeMs);
  const regularClock = takeRegularClockMark(timeMs);
  const deltaMs = lastFrameTime === 0 ? 16.7 : Math.min(50, timeMs - lastFrameTime);
  lastFrameTime = timeMs;

  const eventSource = updateRawOutput(currentInput, timeMs);
  updateSlewedOutput(deltaMs);

  history.push({
    input: currentInput,
    rawOutput: rawOutputVoltage,
    slewedOutput: slewedOutputVoltage,
    event: eventSource,
    regularClock,
    gateOpen: mode === 'track-hold' && gateOpenState,
  });

  while (history.length > HISTORY_LENGTH) {
    history.shift();
  }

  const visiblePoints = history.slice(-POINT_COUNT);
  const width = canvas.width;
  const height = canvas.height;

  drawGrid(width, height);
  drawRegularClockMarks(visiblePoints, width, height);
  drawGateBands(visiblePoints, width, height);
  drawOutputTrace(visiblePoints, width, height);
  drawEvents(visiblePoints, width, height);
  drawLine(visiblePoints.map((point) => point.input), width, height, '#67e8f9', 3);
  drawLine(visiblePoints.map((point) => point.rawOutput), width, height, '#a78bfa', 3, true);
  drawLine(visiblePoints.map((point) => point.slewedOutput), width, height, '#f472b6', 4);
  drawCurrentMarkers(visiblePoints, width, height);

  inputValue.value = formatVoltage(currentInput);
  rawValue.value = `Raw ${formatVoltage(rawOutputVoltage)}`;
  slewedValue.value = `Slewed ${formatVoltage(slewedOutputVoltage)}`;
  clockRateValue.value = formatClockRate(clockRateHz);
  slewAmountValue.value = formatSlewAmount(slewAmount);
  jitterAmountValue.value = formatJitterAmount(jitterAmount);

  const eventAge = timeMs - lastEventTime;
  const recentlyChanged = eventAge < 450;

  if (mode === 'sample-hold') {
    triggerState.value = recentlyChanged ? `${lastEventSource === 'manual' ? 'Manual' : 'Jittered clock'} trigger` : 'Waiting';
    clockPulseState.value = timeMs < clockPulseVisibleUntil ? 'Jittered clock pulse' : 'Jittered clock waiting';
    gateState.value = 'Gate inactive in S&H';
  } else {
    triggerState.value = gateOpenState ? 'Tracking target' : 'Holding target';
    clockPulseState.value = timeMs < clockPulseVisibleUntil ? 'Jittered gate edge' : 'Jitter drives gate';
    gateState.value = gateOpenState ? 'Gate open' : 'Gate closed';
  }

  triggerState.classList.toggle('is-triggered', mode === 'track-hold' ? gateOpenState : recentlyChanged);
  clockPulseState.classList.toggle('is-triggered', timeMs < clockPulseVisibleUntil);
  gateState.classList.toggle('is-triggered', mode === 'track-hold' && gateOpenState);

  requestAnimationFrame(animate);
}

updateModeText();
clockRateValue.value = formatClockRate(clockRateHz);
slewAmountValue.value = formatSlewAmount(slewAmount);
jitterAmountValue.value = formatJitterAmount(jitterAmount);
requestAnimationFrame(animate);
