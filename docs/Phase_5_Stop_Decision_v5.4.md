# Phase 5 stop decision v5.4

## Purpose

Record the decision for issue #49.

This is a planning/decision note.

No app behaviour changed.

## Decision

Phase 5 stops here.

Use **Option A**:

```text
Stop Phase 5 after the stable Pitch destination feedback checkpoint.
```

## Why Phase 5 stops here

Phase 5 has completed its purpose.

It has:

- tested and polished the current pitch demo
- recorded a stable pitch demo checkpoint
- improved Pitch destination feedback
- recorded a stable Pitch destination feedback checkpoint

The current pitch demo is stable enough to build from later.

The Pitch destination is now clearly marked as the only audio-connected destination.

## Current working boundary

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

## What not to add inside Phase 5

Do not add:

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

## Next move

Move into a new planning phase before adding any new audio destination.

The next issue should be:

```text
v6.0 — Plan next phase before new audio destinations
```

That planning issue should decide whether the next phase should focus on:

- more testing and documentation
- a release/checkpoint summary
- visual refinement
- or a carefully scoped future audio destination

It should not immediately implement filter audio or level audio.
