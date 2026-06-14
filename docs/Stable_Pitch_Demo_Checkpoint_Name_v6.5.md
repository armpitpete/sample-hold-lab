# Stable pitch demo checkpoint name v6.5

## Purpose

Record the chosen name for the current stable pitch demo checkpoint.

This is a documentation/decision note.

No app behaviour changed.

## Checklist result

The stable release checklist has passed locally.

Checklist file:

```text
docs/Stable_Release_Tag_Checklist_v6.3.md
```

## Chosen checkpoint name

Use:

```text
v6.5-stable-pitch-demo
```

## Current stable boundary

The only audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

## What is audio-connected

Only **Pitch** is audio-connected.

When **Start Audio** is running:

- one quiet oscillator plays
- pitch follows the held/slewed main CV
- S&H can create stepped pitch changes
- T&H can create tracking-then-holding pitch movement
- Slew amount can smooth pitch movement
- audio status shows main CV voltage and pitch in Hz

## What remains visual only

These remain visual only:

- Scope traces
- filter cutoff
- level
- Super high companion output
- Super low companion output
- timing markers
- patch summary information

Filter cutoff does not change the sound.

Level does not change the sound.

Super high and Super low do not create separate notes.

## What must not be added inside this checkpoint

Do not add:

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

The current stable pitch demo checkpoint is named:

```text
v6.5-stable-pitch-demo
```

This name can be used for a future tag or release note.
