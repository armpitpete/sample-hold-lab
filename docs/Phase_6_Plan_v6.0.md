# Phase 6 plan v6.0

## Purpose

Plan the next phase after Phase 5 stopped cleanly.

No app behaviour changed in this planning pass.

## Decision

Start Phase 6 with a release/checkpoint summary.

This is the safest next step because the pitch demo and Pitch destination feedback are now stable.

Before adding any new audio destination, the repo needs one clear stable-state reference.

## Current stable boundary

The only audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

## Current stable state

- **Start Audio** starts one quiet oscillator.
- **Panic / Stop Audio** stops and disconnects the oscillator safely.
- Pitch follows the held/slewed main CV.
- **Slew amount** can smooth pitch movement.
- Audio status shows main CV voltage and pitch in Hz.
- Destination dropdown shows **Pitch audio-connected**.
- Selecting **Pitch** shows an audio-connected badge.
- Filter cutoff remains visual only.
- Level remains visual only.
- Super high remains visual only.
- Super low remains visual only.
- `docs/MANUAL.md` matches the current app state.

## First Phase 6 issue

Create and implement:

```text
v6.1 — Create stable release/checkpoint summary
```

## v6.1 target

Create one concise release/checkpoint summary that says:

- what the app currently is
- what works
- what is audio-connected
- what remains visual only
- what is not included yet
- what the next safe work direction should be

## Do not implement in v6.0

- filter audio
- level audio
- VCF / VCA
- MIDI
- presets
- save/load
- patch cables
- modulation matrix
- extra oscillators
- effects
- new destinations

## Decision

v6.0 chooses a release/checkpoint summary as the first Phase 6 task.

No new audio destination should be added until the stable state is summarised clearly.
