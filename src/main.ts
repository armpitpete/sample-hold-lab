import './styles.css';

type Mode = 'sample-hold' | 'track-hold' | 'super-sample-hold';
type InputSource = 'lfo' | 'noise-placeholder' | 'manual-cv-placeholder';
type EventSource = 'manual' | 'clock' | 'gate-open' | 'gate-close' | null;

type SamplePoint = {
  input: number;
  rawMain: number;
  slewedMain: number;
  rawHigh: number;
  slewedHigh: number;
  rawLow: number;
  slewedLow: number;
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
const DEFAULT_MANUAL_CV_VOLTS = 0;
const SUPER_SPREAD_VOLTS = 0.9;
const NOISE_UPDATE_INTERVAL_MS = 90;
const NOISE_SMOOTHING_AMOUNT = 0.18;
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
      <p class="eyebrow">Software Prototype v1.2</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A fixed visual patch showing what Super S&amp;H adds compared with normal Sample &amp; Hold: several related held control paths from one trigger.</p>
    </header>

    <section class="patch-flow" aria-label="Limited patch signal flow">
      <article class="module-card source-module">
        <span class="module-label">Voltage source</span>
        <h2 id="inputSourceTitle">LFO</h2>
        <p id="inputSourceDescription">Creates a continuously changing voltage.</p>

        <label class="source-select-control" for="inputSourceSelect">
          <span>Input source</span>
          <select id="inputSourceSelect">
            <option value="lfo" selected>LFO</option>
            <option value="noise-placeholder">Noise</option>
            <option value="manual-cv-placeholder">Manual CV</option>
          </select>
        </label>

        <label class="manual-cv-control" id="manualCvControl" for="manualCvInput" hidden>
          <span>Manual CV</span>
          <input id="manualCvInput" type="range" min="-5" max="5" step="0.1" value="0" />
          <output id="manualCvValue">0.00 V</output>
        </label>

        <output id="inputValue">0.00 V</output>
        <output id="inputSourceStatus" class="source-status">LFO active</output>
      </article>

      <div class="cable cv-cable" aria-hidden="true">
        <span>CV</span>
      </div>

      <article class="module-card processor-module">
        <span class="module-label">Processor</span>
        <h2>Sample / Track / Super Hold</h2>
        <p id="modeDescription">S&amp;H captures one raw target. Slew smooths the output toward it.</p>

        <fieldset class="mode-switch" aria-label="Hold mode">
          <legend>Mode</legend>
          <label><input type="radio" name="mode" value="sample-hold" checked /> S&amp;H</label>
          <label><input type="radio" name="mode" value="track-hold" /> T&amp;H</label>
          <label><input type="radio" name="mode" value="super-sample-hold" /> Super S&amp;H</label>
        </fieldset>

        <output id="rawValue">Raw 0.00 V</output>
        <output id="slewedValue">Slewed 0.00 V</output>
        <output id="superValue">Super off</output>
      </article>

      <div class="cable output-cable" aria-hidden="true">
        <span>Related CV</span>
      </div>

      <article class="module-card destination-module">
        <span class="module-label">Destination</span>
        <h2>Scope</h2>
        <p>Shows normal output and Super S&amp;H companion outputs.</p>
        <output id="triggerState">Waiting</output>
      </article>

      <article class="module-card trigger-module">
        <span class="module-label">Event sources</span>
        <h2>Trigger / Gate / Slew / Jitter</h2>
        <p>Clock timing can jitter. Super S&amp;H uses one trigger to create related visual outputs.</p>

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
        <output id="gateState" class="gate-state">Gate inactive</output>
      </article>

      <div class="cable trigger-cable" aria-hidden="true">
        <span>Trigger / Gate</span>
      </div>
    </section>

    <section class="scope-panel" aria-label="Voltage scope">
      <div class="scope-header">
        <div>
          <h2>Scope</h2>
          <p id="scopeDescription">S&amp;H mode: one held/slewed output from each trigger.</p>
        </div>
        <div class="legend" aria-label="Scope legend">
          <span><i class="legend-line input-line"></i><span id="inputLegendLabel">Input LFO</span></span>
          <span><i class="legend-line raw-line"></i>Raw main</span>
          <span><i class="legend-line held-line"></i>Slewed main</span>
          <span><i class="legend-line super-high-line"></i>Super high</span>
          <span><i class="legend-line super-low-line"></i>Super low</span>
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
      <p><strong>Normal S&amp;H</strong> creates one held/slewed path. <strong>Super S&amp;H</strong> shows several related held/slewed paths from the same trigger.</p>
    </section>
  </section>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#scope');
const triggerButton = document.querySelector<HTMLButtonElement>('#triggerButton');
const clockRateInput = document.querySelector<HTMLInputElement>('#clockRate');
const slewAmountInput = document.querySelector<HTMLInputElement>('#slewAmount');
const jitterAmountInput = document.querySelector<HTMLInputElement>('#jitterAmount');
const inputSourceSelect = document.querySelector<HTMLSelectElement>('#inputSourceSelect');
const manualCvControl = document.querySelector<HTMLLabelElement>('#manualCvControl');
const manualCvInput = document.querySelector<HTMLInputElement>('#manualCvInput');
const manualCvValue = document.querySelector<HTMLOutputElement>('#manualCvValue');
const inputSourceTitle = document.querySelector<HTMLHeadingElement>('#inputSourceTitle');
const inputSourceDescription = document.querySelector<HTMLParagraphElement>('#inputSourceDescription');
const inputSourceStatus = document.querySelector<HTMLOutputElement>('#inputSourceStatus');
const inputLegendLabel = document.querySelector<HTMLSpanElement>('#inputLegendLabel');
const inputValue = document.querySelector<HTMLOutputElement>('#inputValue');
const rawValue = document.querySelector<HTMLOutputElement>('#rawValue');
const slewedValue = document.querySelector<HTMLOutputElement>('#slewedValue');
const superValue = document.querySelector<HTMLOutputElement>('#superValue');
const triggerState = document.querySelector<HTMLOutputElement>('#triggerState');
const clockRateValue = document.querySelector<HTMLOutputElement>('#clockRateValue');
const slewAmountValue = document.querySelector<HTMLOutputElement>('#slewAmountValue');
const jitterAmountValue = document.querySelector<HTMLOutputElement>('#jitterAmountValue');
const clockPulseState = document.querySelector<HTMLOutputElement>('#clockPulseState');
const gateState = document.querySelector<HTMLOutputElement>('#gateState');
const modeDescription = document.querySelector<HTMLParagraphElement>('#modeDescription');
const scopeDescription = document.querySelector<HTMLParagraphElement>('#scopeDescription');
const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]');

