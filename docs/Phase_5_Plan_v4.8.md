# Phase 5 plan v4.8

## Purpose

Plan the next phase after the stable app/manual boundary checkpoint.

No app behaviour changed in this planning pass.

## Current stable boundary

The app and manual now match this working audio path:

```text
held/slewed main CV -> oscillator pitch
```

This is the only audio path.

## Current stable state

- **Start Audio** starts one quiet oscillator.
- **Panic / Stop Audio** stops and disconnects the oscillator safely.
- Oscillator pitch follows the held/slewed main CV.
- **Slew amount** can smooth pitch movement.
- S&H can create stepped pitch changes.
- T&H can create tracking-then-holding pitch behaviour.
- Super S&H shows related visual companion outputs.
- Filter cutoff remains visual only.
- Level remains visual only.
- Super high remains visual only.
- Super low remains visual only.

## Manual rule

Every future user-facing app change must update `docs/MANUAL.md` in the same pass.

Do not ask separately whether to update the manual.

## Phase 5 decision

Phase 5 should start with testing and polishing the current pitch demo.

Do not add a new synth feature yet.

The current audio boundary works, but it should be checked and made easier to understand before the project adds filter audio, level audio, or more destinations.

## Next implementation issue

Create:

```text
v5.0 — Test and polish current pitch demo
```

## v5.0 target

Make the existing pitch demo clearer and safer without changing the project boundary.

Allowed work:

- test Start Audio and Panic / Stop Audio after repeated use
- test pitch movement from LFO, Noise, Manual CV, S&H, and T&H
- check whether the pitch range feels too wide, too narrow, too harsh, or too jumpy
- improve visible pitch status text if needed
- improve manual wording if the real behaviour differs from the recipes
- keep filter cutoff, level, Super high, and Super low visual only

## Not allowed in Phase 5 start

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

## Decision

The next safe move is a pitch-demo test and polish pass, not a new audio destination.
