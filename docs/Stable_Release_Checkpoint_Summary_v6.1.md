# Stable release/checkpoint summary v6.1

## Purpose

Give the repo one clear stable-state summary before any future audio destination is planned.

This is a documentation-only checkpoint.

No app behaviour changed.

## What Sample Hold Lab currently is

Sample Hold Lab is a small learning app for control-voltage behaviour.

It shows how a changing control voltage can be sampled, held, tracked, slewed, and displayed.

It is still a teaching lab, not a full synth voice.

## Current working audio boundary

The only audio path is:

```text
held/slewed main CV -> oscillator pitch
```

That means the main held/slewed control voltage controls the pitch of one quiet oscillator.

No other destination is connected to sound.

## What currently works

The current stable app supports:

- LFO input source
- Noise input source
- Manual CV input source
- Sample & Hold mode
- Track & Hold mode
- Super S&H visual mode
- Manual trigger
- Clock / gate timing
- Slew amount
- Timing jitter
- Scope display
- Destination selector
- Start Audio
- Panic / Stop Audio
- one quiet oscillator
- Pitch destination feedback

## What is audio-connected

Only **Pitch** is audio-connected.

When **Start Audio** is running:

- the oscillator follows the held/slewed main CV
- S&H can create stepped pitch changes
- T&H can create tracking-then-holding pitch movement
- Slew amount can smooth pitch movement
- audio status shows main CV voltage and pitch in Hz

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

Super high and Super low do not make separate notes.

## What is not included yet

The app does not yet include:

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

## Manual state

`docs/MANUAL.md` matches the current app state.

The manual records:

- current app state v5.2
- Pitch as the only audio-connected destination
- filter cutoff, level, Super high, and Super low as visual only
- the manual-as-we-go rule

Every future user-facing app change should update the manual in the same pass.

## Stable checkpoint files leading here

The current stable state is supported by these checkpoint notes:

- `docs/Stable_App_Manual_Boundary_Checkpoint_v4.7.md`
- `docs/Phase_5_Plan_v4.8.md`
- `docs/Pitch_Demo_Test_v5.0.md`
- `docs/Stable_Pitch_Demo_Checkpoint_v5.1.md`
- `docs/Stable_Pitch_Destination_Feedback_Checkpoint_v5.3.md`
- `docs/Phase_5_Stop_Decision_v5.4.md`
- `docs/Phase_6_Plan_v6.0.md`

## Next safe direction

Do not add filter audio or level audio immediately.

The next safe issue should be a decision issue.

Recommended next issue:

```text
v6.2 — Decide next safe work direction after release summary
```

That issue should choose one of:

- manual recipe refinement
- visual refinement only
- future audio destination planning
- stable release tag/checklist planning

A future audio destination should be planned before it is implemented.

## Release/checkpoint decision

v6.1 is the stable release/checkpoint summary.

The repo now has one concise reference for the current stable state.
