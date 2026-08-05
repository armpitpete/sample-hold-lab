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

## Controls

- **Input source:** LFO, irregular noise, or a manual voltage.
- **Clock / gate rate:** how often automatic events occur.
- **Slew:** how slowly output travels toward the captured target. Zero means immediate movement.
- **Timing jitter:** moves automatic events away from perfectly regular timing, within a bounded range.
- **Companion spread:** distance above and below the centre value in Companion Hold. It changes both the visible gap and the audible pitch relationship.
- **Trigger now:** captures immediately in Sample & Hold and Companion Hold.
- **Reset view:** clears the timeline and starts a fresh explanation.

## Audio behaviour and safety

**Start audio** creates the three-voice audio engine, but the selected mode decides which voices are audible:

- **Sample & Hold:** centre voice only.
- **Track & Hold:** centre voice only.
- **Companion Hold:** low, centre and high voices together.

Every voice is clamped between 110 Hz and 440 Hz. Each voice has a low fixed gain. All voices pass through one master gain. **Panic / stop** stops and disconnects every oscillator and closes the shared audio context.

The interface shows the centre frequency at all times. In Companion Hold it also shows the low and high frequencies.

## Companion Hold listening lesson

1. Open experiment 6.
2. Press **Start audio**.
3. Listen for three related tones rather than three unrelated notes.
4. Move **Companion spread** lower. The voices move closer together.
5. Move **Companion spread** higher. The low and high voices move further from the centre.
6. Press **Trigger now** several times. The three voices move together because they come from one sampled centre value.
7. Switch to Sample & Hold. The companion voices become silent and only the centre remains.
8. Return to Companion Hold. All three voices return.
9. Press **Panic / stop** when finished.

## What just happened?

The explanation panel describes each trigger or gate edge in plain language. In Companion Hold it reports the low, centre and high control voltages created by the current spread.

## Project boundary

This is a focused control-voltage teaching laboratory, not a general synthesiser. The three oscillators are a deliberate teaching mechanism for Companion Hold. The project still does not include patch cables, effects, a modulation matrix, MIDI, filters, amplifiers, presets or save/load.
