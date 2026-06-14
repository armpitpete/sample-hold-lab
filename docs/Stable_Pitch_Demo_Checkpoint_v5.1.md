# Stable pitch demo checkpoint v5.1

## Purpose

Record a stable checkpoint now that the v5.0 pitch demo works.

No app behaviour changed in this checkpoint.

## Current working boundary

The only audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

This means the existing held/slewed main CV controls the pitch of one quiet oscillator.

## Confirmed current state

- **Start Audio** starts one quiet oscillator.
- **Panic / Stop Audio** stops and disconnects the oscillator safely.
- Repeated **Start Audio** presses do not stack oscillators.
- Pitch follows the held/slewed main CV.
- **Slew amount** can smooth pitch movement.
- Audio status shows main CV voltage and pitch in Hz.
- LFO into S&H works with pitch audio.
- Noise into S&H works with pitch audio.
- Manual CV into S&H works with pitch audio.
- T&H works with pitch audio.

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

`docs/MANUAL.md` already matches the v5.0 pitch demo behaviour.

No manual wording change was needed for this v5.1 checkpoint.

## Not added

This checkpoint does not add:

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

v5.1 is a stable pitch-demo checkpoint.

The current pitch demo is safe enough to build from later.

The next issue should choose one small Phase 5 continuation step, not jump straight into filter audio or level audio.
