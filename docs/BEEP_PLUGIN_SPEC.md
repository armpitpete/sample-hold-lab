# Beep Plugin — Product Specification v0.1

Status: specification only. No plugin implementation exists in Sample & Hold Lab.

## Purpose

Beep is a separate downstream product that may reuse proven Sample & Hold teaching behaviour. Sample & Hold Lab remains the behavioural reference and teaching application; it must not be converted into the plugin codebase.

## Reference behaviours inherited from Sample & Hold Lab

The plugin may reuse or reimplement, with tests, the following proven rules:

- Sample & Hold: trigger captures the current control value and holds it until the next trigger.
- Track & Hold: output follows while a gate is open and freezes when the gate closes.
- Companion Hold: centre is the captured value; high and low are related offsets from centre.
- Slew: output moves toward the current held target rather than jumping immediately.
- exact 1 V/octave mapping where pitch is used.
- optional semitone quantization at 1/12 V steps where relevant.

Sample & Hold Lab is the oracle for intended behaviour, not a dependency that Beep must embed.

## Separation rule

Beep gets its own:

- repository or clearly isolated package
- product README
- test suite
- release/version history
- plugin-format decision
- audio/MIDI/host compatibility policy
- CI/release pipeline

Do not add plugin SDKs, host code, DAW-specific code or packaging machinery to `sample-hold-lab`.

## v0.1 decision work

Before implementation, decide and record:

1. the exact job Beep performs for a musician;
2. whether Beep is an audio effect, instrument, MIDI effect, CV/modulation utility, or another plugin class;
3. first supported plugin format(s);
4. first supported operating system(s);
5. minimum host/DAW acceptance set;
6. which Sample & Hold behaviours are actually required;
7. whether Companion Hold belongs in Beep v0.1 or later;
8. whether Beep generates audio or control/modulation only;
9. automation/parameter requirements;
10. preset/state persistence requirements;
11. latency and real-time-safety requirements;
12. accessibility and control-labelling requirements.

## Recommended v0.1 scope

Keep the first implementation deliberately small:

```text
one input/control source
→ one Sample & Hold behaviour
→ one rate/trigger mechanism
→ one slew control
→ one clearly observable output
```

Do not begin with a full modular system, free patching, modulation matrix, multiple effects, large preset library or broad cross-platform packaging.

## Acceptance contract

Beep v0.1 is not accepted because it compiles. It must pass:

- deterministic behaviour tests derived from Sample & Hold Lab
- plugin validation for the chosen format
- host load/unload/reload test
- state save/restore test if state is supported
- automation test for exposed parameters
- audio/control continuity test under repeated start/stop
- one real musical-use test demonstrating why Beep is useful rather than merely technically correct

## Current boundary

This document authorizes no plugin implementation, repository creation, SDK installation, build-system change, packaging, signing, notarisation, deployment or release. Those begin only after the v0.1 product-class and format decisions are made.
