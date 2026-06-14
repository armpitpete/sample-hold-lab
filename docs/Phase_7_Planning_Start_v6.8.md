# Phase 7 planning start v6.8

## Purpose

Record the decision from issue #57.

The project will not pause here.

It will move into a new planning phase.

No app behaviour changed.

## Decision

Start the next planning phase.

Use this direction:

```text
Phase 7 — future audio destination planning only
```

## Why this is the next safe move

The stable pitch demo checkpoint is complete.

The repo now has:

- stable checklist passed locally
- stable checkpoint name recorded
- final release-note document created
- manual and checkpoint docs aligned

The app is ready for a planning phase, but not for immediate new audio implementation.

## Current stable boundary

The only working audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

## Current stable state

- **Pitch** is the only audio-connected destination.
- **Start Audio** starts one quiet oscillator.
- **Panic / Stop Audio** stops and disconnects the oscillator safely.
- Pitch follows the held/slewed main CV.
- **Slew amount** can smooth pitch movement.
- Filter cutoff remains visual only.
- Level remains visual only.
- Super high remains visual only.
- Super low remains visual only.

## Phase 7 rule

Phase 7 must plan before implementing.

Do not add new audio behaviour inside the planning issue.

## Phase 7 planning candidates

Phase 7 should compare possible next audio directions:

1. filter cutoff audio planning
2. level audio planning
3. VCF/VCA boundary planning
4. extra pitch-demo polish before more sound
5. no new audio yet; manual refinement first

## Recommended first Phase 7 issue

Create:

```text
v7.0 — Plan future audio destination options
```

That issue should compare options and recommend the smallest safe next audio direction.

## Do not add in Phase 7 planning start

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

The project moves from the named stable pitch demo checkpoint into Phase 7 planning.
