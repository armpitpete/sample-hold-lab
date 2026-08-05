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
- one centre voice for Sample & Hold and Track & Hold
- three related low, centre and high voices for Companion Hold
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

## Audio safety

Pitch is clamped to 110–440 Hz for every voice. Each oscillator has a low fixed gain and all voices pass through one master gain. **Panic / stop** stops and disconnects every oscillator and closes the audio context.

## Development

```bash
npm install
npm run dev
npm run check
```

`npm run check` performs TypeScript checking, deterministic behavioural tests and the production build.

## Manual

See [`docs/MANUAL.md`](docs/MANUAL.md).
