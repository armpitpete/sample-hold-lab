# Sample & Hold Lab Manual

## Learning route

Work through the six Learn experiments before using Explore:

1. Freeze a moving voltage.
2. Hear exact 1 V/octave.
3. Turn steps into glides.
4. Compare tracking with sampling.
5. Compare continuous and quantized CV.
6. Hear and isolate low, centre and high companions.

## Signal modes

### Sample & Hold

A trigger captures the current input voltage and holds it until the next trigger.

### Track & Hold

The output follows the input while the gate is open and freezes when it closes.

### Companion Hold

```text
centre = sampled value
high   = centre + spread
low    = centre - spread
```

The three outputs are visible and audible. Use Mute or Solo to isolate each voice.

## Pitch teaching

Pitch follows exact 1 V/octave:

```text
frequency = selected 0 V reference × 2^voltage
```

Choose C3, A3, C4 or A4 as the 0 V reference. The interface always reports voltage, note name and frequency.

With Quantize to semitones off, pitch follows continuous CV. With it on, voltage is rounded to the nearest 1/12 V, producing twelve equal-tempered semitone steps per octave.

## Observation controls

- **Normal:** ordinary simulation speed.
- **Slow:** quarter speed.
- **Very slow:** one-tenth speed.
- **Pause:** freezes new simulation frames.
- **Step once:** adds one frame while paused.
- **Reset:** clears the timeline and cursors.

Slow motion affects observation timing, not the 1 V/octave pitch rule.

## Oscilloscope cursors

Choose **Place cursor A** or **Place cursor B**, then click the graph. The readout reports input, held and output voltage at that position. With both cursors present, it also reports their frame separation. Use **Clear cursors** to remove them.

## Voice controls

Sample & Hold and Track & Hold normally play only the centre voice. Companion Hold plays low, centre and high voices.

- **Mute:** removes one voice.
- **Solo:** leaves only the chosen voice audible.
- Press Solo again to return to the normal mix.

Low and high are slightly separated in stereo where the browser supports panning. All voices use low fixed gain and one shared master path. **Panic / stop** stops every oscillator and closes the audio context.

## Useful experiments

### Hear an octave

1. Select Manual CV and Sample & Hold.
2. Set manual voltage to 0 V and trigger.
3. Start audio and note the frequency.
4. Set manual voltage to +1 V and trigger again.
5. The frequency should exactly double.

### Hear quantization

1. Select LFO and Sample & Hold.
2. Start audio with quantization off.
3. Hear continuous pitch values.
4. Turn Quantize to semitones on.
5. Hear the same control signal rounded into musical steps.

### Compare Companion Hold voices

1. Select Companion Hold.
2. Set spread to 1.0 V.
3. Start audio.
4. Solo Low, Centre and High in turn.
5. Low is one octave below centre and High is one octave above, unless a CV reaches the ±5 V boundary.

## Project boundary

This is a focused control-voltage teaching laboratory. It deliberately excludes patch cables, effects, MIDI, filters, amplifiers, modulation matrices, presets and save/load.
