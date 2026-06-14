# Stable Pitch destination feedback checkpoint v5.3

## Purpose

Record a stable checkpoint now that the Pitch destination clearly shows it is audio-connected.

No app behaviour changed in this checkpoint.

## Current working boundary

The only audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

This means the existing held/slewed main CV controls the pitch of one quiet oscillator.

## Confirmed current state

- The destination dropdown shows **Pitch audio-connected**.
- Selecting **Pitch** shows an **Audio-connected destination** badge.
- Pitch helper text explains that the one quiet oscillator follows the held/slewed main CV when **Start Audio** is running.
- Audio status shows main CV voltage and pitch in Hz.
- **Start Audio** still starts one quiet oscillator.
- **Panic / Stop Audio** still stops and disconnects the oscillator safely.

## Still visual only

These remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

They do not make sound.

They do not control separate oscillators.

Filter cutoff is not a VCF yet.

Level is not a VCA yet.

## Manual status

`docs/MANUAL.md` already matches the v5.2 Pitch destination feedback.

No manual wording change was needed for this v5.3 checkpoint.

## Not added

This checkpoint does not add:

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

v5.3 is a stable Pitch destination feedback checkpoint.

The current Pitch destination feedback is clear enough to build from later.

The next issue should plan the next safe Phase 5 move before adding any new sound destination.
