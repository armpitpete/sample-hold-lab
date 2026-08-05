# Sample & Hold Lab

Sample & Hold Lab is an interactive visual and audible laboratory for understanding how changing voltages become sampled, held, tracked, slewed, measured and converted to pitch.

## Live app

https://armpitpete.github.io/sample-hold-lab/

## Completed teaching tools

- Sample & Hold, Track & Hold and Companion Hold
- LFO, noise and manual CV inputs
- exact 1 V/octave pitch tracking
- selectable 0 V reference pitch: C3, A3, C4 or A4
- live voltage, frequency and musical-note readouts
- optional semitone quantization at 12 steps per volt
- low, centre and high Companion Hold voices
- independent mute and solo controls for all three voices
- normal, quarter-speed and tenth-speed observation modes
- pause, resume and single-step simulation
- two oscilloscope measurement cursors
- shared trigger, gate, input, held and slewed-output timeline
- six guided experiments and a separate Explore mode
- deterministic model tests and validated GitHub Pages deployment

## Pitch rule

```text
frequency = selected reference frequency × 2^voltage
```

A change of +1 V always doubles frequency. A change of -1 V halves it. Quantizer mode rounds the control voltage to one of twelve semitone steps per volt before pitch conversion.

## Companion Hold

```text
centre = sampled value
high   = centre + spread
low    = centre - spread
```

A spread of 1 V places the companions exactly one octave above and below the centre unless an output reaches the visible ±5 V boundary. Mute and solo make each relationship independently audible.

## Product boundary

This remains a focused control-voltage teaching laboratory, not a general synthesiser. It excludes patch cables, effects, MIDI, filters, amplifiers, modulation matrices, presets and save/load.

## Development

```bash
npm install
npm run dev
npm run check
```

`npm run check` performs TypeScript checking, deterministic behavioural tests and the production build.

See [`docs/MANUAL.md`](docs/MANUAL.md) for the complete learning guide.