if (!canvas || !triggerButton || !clockRateInput || !slewAmountInput || !jitterAmountInput || !inputSourceSelect || !manualCvControl || !manualCvInput || !manualCvValue || !inputSourceTitle || !inputSourceDescription || !inputSourceStatus || !inputLegendLabel || !inputValue || !rawValue || !slewedValue || !superValue || !triggerState || !clockRateValue || !slewAmountValue || !jitterAmountValue || !clockPulseState || !gateState || !modeDescription || !scopeDescription) {
  throw new Error('Required app elements were not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas context not available');
}

let mode: Mode = 'sample-hold';
let inputSource: InputSource = 'lfo';
let manualCvVoltage = DEFAULT_MANUAL_CV_VOLTS;
let visualNoiseVoltage = 0;
let noiseTargetVoltage = 0;
let nextNoiseTargetTime = 0;
let rawMainVoltage = 0;
let rawHighVoltage = 0;
let rawLowVoltage = 0;
let slewedMainVoltage = 0;
let slewedHighVoltage = 0;
let slewedLowVoltage = 0;
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

manualCvInput.addEventListener('input', () => {
  manualCvVoltage = Number(manualCvInput.value);
  manualCvValue.value = formatVoltage(manualCvVoltage);
});

inputSourceSelect.addEventListener('change', () => {
  inputSource = inputSourceSelect.value as InputSource;
  history.length = 0;
  lastEventSource = null;
  lastEventTime = 0;
  gateOpenState = false;
  clockScheduleNeedsReset = true;
  resetNoiseSource();
  updateInputSourceText();
  updateManualCvControl();
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
  if (inputSource === 'lfo') {
    return calculateLfoInputVoltage(timeMs);
  }

  if (inputSource === 'noise-placeholder') {
    return calculateNoiseInputVoltage(timeMs);
  }

  return manualCvVoltage;
}

function calculateLfoInputVoltage(timeMs: number): number {
  const slowWave = Math.sin(timeMs / 850);
  const gentleMovement = Math.sin(timeMs / 2300) * 0.28;
  return clamp(slowWave * 3.6 + gentleMovement, -5, 5);
}

function calculateNoiseInputVoltage(timeMs: number): number {
  if (nextNoiseTargetTime === 0 || timeMs >= nextNoiseTargetTime) {
    noiseTargetVoltage = Math.random() * 10 - 5;
    nextNoiseTargetTime = timeMs + NOISE_UPDATE_INTERVAL_MS;
  }

  visualNoiseVoltage += (noiseTargetVoltage - visualNoiseVoltage) * NOISE_SMOOTHING_AMOUNT;
  return clamp(visualNoiseVoltage, -5, 5);
}

function resetNoiseSource(): void {
  visualNoiseVoltage = 0;
  noiseTargetVoltage = 0;
  nextNoiseTargetTime = 0;
}

function updateInputSourceText(): void {
  if (inputSource === 'lfo') {
    inputSourceTitle.textContent = 'LFO';
    inputSourceDescription.textContent = 'Creates a continuously changing voltage.';
    inputSourceStatus.value = 'LFO active';
    inputLegendLabel.textContent = 'Input LFO';
    return;
  }

  if (inputSource === 'noise-placeholder') {
    inputSourceTitle.textContent = 'Noise';
    inputSourceDescription.textContent = 'Creates an irregular changing visual voltage.';
    inputSourceStatus.value = 'Noise active';
    inputLegendLabel.textContent = 'Input noise';
    return;
  }

  inputSourceTitle.textContent = 'Manual CV';
  inputSourceDescription.textContent = 'Creates a user-controlled visual voltage.';
  inputSourceStatus.value = 'Manual CV active';
  inputLegendLabel.textContent = 'Input manual CV';
}

function updateManualCvControl(): void {
  manualCvControl.hidden = inputSource !== 'manual-cv-placeholder';
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
    modeDescription.textContent = 'S&H captures one raw target. Slew smooths the output toward it.';
    scopeDescription.textContent = 'S&H mode: one held/slewed output from each trigger.';
    return;
  }

  if (mode === 'track-hold') {
    modeDescription.textContent = 'T&H follows while gate is open, then holds when gate closes.';
    scopeDescription.textContent = 'T&H mode: output follows during gate-open areas and holds during gate-closed areas.';
    return;
  }

  modeDescription.textContent = 'Super S&H captures one main target and two related companion targets from the same trigger.';
  scopeDescription.textContent = 'Super S&H mode: one trigger creates three related held/slewed visual outputs.';
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
    const y = voltageToY(point.slewedMain, height);

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
  const rawY = voltageToY(latest.rawMain, height);
  const slewedY = voltageToY(latest.slewedMain, height);

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
  ctx.fillText('raw main', x - 8, rawY);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f472b6';
  ctx.fillText('slewed main', x - 8, slewedY + 8);

  if (mode === 'super-sample-hold') {
    const highY = voltageToY(latest.slewedHigh, height);
    const lowY = voltageToY(latest.slewedLow, height);
    drawMarker(x, highY, '#22c55e');
    drawMarker(x, lowY, '#60a5fa');
    ctx.fillStyle = '#22c55e';
    ctx.fillText('super high', x - 8, highY - 8);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('super low', x - 8, lowY + 8);
  }
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

function captureMainTarget(currentInput: number): void {
  rawMainVoltage = currentInput;

  if (mode === 'super-sample-hold') {
    rawHighVoltage = clamp(currentInput + SUPER_SPREAD_VOLTS, -5, 5);
    rawLowVoltage = clamp(currentInput - SUPER_SPREAD_VOLTS, -5, 5);
  } else {
    rawHighVoltage = rawMainVoltage;
    rawLowVoltage = rawMainVoltage;
  }
}

function updateRawOutput(currentInput: number, timeMs: number): EventSource {
  if (mode === 'track-hold') {
    const eventSource = calculateTrackHoldEvent(timeMs);

    if (gateOpenState) {
      captureMainTarget(currentInput);
    }

    if (eventSource) {
      lastEventTime = timeMs;
      lastEventSource = eventSource;
    }

    return eventSource;
  }

  const eventSource = chooseSampleHoldEvent(timeMs);

  if (eventSource) {
    captureMainTarget(currentInput);
    lastEventTime = timeMs;
    lastEventSource = eventSource;
  }

  return eventSource;
}

function updateSlewedOutput(deltaMs: number): void {
  const coefficient = slewCoefficient(deltaMs);
  slewedMainVoltage += (rawMainVoltage - slewedMainVoltage) * coefficient;
  slewedHighVoltage += (rawHighVoltage - slewedHighVoltage) * coefficient;
  slewedLowVoltage += (rawLowVoltage - slewedLowVoltage) * coefficient;
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
    rawMain: rawMainVoltage,
    slewedMain: slewedMainVoltage,
    rawHigh: rawHighVoltage,
    slewedHigh: slewedHighVoltage,
    rawLow: rawLowVoltage,
    slewedLow: slewedLowVoltage,
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
  drawLine(visiblePoints.map((point) => point.rawMain), width, height, '#a78bfa', 3, true);
  drawLine(visiblePoints.map((point) => point.slewedMain), width, height, '#f472b6', 4);

  if (mode === 'super-sample-hold') {
    drawLine(visiblePoints.map((point) => point.slewedHigh), width, height, '#22c55e', 3);
    drawLine(visiblePoints.map((point) => point.slewedLow), width, height, '#60a5fa', 3);
  }

  drawCurrentMarkers(visiblePoints, width, height);

  inputValue.value = formatVoltage(currentInput);
  rawValue.value = `Raw ${formatVoltage(rawMainVoltage)}`;
  slewedValue.value = `Slewed ${formatVoltage(slewedMainVoltage)}`;
  slewedValue.dataset.voltage = slewedMainVoltage.toFixed(4);
  superValue.value = mode === 'super-sample-hold'
    ? `Super +${formatVoltage(rawHighVoltage)} / ${formatVoltage(rawLowVoltage)}`
    : 'Super off';
  clockRateValue.value = formatClockRate(clockRateHz);
  slewAmountValue.value = formatSlewAmount(slewAmount);
  jitterAmountValue.value = formatJitterAmount(jitterAmount);

  const eventAge = timeMs - lastEventTime;
  const recentlyChanged = eventAge < 450;

  if (mode === 'track-hold') {
    triggerState.value = gateOpenState ? 'Tracking target' : 'Holding target';
    clockPulseState.value = timeMs < clockPulseVisibleUntil ? 'Jittered gate edge' : 'Jitter drives gate';
    gateState.value = gateOpenState ? 'Gate open' : 'Gate closed';
  } else {
    const modeLabel = mode === 'super-sample-hold' ? 'Super' : 'S&H';
    triggerState.value = recentlyChanged ? `${modeLabel} ${lastEventSource === 'manual' ? 'manual' : 'jittered'} trigger` : 'Waiting';
    clockPulseState.value = timeMs < clockPulseVisibleUntil ? 'Jittered clock pulse' : 'Jittered clock waiting';
    gateState.value = 'Gate inactive';
  }

  triggerState.classList.toggle('is-triggered', mode === 'track-hold' ? gateOpenState : recentlyChanged);
  clockPulseState.classList.toggle('is-triggered', timeMs < clockPulseVisibleUntil);
  gateState.classList.toggle('is-triggered', mode === 'track-hold' && gateOpenState);

  requestAnimationFrame(animate);
}

updateInputSourceText();
updateManualCvControl();
manualCvValue.value = formatVoltage(manualCvVoltage);
clockRateValue.value = formatClockRate(clockRateHz);
slewAmountValue.value = formatSlewAmount(slewAmount);
jitterAmountValue.value = formatJitterAmount(jitterAmount);
slewedValue.dataset.voltage = slewedMainVoltage.toFixed(4);
requestAnimationFrame(animate);
