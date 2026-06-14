# Compact layout fix v7.0

## Purpose

Record the visual layout correction prompted by the app screenshot.

The page had become too tall and too spread out.

This is a UI/layout fix only.

## Problem

The current page used too much vertical space because of:

- very large hero text
- generous page padding
- large module cards
- a narrow main shell
- a forced tall processor/trigger column
- oversized card padding and gaps
- scope panel taking too much vertical room

The visible page also still showed stale prototype wording in the header.

## Decision

Make the interface denser and use more horizontal space.

Use smaller writing, tighter cards, and a wider shell.

## Boundary

No audio behaviour changes.

The current audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

## Still visual only

- filter cutoff
- level
- Super high companion output
- Super low companion output

## What changed

- reduced hero heading size
- reduced intro size
- reduced page padding
- widened the shell
- tightened patch grid gaps
- reduced module padding
- reduced minimum card heights
- reduced forced processor/trigger height
- reduced button/output padding
- reduced scope panel spacing
- reduced rule-card emphasis
- updated visible prototype label to v7.0

## What did not change

- no new audio routing
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

The app should feel less oversized on a desktop screen and use available horizontal space better while keeping the existing controls readable.
