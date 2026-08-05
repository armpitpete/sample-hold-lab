# Sample & Hold Lab

Sample & Hold Lab is an interactive visual and audible laboratory for understanding how changing voltages become sampled, held, tracked and slewed control signals.

## Live app

https://armpitpete.github.io/sample-hold-lab/

## What it teaches

The app makes the complete control path visible:

```text
changing input -> trigger or gate -> captured target -> slew -> visible output -> 1 V/octave pitch
```

It includes:

- Sample & Hold
- Track & Hold
- Companion Hold with explicit centre/high/low mathematics
- LFO, noise and manual inputs
- bounded timing jitter
- a shared event timeline with trigger and gate markers
- captured-point and held-value readouts
- live plain-language event explanations
- six guided experiments
- a separate Explore mode
- one centre voice for Sample & Hold and Track & Hold
- three related low, centre and high voices for Companion Hold
- exact 1 V/octave pitch tracking
- one shared master safety path and panic shutdown
- deterministic model tests
- pull-request validation before deployment

## Product boundary

This is a focused learning laboratory, not a general synthesiser. The three Companion Hold voices exist only to make its three related control paths audible. The project still excludes patch cables, effects, MIDI, filters, amplifiers, modulation matrices, presets and save/load.

## Companion Hold rule

```text
centre = sampled value
high   = centre + spread
low    = centre - spread
```

All three outputs are clamped to -5 V through +5 V. In Companion Hold, all three drive quiet pitch voices. In Sample & Hold and Track & Hold, only the centre voice is audible.

## 1 V/octave pitch rule

The audio mapping follows the standard exponential relationship:

```text
frequency = 220 Hz × 2^voltage
```

The reference is:

```text
0 V = A3 = 220 Hz
```

Therefore:

- -2 V = 55 Hz
- -1 V = 110 Hz
- 0 V = 220 Hz
- +1 V = 440 Hz
- +2 V = 880 Hz

Every increase of exactly 1 V doubles frequency. Every decrease of exactly 1 V halves frequency. Companion spread is measured in volts, so a spread of 1 V places the high and low voices exactly one octave above and below the centre unless a companion output reaches the visible ±5 V limit.

## Audio safety

Each oscillator has a low fixed gain and all voices pass through one master gain. **Panic / stop** stops and disconnects every oscillator and closes the audio context.

## Development

```bash
npm install
npm run dev
npm run check
```

`npm run check` performs TypeScript checking, deterministic behavioural tests and the production build.

## Manual

See [`docs/MANUAL.md`](docs/MANUAL.md).
