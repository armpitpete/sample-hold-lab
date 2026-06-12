import './styles.css';

type Mode = 'sample-hold' | 'track-hold';
type EventSource = 'manual' | 'clock' | 'gate-open' | 'gate-close' | null;

type SamplePoint = {
  input: number;
  output: number;
  event: EventSource;
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
      <p class="eyebrow">Software Prototype v0.4</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A fixed visual patch for comparing Sample & Hold with Track & Hold before adding slew, jitter, audio, or free patching.</p>
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
        <p id="modeDescription">S&H captures on trigger, then holds.</p>

        <fieldset class="mode-switch" aria-label="Hold mode">
          <legend>Mode</legend>
          <label><input type="radio" name="mode" value="sample-hold" checked /> S&amp;H</label>
          <label><input type="radio" name="mode" value="track-hold" /> T&amp;H</label>
        </fieldset>

        <output id="heldValue">0.00 V</output>
      </article>

      <div class="cable output-cable" aria-hidden="true">
        <span>Output CV</span>
      </div>

      <article class="module-card destination-module">
        <span class="module-label">Destination</span>
        <h2>Scope</h2>
        <p>Shows input voltage and held/tracked output.</p>
        <output id="triggerState">Waiting</output>
      </article>

      <article class="module-card trigger-module">
        <span class="module-label">Event sources</span>
        <h2>Trigger / Gate</h2>
        <p>Clock triggers S&amp;H. The same clock opens and closes the T&amp;H gate.</p>

        <div class="event-control-group">
          <button id="triggerButton" type="button">Manual trigger</button>
        </div>

        <label class="clock-control" for="clockRate">
          <span>Clock / gate rate</span>
          <input id="clockRate" type="range" min="0.25" max="4" step="0.25" value="1" />
          <output id="clockRateValue">1.00 Hz</output>
        </label>

        <output id="clockPulseState" class="clock-pulse-state">Clock waiting</output>
        <output id="gateState" class="gate-state">Gate closed</output>
      </article>

      <div class="cable trigger-cable" aria-hidden="true">
        <span>Trigger / Gate</span>
      </div>
    </section>

    <section class="scope-panel" aria-label="Voltage scope">
      <div class="scope-header">
        <div>
          <h2>Scope</h2>
          <p id="scopeDescription">S&H mode: output changes on manual trigger or clock pulse.</p>
        </div>
        <div class="legend" aria-label="Scope legend">
          <span><i class="legend-line input-line"></i>Input LFO</span>
          <span><i class="legend-line held-line"></i>Output</span>
          <span><i class="legend-pulse clock-pulse-line"></i>Clock trigger</span>
          <span><i class="legend-pulse manual-pulse-line"></i>Manual trigger</span>
          <span><i class="legend-gate"></i>Gate open</span>
        </div>
      </div>
      <canvas id="scope" width="960" height="360" aria-label="Visual waveform scope with voltage labels"></canvas>
    </section>

    <section class="rule-card">
      <h2>Core rule</h2>
      <p><strong>S&amp;H</strong>: capture then hold. <strong>T&amp;H</strong>: follow while gate is open, hold when gate closes.</p>
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
const gateState = document.querySelector<HTMLOutputElement>('#gateState');
const modeDescription = document.querySelector<HTMLParagraphElement>('#modeDescription');
const scopeDescription = document.querySelector<HTMLParagraphElement>('#scopeDescription');
const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]');

if (!canvas || !triggerButton || !clockRateInput || !inputValue || !heldValue || !triggerState || !clockRateValue || !clockPulseState || !gateState || !modeDescription || !scopeDescription) {
  throw new Error('Required app elements were not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas context not available');
}

let mode: Mode = 'sample-hold';
let outputVoltage = 0;
let lastEventTime = 0;
let lastClockPulseTime = 0;
let clockPulseVisibleUntil = 0;
let clockRateHz = DEFAULT_CLOCK_RATE_HZ;
let manualTriggerQueued = false;
let previousGateOpen = false;
let lastEventSource: EventSource = null;
const history: SamplePoint[] = [];

triggerButton.addEventListener('click', () => {
  manualTriggerQueued = true;
});

clockRateInput.addEventListener('input', () => {
  clockRateHz = Number(clockRateInput.value);
  clockRateValue.value = formatClockRate(clockRateHz);
});

modeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    mode = input.value as Mode;
    history.length = 0;
    lastEventSource = null;
    lastEventTime = 0;
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

function isGateOpen(timeMs: number): boolean {
  const phase = timeMs % (clockIntervalMs() * 2);
  return phase < clockIntervalMs();
}

