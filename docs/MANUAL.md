# Sample & Hold Lab Manual

Sample & Hold Lab is an interactive visual and audible laboratory for understanding how changing voltages become sampled, held, tracked and slewed control signals.

## Start here

Open **Learn** and work through the six experiments in order:

1. Freeze a moving voltage.
2. Hear steps become pitch.
3. Turn steps into glides.
4. Compare tracking with sampling.
5. Make timing imperfect.
6. Create related companion outputs.

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

A trigger captures the current input voltage. That value remains held until another trigger occurs.

### Track & Hold

The output follows the input while the gate is open. When the gate closes, the last value remains held.

### Companion Hold

One trigger creates three mathematically related values:

```text
main = sampled value
high = main + spread
low  = main - spread
```

All three are clamped to the visible -5 V to +5 V range. Only the main output controls audio.

## Controls

- **Input source:** LFO, irregular noise, or a manual voltage.
- **Clock / gate rate:** how often automatic events occur.
- **Slew:** how slowly output travels toward the captured target. Zero means immediate movement.
- **Timing jitter:** moves automatic events away from perfectly regular timing, within a bounded range.
- **Companion spread:** distance above and below the main value in Companion Hold.
- **Trigger now:** captures immediately in Sample & Hold and Companion Hold.
- **Reset view:** clears the timeline and starts a fresh explanation.

## Audio boundary

The only audio path is:

```text
slewed main CV -> safe oscillator pitch
```

**Start audio** creates one quiet sine oscillator. **Panic / stop** stops, disconnects and closes the audio context. Pitch remains clamped between 110 Hz and 440 Hz.

The companion outputs, graph lanes and timing markers are visual only.

## What just happened?

The explanation panel describes each trigger or gate edge in plain language. It reports the captured voltage, whether tracking began or ended, and whether slew is still moving the output toward its target.

## Safe first exploration

1. Choose **LFO** and **Sample & Hold**.
2. Set slew to zero.
3. Press **Trigger now** several times.
4. Watch the input continue moving while the captured target remains flat.
5. Raise slew to about 70%.
6. Trigger again and watch the output glide.
7. Start audio only when you want to hear the same main output as pitch.
8. Press **Panic / stop** when finished.

## Project boundary

This is a focused control-voltage teaching laboratory, not a general synthesiser. It deliberately does not include patch cables, effects, multiple oscillators, a modulation matrix, MIDI, filters, amplifiers, presets or save/load.
