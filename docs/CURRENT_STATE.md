# Sample & Hold Lab — Current State

Status: completed teaching laboratory; release reconciliation in progress.

Canonical baseline before this reconciliation branch:

```text
d59d3a7a8d7a292cdc46e33c9eae874b378e92b2
```

Package version: `3.0.0`.

## What the product is

Sample & Hold Lab is a focused visual and audible control-voltage teaching laboratory. It is not a general synthesiser.

## Completed behaviour

- Sample & Hold
- Track & Hold
- Companion Hold
- LFO, noise and manual CV inputs
- exact 1 V/octave pitch mapping
- selectable 0 V reference pitches: C3, A3, C4 and A4
- live voltage, note-name and frequency readouts
- optional twelve-semitone-per-volt quantization
- low, centre and high Companion Hold voices
- independent mute and solo controls
- normal, quarter-speed and tenth-speed observation
- pause, resume and single-step simulation
- two oscilloscope measurement cursors
- trigger, gate, input, held and slewed-output timeline
- six guided Learn experiments
- separate Explore mode
- deterministic model tests
- TypeScript validation
- production build validation
- GitHub Pages deployment

## Product boundary

The project deliberately excludes:

- patch cables
- effects
- MIDI
- filters
- amplifiers
- modulation matrices
- presets
- save/load

No new Sample & Hold Lab feature work should begin until the completed product has passed the release and external-user acceptance gates.

## Repository reconciliation

The historical open issues no longer described the current product. On 30 August 2026 the stale issue set was reconciled:

- #1–#5 closed as completed
- #6 closed as superseded/not planned in the completed product
- #7 closed as completed, with Companion Hold as the current terminology/implementation
- #30, #42, #52, #57 and #58 closed as superseded/not planned

The current open work is now limited to the real release/human acceptance and repository-protection gates.

## Validation and CI state

PR #62 merged as commit `d59d3a7a8d7a292cdc46e33c9eae874b378e92b2` and had successful TypeScript, deterministic-test and production-build validation.

During PR #63 reconciliation, the hosted runner exposed an `npm install` failure under Node 22 / npm 10.9.8 before project checks could start. The workflow was therefore pinned to Node `24.20.0` and records the Node/npm versions used. Under Node 24.20.0 / npm 11.19.0, dependency installation and `npm run check` passed, including all eight deterministic tests and the production build.

Because exact-head evidence is required, the final PR head must still be green before merge. No later documentation edit may inherit an earlier head's PASS without rerunning the gate.

## Release candidate rule

Do not create a misleading v1.0 downgrade: the package is already version `3.0.0`.

The intended release identity is therefore:

> Sample & Hold Lab 3.0.0 — Completed Teaching Laboratory

A release is accepted only after:

1. exact-head automated validation passes;
2. the public build is smoke-tested;
3. Start Audio / Panic / restart behaviour is physically checked;
4. S&H, T&H and Companion Hold are physically checked;
5. exact octave and reference-pitch behaviour is physically checked;
6. quantization, observation controls and cursors are physically checked;
7. one person unfamiliar with the project completes the learning journey with minimal coaching.

## Downstream work

The Beep/plugin idea is a separate downstream product lane. Sample & Hold Lab is its behavioural reference, not the plugin host or plugin codebase.