function updateModeText(): void {
  if (mode === 'sample-hold') {
    modeDescription.textContent = 'S&H captures on trigger, then holds.';
    scopeDescription.textContent = 'S&H mode: output changes on manual trigger or clock pulse.';
    return;
  }

  modeDescription.textContent = 'T&H follows while gate is open, then holds.';
  scopeDescription.textContent = 'T&H mode: output follows during gate-open areas and holds during gate-closed areas.';
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
    const y = voltageToY(point.output, height);

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
      return { strong: '#facc15', soft: 'rgba(250, 204, 21, 0.35)', label: 'clock trigger' };
    case 'gate-open':
      return { strong: '#22c55e', soft: 'rgba(34, 197, 94, 0.35)', label: 'gate open' };
    case 'gate-close':
      return { strong: '#60a5fa', soft: 'rgba(96, 165, 250, 0.35)', label: 'gate closed' };
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
  const outputY = voltageToY(latest.output, height);

  drawMarker(x, inputY, '#67e8f9');
  drawMarker(x, outputY, '#f472b6');

  ctx.font = '800 12px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#67e8f9';
  ctx.fillText('input now', x - 8, inputY - 8);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f472b6';
  ctx.fillText(mode === 'track-hold' ? 'T&H output' : 'S&H output', x - 8, outputY + 8);
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

function chooseSampleHoldEvent(timeMs: number): EventSource {
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

function calculateTrackHoldEvent(gateOpen: boolean): EventSource {
  if (manualTriggerQueued) {
    manualTriggerQueued = false;
  }

  if (gateOpen !== previousGateOpen) {
    previousGateOpen = gateOpen;
    return gateOpen ? 'gate-open' : 'gate-close';
  }

  return null;
}

function updateOutput(currentInput: number, timeMs: number, gateOpen: boolean): EventSource {
  if (mode === 'sample-hold') {
    const eventSource = chooseSampleHoldEvent(timeMs);

    if (eventSource) {
      outputVoltage = currentInput;
      lastEventTime = timeMs;
      lastEventSource = eventSource;
    }

    return eventSource;
  }

  const eventSource = calculateTrackHoldEvent(gateOpen);

  if (gateOpen) {
    outputVoltage = currentInput;
  }

  if (eventSource) {
    lastEventTime = timeMs;
    lastEventSource = eventSource;
  }

  return eventSource;
}

function animate(timeMs: number): void {
  const currentInput = calculateInputVoltage(timeMs);
  const gateOpen = isGateOpen(timeMs);
  const eventSource = updateOutput(currentInput, timeMs, gateOpen);

  history.push({
    input: currentInput,
    output: outputVoltage,
    event: eventSource,
    gateOpen: mode === 'track-hold' && gateOpen,
  });

  while (history.length > HISTORY_LENGTH) {
    history.shift();
  }

  const visiblePoints = history.slice(-POINT_COUNT);
  const width = canvas.width;
  const height = canvas.height;

  drawGrid(width, height);
  drawGateBands(visiblePoints, width, height);
  drawHeldStepping(visiblePoints, width, height);
  drawEvents(visiblePoints, width, height);
  drawLine(visiblePoints.map((point) => point.input), width, height, '#67e8f9', 3);
  drawLine(visiblePoints.map((point) => point.output), width, height, '#f472b6', 4);
  drawCurrentMarkers(visiblePoints, width, height);

  inputValue.value = formatVoltage(currentInput);
  heldValue.value = formatVoltage(outputVoltage);
  clockRateValue.value = formatClockRate(clockRateHz);

  const eventAge = timeMs - lastEventTime;
  const recentlyChanged = eventAge < 450;

  if (mode === 'sample-hold') {
    triggerState.value = recentlyChanged ? `${lastEventSource === 'manual' ? 'Manual' : 'Clock'} trigger` : 'Waiting';
    clockPulseState.value = timeMs < clockPulseVisibleUntil ? 'Clock pulse' : 'Clock waiting';
    gateState.value = 'Gate inactive in S&H';
  } else {
    triggerState.value = gateOpen ? 'Tracking input' : 'Holding value';
    clockPulseState.value = 'Clock drives gate';
    gateState.value = gateOpen ? 'Gate open' : 'Gate closed';
  }

  triggerState.classList.toggle('is-triggered', mode === 'track-hold' ? gateOpen : recentlyChanged);
  clockPulseState.classList.toggle('is-triggered', timeMs < clockPulseVisibleUntil);
  gateState.classList.toggle('is-triggered', mode === 'track-hold' && gateOpen);

  requestAnimationFrame(animate);
}

updateModeText();
clockRateValue.value = formatClockRate(clockRateHz);
requestAnimationFrame(animate);
