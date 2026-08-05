# Sample & Hold Lab Manual

Sample & Hold Lab is an interactive visual and audible laboratory for understanding how changing voltages become sampled, held, tracked and slewed control signals.

## Start here

Open **Learn** and work through the six experiments in order:

1. Freeze a moving voltage.
2. Hear steps become pitch.
3. Turn steps into glides.
4. Compare tracking with sampling.
5. Make timing imperfect.
6. Hear three related companion voices.

Each experiment loads useful starting settings automatically. Use **Explore** after the behaviour makes sense.

## Read the timeline

The shared timeline has four lanes:

- **Clock / gate** — event markers and Track & Hold gate-open periods.
- **Input** — the changing voltage before capture.
- **Captured target** — the raw held value.
- **Slewed output** — the value after smoothing.

A gold vertical line marks a trigger or gate edge. In Track & Hold mode, the shaded region means the gate is open.

## Modes

### Sample & Hold

A trigger captures the current input voltage. That value remains held until another trigger occurs. Audio uses one quiet centre voice.

### Track & Hold

The output follows the input while the gate is open. When the gate closes, the last value remains held. Audio uses one quiet centre voice.

### Companion Hold

One trigger creates three mathematically related values:

```text
centre = sampled value
high   = centre + spread
low    = centre - spread
```

All three are clamped to the visible -5 V to +5 V range. When audio is running, Companion Hold maps all three values to three quiet sine voices:

```text
low companion CV    -> low voice
centre slewed CV    -> centre voice
high companion CV   -> high voice
```

The low and high voices are slightly separated left and right when stereo panning is available. The centre remains central. This separation is only an aid to hearing the relationship.

## 1 V/octave pitch

The app now uses true 1 volt per octave pitch tracking.

```text
frequency = 220 Hz × 2^voltage
```

The reference point is:

```text
0 V = A3 = 220 Hz
```

Useful reference values:

| Voltage | Frequency | Relationship |
|---:|---:|---|
| -2 V | 55 Hz | two octaves below |
| -1 V | 110 Hz | one octave below |
| 0 V | 220 Hz | reference pitch |
| +1 V | 440 Hz | one octave above |
| +2 V | 880 Hz | two octaves above |

A voltage change of exactly +1 V always doubles frequency. A change of -1 V always halves it.

This makes **Companion spread** musically direct:

- 0.5 V spread places companions half an octave from the centre.
- 1 V spread places companions exactly one octave above and below.
- 2 V spread places companions exactly two octaves above and below.

A companion output can stop moving further when it reaches the visible -5 V or +5 V limit.

## Controls

- **Input source:** LFO, irregular noise, or a manual voltage.
- **Clock / gate rate:** how often automatic events occur.
- **Slew:** how slowly output travels toward the captured target. Zero means immediate movement.
- **Timing jitter:** moves automatic events away from perfectly regular timing, within a bounded range.
- **Companion spread:** distance above and below the centre value in Companion Hold. Because pitch is 1 V/octave, the spread directly determines the octave relationship.
- **Trigger now:** captures immediately in Sample & Hold and Companion Hold.
- **Reset view:** clears the timeline and starts a fresh explanation.

## Audio behaviour and safety

**Start audio** creates the three-voice audio engine, but the selected mode decides which voices are audible:

- **Sample & Hold:** centre voice only.
- **Track & Hold:** centre voice only.
- **Companion Hold:** low, centre and high voices together.

Each voice has a low fixed gain. All voices pass through one master gain. **Panic / stop** stops and disconnects every oscillator and closes the shared audio context.

The interface shows the centre frequency at all times. In Companion Hold it also shows the low and high frequencies.

## Companion Hold listening lesson

1. Open experiment 6.
2. Set **Companion spread** to exactly **1.0 V**.
3. Press **Start audio**.
4. Hear the low voice one octave below the centre and the high voice one octave above it.
5. Move the spread to **0.5 V**. The voices move closer together.
6. Move the spread to **2.0 V**. They become two octaves apart from the centre.
7. Press **Trigger now** several times. The three voices move together because they come from one sampled centre value.
8. Switch to Sample & Hold. The companion voices become silent and only the centre remains.
9. Return to Companion Hold. All three voices return.
10. Press **Panic / stop** when finished.

## What just happened?

The explanation panel describes each trigger or gate edge in plain language. In Companion Hold it reports the low, centre and high control voltages created by the current spread.

## Project boundary

This is a focused control-voltage teaching laboratory, not a general synthesiser. The three oscillators are a deliberate teaching mechanism for Companion Hold. The project still does not include patch cables, effects, a modulation matrix, MIDI, filters, amplifiers, presets or save/load.
