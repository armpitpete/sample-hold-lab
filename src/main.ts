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
      <p class="eyebrow">Software Prototype v7.0</p>
      <h1>Sample Hold Lab</h1>
      <p class="intro">A compact visual CV lab showing Sample &amp; Hold, Track &amp; Hold, Super S&amp;H, slew, jitter, and one safe pitch-audio demo.</p>
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
      <canvas id="scope" width="960" height="300" aria-label="Visual waveform scope with voltage labels"></canvas>
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