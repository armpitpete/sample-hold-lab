# Legacy module cleanup v7.3

## Purpose

Stop old modules from overwriting the current prototype label and recreating duplicate audio controls.

## Problem found locally

Local search showed these stale files:

- `src/audio-safety.ts` wrote `Software Prototype v2.9` and created the old `Audio Demo / Safety` section.
- `src/patch-summary.ts` wrote `Software Prototype v2.6`.

This meant the visible page could still show old version text even though the newer modules had been updated.

## Change

- `src/audio-safety.ts` is now a no-op compatibility shim.
- `src/patch-summary.ts` no longer writes to `.eyebrow`.
- Patch summary destination names now match the current boundary:
  - `Pitch audio-connected`
  - `Filter cutoff visual only`
  - `Level visual only`

## Current visible label source

The active visible label should now come from the current app/audio/destination modules only.

Expected visible label:

```text
Software Prototype v7.2
```

or newer.

## Current audio boundary

The only audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

## Still visual only

- filter cutoff
- level
- Super high companion output
- Super low companion output

## What did not change

- no filter audio
- no level audio
- no VCF / VCA
- no MIDI
- no presets
- no patch cables
- no modulation matrix
- no extra oscillator
- no effects
- no new destination
