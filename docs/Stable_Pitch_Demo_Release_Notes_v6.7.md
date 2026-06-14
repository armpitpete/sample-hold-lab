# Stable pitch demo release notes v6.7

## Release/checkpoint name

```text
v6.5-stable-pitch-demo
```

## Purpose

Record one readable release-note document for the named stable pitch demo checkpoint.

This document is for orientation before any future feature planning.

No app behaviour changed in this release-note pass.

## What this checkpoint is

This checkpoint marks Sample Hold Lab as a stable control-voltage teaching app with one safe audio demo.

The app is still a learning lab, not a full synth voice.

It teaches how control voltage can be sampled, held, tracked, slewed, shown on a scope, and used to move one oscillator pitch.

## Current audio boundary

The only audio path is:

```text
held/slewed main CV -> oscillator pitch
```

That boundary is the main rule of this checkpoint.

Do not treat any other visual destination as audio-connected.

## What works

The stable checkpoint includes:

- LFO input source
- Noise input source
- Manual CV input source
- Sample & Hold mode
- Track & Hold mode
- Super S&H visual mode
- Manual trigger
- clock / gate timing
- slew amount
- timing jitter
- scope display
- destination selector
- Start Audio
- Panic / Stop Audio
- one quiet oscillator
- Pitch destination feedback
- audio status showing main CV voltage and pitch in Hz

## What is audio-connected

Only **Pitch** is audio-connected.

When **Start Audio** is running:

- one quiet oscillator plays
- pitch follows the held/slewed main CV
- S&H can create stepped pitch changes
- T&H can create tracking-then-holding pitch movement
- Slew amount can smooth pitch movement
- repeated Start Audio does not stack oscillators
- Panic / Stop Audio stops and disconnects the oscillator safely

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

## What is not included yet

This checkpoint does not include:

- filter audio
- level audio
- VCF behaviour
- VCA behaviour
- effects
- MIDI
- presets
- save/load
- patch cables
- modulation matrix
- multiple oscillators
- multiple audio destinations
- full synth voice behaviour
- VCV Rack behaviour
- hardware simulation

## Documentation state

The manual and checkpoint notes now describe the same stable boundary.

Important docs:

- `docs/MANUAL.md`
- `docs/Stable_Release_Checkpoint_Summary_v6.1.md`
- `docs/Stable_Release_Tag_Checklist_v6.3.md`
- `docs/Stable_Pitch_Demo_Checkpoint_Name_v6.5.md`

## Safe next directions

After this checkpoint, the next work should be planned before implementation.

Safe next directions include:

- manual recipe refinement
- visual refinement only
- future audio destination planning without implementation
- release/tag housekeeping

Do not jump straight into filter audio or level audio.

## Release-note decision

This release note completes the named stable pitch demo checkpoint documentation.

The project is ready to pause here or move into a new planning phase.
