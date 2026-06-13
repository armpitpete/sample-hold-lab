# Manual recipe test v4.0

## Purpose

Test the current app against the stable beginner manual recipes.

This is a verification note for issue #36.

No app behaviour was changed.

## Test method

This pass was done by source inspection of the current repository files.

Checked files:

- `docs/MANUAL.md`
- `index.html`
- `src/main.ts`
- `package.json`

This was not an audible browser test.

The result below records whether the current source appears to support the manual recipes.

## Current manual boundary

The manual says the only audio path is:

```text
held/slewed main CV -> oscillator pitch
```

The manual also says these remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

## Source inspection summary

### Confirmed present in source

The current app source includes:

- Input source selector
- LFO input source
- Noise input source
- Manual CV input source
- S&H mode
- T&H mode
- Super S&H mode
- Manual trigger button
- Clock / gate rate control
- Slew amount control
- Timing jitter control
- Scope canvas
- Raw main output
- Slewed main output
- Super high visual trace
- Super low visual trace
- Gate open / gate closed display behaviour for T&H

These match large parts of the manual.

### Mismatch found

The current `src/main.ts` source does **not** appear to include:

- Start Audio button
- Panic / Stop Audio button
- oscillator audio setup
- destination selector
- Pitch destination selector option
- Filter cutoff destination selector option
- Level destination selector option

This means the full manual recipe set cannot currently be confirmed from the source as written.

## Recipe results

| Manual recipe | Source inspection result | Notes |
|---|---|---|
| LFO into S&H, visual only | Pass by source inspection | LFO, S&H, Scope, Manual trigger, and Slew amount are present. |
| LFO into S&H, pitch audio demo | Blocked | Source does not show Start Audio, Panic / Stop Audio, oscillator audio, or Pitch destination control. |
| Noise into S&H, visual only | Pass by source inspection | Noise source, S&H, Scope, Manual trigger, and Slew amount are present. |
| Manual CV into S&H, controlled test | Partial pass | Manual CV, S&H, Scope, Manual trigger, and Slew amount are present. Pitch/audio part is blocked by missing audio controls. |
| T&H comparison patch | Partial pass | T&H, gate behaviour, Scope, and Slew amount are present. Pitch/audio part is blocked by missing audio controls. |

## Behaviour boundary result

The source appears to support the visual lab behaviour.

The source does not currently support the manual's audio-demo instructions.

The source also does not currently expose destination choices for Pitch, Filter cutoff, or Level.

## Decision

Issue #36 should be treated as a mismatch discovery pass.

Do not add app behaviour inside #36.

Open a follow-up issue to decide whether to:

1. update the app to match the manual, or
2. update the manual to match the current app.

Given the recent project history, the better next step is likely to align the app UI with the stable manual boundary, but that should be a separate scoped issue.

## Follow-up required

Create a follow-up issue for the mismatch:

```text
v4.1 — Resolve manual/app mismatch after recipe test
```

The follow-up should decide whether to restore/add the documented audio controls and destination selector, or reduce the manual back to the currently visible app.
