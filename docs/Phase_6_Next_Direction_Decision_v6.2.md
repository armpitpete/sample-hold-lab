# Phase 6 next direction decision v6.2

## Purpose

Record the decision for issue #52.

This is a planning/decision note.

No app behaviour changed.

## Decision

Use **Option D**:

```text
Stable release tag/checklist planning
```

## Why this is the next safe direction

The repo now has a stable release/checkpoint summary.

Before adding more features, the project needs a simple release/tag checklist so the current stable state can be tested, named, and protected.

This avoids drifting straight into filter audio, level audio, or a larger synth voice before the current app is properly marked as stable.

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
- `docs/Stable_Release_Checkpoint_Summary_v6.1.md` records the stable repo state.

## Next issue

Create:

```text
v6.3 — Create stable release tag/checklist plan
```

## v6.3 target

Create a checklist that can be used before tagging or naming the current stable state.

The checklist should cover:

- local pull/build check
- browser launch check
- Start Audio check
- Panic / Stop Audio check
- Pitch destination check
- visual-only boundary check
- manual/checkpoint docs check
- no accidental feature expansion

## Do not add

- app behaviour
- new audio routing
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

v6.2 chooses stable release tag/checklist planning as the next safe work direction.
