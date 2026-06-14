# Pitch demo test v5.0

## Purpose

Record the v5.0 pitch-demo test and polish pass.

This pass keeps the existing audio boundary:

```text
held/slewed main CV -> oscillator pitch
```

No new audio destinations were added.

## Source inspection result

The current audio module keeps the safe structure:

- **Start Audio** creates or resumes the Web Audio context.
- **Start Audio** stops any previous oscillator before starting a new one.
- One quiet sine oscillator is used.
- Output gain remains low.
- **Panic / Stop Audio** stops pitch updates, stops the oscillator, and disconnects the gain path.
- Pitch reads from the existing `#slewedValue` output.
- Pitch is clamped from `-5 V` to `+5 V`.

## v5.0 polish

The visible audio status text was made clearer.

It now shows:

```text
Audio running · main CV 0.00 V → 220 Hz
```

The exact voltage and Hz values change while audio is running.

This makes it easier to see that the audio follows the main held/slewed CV only.

## Test checklist

Test locally:

- Start Audio after page load
- Panic / Stop Audio after Start Audio
- Start Audio after Panic / Stop Audio
- repeated Start Audio presses
- LFO into S&H with audio running
- Noise into S&H with audio running
- Manual CV into S&H with audio running
- T&H with audio running
- Slew amount changing while audio is running

## Expected behaviour

- Start Audio makes one quiet oscillator.
- Panic / Stop Audio silences it.
- Repeated Start Audio does not stack oscillators.
- Pitch follows the held/slewed main CV.
- Slew amount smooths pitch movement.
- Audio status shows main CV voltage and Hz.

## Still visual only

These remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

## Not added

This pass does not add:

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

## Manual update

`docs/MANUAL.md` was updated in the same pass.
