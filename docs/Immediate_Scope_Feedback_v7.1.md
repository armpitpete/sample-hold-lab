# Immediate scope feedback v7.1

## Purpose

Make Sample Hold Lab more educational by making the graph respond clearly when settings change.

This is a visual/teaching behaviour change only.

No new audio routing was added.

## Problem

The scope kept too much old history after control changes.

That made it harder to see what changed when adjusting:

- input source
- mode
- clock / gate rate
- slew amount
- timing jitter
- manual CV

## Change

When one of those settings changes, the scope history restarts.

The app briefly shows a message such as:

```text
Scope restarted: slew changed
```

or:

```text
Scope restarted: input source changed
```

This makes the new setting easier to see immediately.

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

## What changed

- source changes restart the scope and recapture the new input
- mode changes restart the scope and recapture the new mode output
- manual CV changes restart the scope and recapture the manual value
- clock rate changes restart the timing view
- slew changes restart the scope view
- jitter changes restart the timing view
- the scope shows a short message explaining what changed
- visible prototype label updated to v7.1

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

## Good enough

A beginner should be able to move a setting and see the graph restart around the new behaviour instead of waiting for old history to scroll away.
