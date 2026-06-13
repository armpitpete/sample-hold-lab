# Sample Hold Lab Manual

This is the plain beginner manual for Sample Hold Lab.

It should be updated as the app changes.

## Current decision

Phase 4 stops at v2.8.

v2.9 records the decision.

Future work should move into the manual before more audio features.

## Current stable audio boundary

There is one audio path:

```text
held/slewed main CV -> oscillator pitch
```

That means the main held control voltage changes the pitch of one quiet oscillator.

## What remains visual only

These parts do not make or change sound yet:

- filter cutoff
- level
- Super high companion output
- Super low companion output

## What Sample Hold Lab is

Sample Hold Lab is a small learning app for control voltage behaviour.

It shows what happens when a changing voltage is sampled, held, tracked, slewed, and sent to a destination.

The app is not a full synth voice.

## What a control voltage is

A control voltage is a signal that controls something else.

In this app, the voltage is shown visually as a value between -5 V and +5 V.

A voltage can control pitch, filter cutoff, level, or another destination. At the moment, only pitch has an audio connection.

## What Sample & Hold does

Sample & Hold captures the input voltage at one moment.

It then holds that value until the next trigger.

In the audio demo, this can sound like stepped pitch changes.

## What Track & Hold does

Track & Hold follows the input while the gate is open.

When the gate closes, it holds the last value.

In the audio demo, this means pitch can move while tracking, then stay fixed while holding.

## What Super S&H shows

Super S&H shows one main held path and two related companion paths.

Only the main held path controls oscillator pitch.

The Super high and Super low companion outputs remain visual only.

## What the Scope shows

The Scope shows the input voltage, raw held value, slewed main output, and Super S&H companion outputs.

It is the main teaching view.

## What the visual destinations mean

The Pitch, Filter cutoff, and Level destinations show what a held CV could control.

Only pitch is connected to audio.

Filter cutoff and level remain visual demonstrations.

## What the audio demo does

The audio demo starts one quiet oscillator.

The oscillator pitch follows the held/slewed main CV.

The output is kept low and clamped for safety.

Audio starts only after pressing Start Audio.

Panic / Stop Audio stops and disconnects the oscillator.

## What not to expect yet

Do not expect:

- filter audio
- level audio
- VCF behaviour
- VCA behaviour
- effects
- MIDI
- presets
- save/load
- patch cables
- multiple oscillators
- multiple audio destinations
- full synth voice behaviour

## Manual-as-we-go rule

Before adding more audio features, improve this manual.

Each future feature should explain what changed, what the user sees, what the user hears, and what remains visual only.
