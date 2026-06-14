# Stable app/manual boundary checkpoint v4.7

## Purpose

Record a stable checkpoint now that the app and manual match again.

No app behaviour changed in this checkpoint.

## Current working boundary

The current working audio path is:

```text
held/slewed main CV -> oscillator pitch
```

This is the only audio path.

## Confirmed current state

- **Start Audio** starts one quiet oscillator.
- **Panic / Stop Audio** stops and disconnects the oscillator safely.
- Oscillator pitch follows the held/slewed main CV.
- **Slew amount** can smooth pitch movement.
- S&H can create stepped pitch changes.
- T&H can create tracking-then-holding pitch behaviour.
- Super S&H shows related visual companion outputs.

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

`docs/MANUAL.md` has been updated to match the app boundary.

Current manual rule:

- every future user-facing app change must update `docs/MANUAL.md` in the same pass
- audio changes must update the audio / visual boundary wording
- functional control changes must update quick reference, recipes, and glossary where needed
- do not ask separately whether to update the manual

## What not to add at this checkpoint

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

v4.7 is a stable app/manual boundary checkpoint.

The project is ready for a separate Phase 5 planning issue.
