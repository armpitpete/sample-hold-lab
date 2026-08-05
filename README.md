# Sample & Hold Lab

Sample & Hold Lab is an interactive visual and audible laboratory for understanding how changing voltages become sampled, held, tracked and slewed control signals.

## Live app

https://armpitpete.github.io/sample-hold-lab/

## What it teaches

The app makes the complete control path visible:

```text
changing input -> trigger or gate -> captured target -> slew -> visible output -> safe pitch mapping
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
- one quiet oscillator controlled only by the slewed main output
- panic audio shutdown
- deterministic model tests
- pull-request validation before deployment

## Product boundary

This is a focused learning laboratory, not a general synthesiser. It deliberately excludes patch cables, multiple oscillators, effects, MIDI, filters, amplifiers, modulation matrices, presets and save/load.

## Companion Hold rule

```text
main = sampled value
high = main + spread
low  = main - spread
```

All outputs are clamped to -5 V through +5 V. Only the main output controls audio.

## Audio safety

The only audio path is:

```text
slewed main CV -> oscillator pitch
```

Pitch is clamped to 110–440 Hz. The oscillator uses a quiet fixed gain. **Panic / stop** stops and disconnects the oscillator and closes its audio context.

## Development

```bash
npm install
npm run dev
npm run check
```

`npm run check` performs TypeScript checking, deterministic behavioural tests and the production build.

## Manual

See [`docs/MANUAL.md`](docs/MANUAL.md).
